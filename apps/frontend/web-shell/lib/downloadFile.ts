/** Fuerza la descarga real de un archivo (en vez de que el navegador lo abra
    inline) vía fetch→blob→<a download>. Mismo patrón que ya usa
    LessonFileViewer para documentos de lección — acá separado porque
    también lo necesita la descarga de certificados PDF. Si el fetch falla
    (CORS, red), cae a abrir la URL en una pestaña nueva como último recurso. */
export async function downloadFile(url: string, fileName: string): Promise<void> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
