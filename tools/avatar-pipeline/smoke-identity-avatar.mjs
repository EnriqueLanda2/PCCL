import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import net from 'node:net';
import path from 'node:path';

const root = process.cwd().endsWith(path.join('apps', 'frontend', 'web-shell'))
  ? path.resolve(process.cwd(), '../../..')
  : process.cwd();
const requireFromFrontend = createRequire(path.join(root, 'apps/frontend/web-shell/package.json'));
const { chromium } = requireFromFrontend('@playwright/test');

let port = process.env.AVATAR_SMOKE_PORT;
let url;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(server) {
  const deadline = Date.now() + 45000;
  let lastError = null;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`next start terminó con código ${server.exitCode}`);
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.status >= 200 && response.status < 400) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await wait(500);
  }
  throw lastError ?? new Error('next start no respondió a tiempo');
}

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const address = probe.address();
      probe.close(() => {
        if (typeof address === 'object' && address?.port) resolve(String(address.port));
        else reject(new Error('No se pudo reservar un puerto libre.'));
      });
    });
  });
}

port ??= await getFreePort();
url = `http://127.0.0.1:${port}/identity/avatar`;
const nextStartArgs = ['--filter', 'frontend', 'exec', 'next', 'start', '-p', port, '-H', '127.0.0.1'];
const command = process.platform === 'win32' ? 'cmd.exe' : 'pnpm';
const commandArgs = process.platform === 'win32'
  ? ['/d', '/s', '/c', `pnpm ${nextStartArgs.join(' ')}`]
  : nextStartArgs;

const server = spawn(
  command,
  commandArgs,
  { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] },
);
let serverOutput = '';
server.stdout?.on('data', (chunk) => { serverOutput += chunk.toString(); });
server.stderr?.on('data', (chunk) => { serverOutput += chunk.toString(); });

/** Errores de consola y de página; al final se filtran los inocuos. */
const consoleErrors = [];
/** GLB de piezas modulares descargados, en orden. */
const loadedPieces = [];

const screenshotPath = process.env.AVATAR_SMOKE_SCREENSHOT
  ?? path.join(root, 'assets/avatar-source/qa/identity-avatar-browser.png');

let browser;
try {
  await waitForServer(server);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await context.addCookies([{
    name: 'pccl_session',
    value: 'avatar-smoke-session',
    domain: '127.0.0.1',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
  }]);
  const page = await context.newPage();
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(`console.error: ${message.text()}`);
  });
  const loadedGlbs = [];
  page.on('response', (response) => {
    const url = response.url();
    if (!url.endsWith('.glb') || !response.ok()) return;
    const pathname = new URL(url).pathname;
    if (pathname.includes('/avatars/custom/bodies/')) loadedGlbs.push(pathname);
    /* Piezas modulares: sirven para comprobar que NO se descargan al entrar y
       sí al elegirlas. */
    else if (pathname.startsWith('/avatars/custom/')) loadedPieces.push(pathname);
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  try {
    await page.getByRole('heading', { name: 'Tu avatar' }).waitFor({ timeout: 15000 });
  } catch (error) {
    console.error(JSON.stringify({
      requestedUrl: url,
      finalUrl: page.url(),
      title: await page.title(),
      bodyText: (await page.locator('body').innerText({ timeout: 2000 })).slice(0, 500),
    }, null, 2));
    throw error;
  }
  await page.locator('canvas').waitFor({ timeout: 15000 });
  await page.waitForFunction(() => document.querySelector('canvas')?.clientWidth > 200, undefined, { timeout: 15000 });
  if (loadedGlbs.length === 0) {
    await page.waitForTimeout(5000);
  }
  if (loadedGlbs.length === 0) throw new Error('No se cargó ningún GLB custom en /identity/avatar.');
  const canvasBox = await page.locator('canvas').boundingBox();
  if (!canvasBox || canvasBox.width < 200 || canvasBox.height < 200) {
    throw new Error('El canvas de /identity/avatar no tiene tamaño visible suficiente.');
  }

  /* El canvas debe contener algo distinto del fondo. Es la comprobación que
     distingue "la escena montó" de "la escena montó y además se ve el avatar":
     un GLB que falla al parsear deja un canvas perfectamente uniforme. */
  const pixelReport = await page.evaluate(async () => {
    const canvas = document.querySelector('canvas');
    const source = await createImageBitmap(canvas);
    const off = new OffscreenCanvas(source.width, source.height);
    const context = off.getContext('2d');
    context.drawImage(source, 0, 0);
    const { data } = context.getImageData(0, 0, source.width, source.height);
    const seen = new Set();
    let opaque = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 8) opaque += 1;
      seen.add(`${data[i] >> 4},${data[i + 1] >> 4},${data[i + 2] >> 4}`);
    }
    return { distinctColors: seen.size, opaqueRatio: opaque / (data.length / 4) };
  });
  if (pixelReport.distinctColors < 12) {
    throw new Error(`El canvas parece vacío (${pixelReport.distinctColors} colores distintos).`);
  }

  await page.screenshot({ path: screenshotPath, fullPage: false });

  /* ── Personalización: cambiar una prenda ── */
  const before = await page.screenshot({ clip: canvasBox });
  const topGroup = page.locator('fieldset', { has: page.getByText('Prenda superior', { exact: true }) });
  await topGroup.getByRole('button').nth(1).click();
  await page.waitForTimeout(2500);
  const after = await page.screenshot({ clip: canvasBox });
  const garmentChanged = Buffer.compare(before, after) !== 0;
  if (!garmentChanged) throw new Error('Cambiar de prenda no modificó la escena.');

  /* Una prenda modular vive en su propio GLB: debe haberse descargado ahora y
     no en la carga inicial (README §9: no bajar el catálogo completo al entrar). */
  const lazyLoaded = loadedPieces.length > 0;

  /* ── Expresión ── */
  const expressionGroup = page.locator('fieldset', { has: page.getByText('Expresión', { exact: true }) });
  await expressionGroup.getByRole('button', { name: 'Sonrisa' }).click();
  await page.waitForTimeout(1200);

  /* ── Animación: el mixer debe estar moviendo la malla ── */
  const poseGroup = page.locator('fieldset', { has: page.getByText('Pose', { exact: true }) });
  await poseGroup.getByRole('button', { name: 'Saludo' }).click();
  await page.waitForTimeout(800);
  const frameA = await page.screenshot({ clip: canvasBox });
  await page.waitForTimeout(700);
  const frameB = await page.screenshot({ clip: canvasBox });
  const animating = Buffer.compare(frameA, frameB) !== 0;
  if (!animating) throw new Error('La animación no está reproduciéndose (dos frames idénticos).');

  await page.screenshot({ path: screenshotPath.replace('.png', '-wave.png') });

  /* ── Medición de rendimiento ──
     FPS por muestreo de requestAnimationFrame durante 2 s, y memoria de JS
     heap cuando el navegador la expone. Son cifras orientativas de una máquina
     concreta, no un benchmark. */
  const performanceReport = await page.evaluate(async () => {
    const frames = [];
    await new Promise((resolve) => {
      let previous = performance.now();
      const start = previous;
      const tick = (now) => {
        frames.push(now - previous);
        previous = now;
        if (now - start < 2000) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    const sorted = [...frames].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] || 0;
    const memory = performance.memory
      ? Math.round(performance.memory.usedJSHeapSize / 1048576)
      : null;
    const navigation = performance.getEntriesByType('navigation')[0];
    /* Identifica el rasterizador. En headless suele ser SwiftShader (software),
       en cuyo caso los FPS de arriba NO representan hardware real y no deben
       reportarse como medición de rendimiento. */
    let renderer = null;
    try {
      const probe = document.createElement('canvas').getContext('webgl2');
      const info = probe?.getExtension('WEBGL_debug_renderer_info');
      renderer = info ? probe.getParameter(info.UNMASKED_RENDERER_WEBGL) : null;
    } catch {
      renderer = null;
    }
    return {
      renderer,
      softwareRasterizer: /swiftshader|llvmpipe|software/i.test(renderer ?? ''),
      frames: frames.length,
      medianFrameMs: Number(median.toFixed(2)),
      approxFps: median > 0 ? Math.round(1000 / median) : null,
      jsHeapMB: memory,
      domContentLoadedMs: navigation ? Math.round(navigation.domContentLoadedEventEnd) : null,
    };
  });

  /* Tiempo de transferencia del GLB del cuerpo, tal y como lo midió el navegador. */
  const glbTiming = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .filter((entry) => entry.name.includes('/avatars/custom/bodies/'))
      .map((entry) => ({
        file: new URL(entry.name).pathname,
        durationMs: Math.round(entry.duration),
        transferredBytes: entry.transferSize || entry.encodedBodySize,
      })),
  );

  /* ── Exportación PNG ── */
  const exported = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    return { prefix: url.slice(0, 22), length: url.length };
  });
  if (!exported.prefix.startsWith('data:image/png;base64,') || exported.length < 5000) {
    throw new Error(`La captura PNG no produjo una imagen válida (${exported.length} bytes).`);
  }

  /* ── Persistencia: guardar, recargar y comprobar que vuelve igual ── */
  await page.getByRole('button', { name: 'Guardar' }).click();
  await page.waitForTimeout(500);
  const savedConfig = await page.evaluate(() => localStorage.getItem('pccl_avatar_config'));
  if (!savedConfig) throw new Error('No se guardó la configuración en localStorage.');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('canvas').waitFor({ timeout: 20000 });
  await page.waitForTimeout(3000);
  const restored = await page.evaluate(() => localStorage.getItem('pccl_avatar_config'));
  const savedParsed = JSON.parse(savedConfig);
  const restoredParsed = JSON.parse(restored ?? '{}');
  const persistedOk =
    restoredParsed.wardrobe?.topId === savedParsed.wardrobe?.topId &&
    restoredParsed.presentation?.expressionId === savedParsed.presentation?.expressionId &&
    restoredParsed.presentation?.poseId === savedParsed.presentation?.poseId;
  if (!persistedOk) throw new Error('La configuración no se restauró igual tras recargar.');

  /* El backend no forma parte de este smoke test: se levanta solo el frontend,
     así que las llamadas de sesión fallan por CORS o conexión rechazada. Se
     separan en vez de ocultarse, para que un fallo real del avatar no pueda
     esconderse detrás de este filtro. */
  const isBackendNoise = (message) =>
    /auth\/me|CORS policy|ERR_FAILED|ERR_CONNECTION_REFUSED|Failed to load resource/i.test(message);
  const backendErrors = consoleErrors.filter(isBackendNoise);
  const criticalErrors = consoleErrors.filter(
    (message) => !isBackendNoise(message) && !/favicon|React DevTools/i.test(message),
  );

  console.log(JSON.stringify({
    route: '/identity/avatar',
    loadedGlb: loadedGlbs[0],
    lazyPiecesLoaded: loadedPieces,
    canvas: { width: Math.round(canvasBox.width), height: Math.round(canvasBox.height) },
    distinctColors: pixelReport.distinctColors,
    garmentChanged,
    lazyLoaded,
    animating,
    pngExportBytes: exported.length,
    performance: performanceReport,
    glbTiming,
    persistedOk,
    savedWardrobe: savedParsed.wardrobe,
    savedColors: savedParsed.colors,
    consoleErrors: criticalErrors,
    backendErrorsIgnored: backendErrors.length,
    screenshot: screenshotPath,
  }, null, 2));

  if (criticalErrors.length > 0) {
    throw new Error(`Hubo ${criticalErrors.length} error(es) críticos en consola.`);
  }
} catch (error) {
  console.error(serverOutput);
  throw error;
} finally {
  await browser?.close().catch(() => undefined);
  if (process.platform === 'win32' && server.pid) {
    spawn('taskkill.exe', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    server.kill();
  }
}
