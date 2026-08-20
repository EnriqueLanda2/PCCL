# Recuperación de contraseña por correo — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar funcionando el flujo completo de "¿Olvidaste tu contraseña?" — el usuario pide un código OTP de 6 dígitos por correo (Resend), lo verifica y establece una contraseña nueva.

**Architecture:** Dos endpoints HTTP nuevos en el gateway (`/auth/forgot-password`, `/auth/reset-password`) que se reenvían por RabbitMQ/NATS a `identity-service`, igual que `/auth/login` y `/auth/register`. `identity-service` guarda el código (hasheado, 15 min de vida, máx. 5 intentos) en una tabla Postgres nueva y lo manda por correo vía Resend — o lo loggea a consola si no hay `RESEND_API_KEY` todavía. El frontend agrega una pantalla nueva de 2 pasos.

**Tech Stack:** NestJS (microservicios sobre NATS), Prisma/Postgres, `resend` SDK, Next.js 16 (App Router) + Vitest (sin tests automáticos de frontend — no hay convención existente para páginas, ver spec).

**Spec:** `docs/superpowers/specs/2026-08-20-password-recovery-design.md`

## Global Constraints

- Nunca revelar si un correo existe o no (mensaje genérico en ambos pasos cuando el usuario no existe).
- Código: 6 dígitos, expira a los 15 minutos, máximo 5 intentos fallidos antes de invalidarse.
- Un código vivo a la vez por usuario; pedir uno nuevo invalida los anteriores.
- Sin `RESEND_API_KEY` en el entorno, el correo se loggea a consola en vez de enviarse — no debe lanzar error.
- Seguir el patrón existente de excepciones HTTP (`BadRequestException`, etc.) — `ServiceExceptionFilter` ya las traduce correctamente a través de NATS, no usar `RpcException` a mano.
- Los payloads de `@MessagePattern` se tipan inline (`{ email: string }`), como ya hacen `login`/`register` en `auth.controller.ts` — las clases DTO de esa carpeta existen pero no se usan ni se validan con un pipe global; no agregar DTOs nuevos, mantener el mismo estilo inline.

---

### Task 1: Modelo de datos `PasswordResetCode`

**Files:**
- Modify: `apps/backend/apps/identity-service/prisma/schema.prisma`

**Interfaces:**
- Produces: modelo Prisma `PasswordResetCode` con campos `id, userId, codeHash, attempts, expiresAt, usedAt, createdAt`, relación `user: User`. Cliente generado expone `prisma.passwordResetCode.{findFirst,create,update,updateMany}`.

- [ ] **Step 1: Agregar el modelo al schema**

En `apps/backend/apps/identity-service/prisma/schema.prisma`, agregar (cerca de `model Notification`, después de su cierre `}`):

```prisma
model PasswordResetCode {
  id        String    @id @default(uuid()) @db.Uuid
  userId    String    @map("user_id") @db.Uuid
  codeHash  String    @map("code_hash") @db.VarChar(255)
  attempts  Int       @default(0)
  expiresAt DateTime  @map("expires_at") @db.Timestamp(6)
  usedAt    DateTime? @map("used_at") @db.Timestamp(6)
  createdAt DateTime  @default(now()) @map("created_at") @db.Timestamp(6)
  user      User      @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("password_reset_codes")
}
```

Y en `model User`, junto a `notifications   Notification[]`, agregar:

```prisma
  passwordResetCodes PasswordResetCode[]
```

- [ ] **Step 2: Levantar la infra de dev (si no está corriendo)**

Run: `cd apps/backend && pnpm infra:up`

- [ ] **Step 3: Crear y aplicar la migración**

Run: `cd apps/backend && pnpm run prisma:migrate:identity -- --name add_password_reset_codes`

Expected: crea `apps/backend/apps/identity-service/prisma/migrations/<timestamp>_add_password_reset_codes/migration.sql` y la aplica contra `IDENTITY_DATABASE_URL`. El comando ya corre `prisma generate` al final.

- [ ] **Step 4: Commit**

```bash
git add apps/backend/apps/identity-service/prisma/schema.prisma apps/backend/apps/identity-service/prisma/migrations
git commit -m "feat(identity): add password_reset_codes table"
```

---

### Task 2: Patterns de mensajería nuevos

**Files:**
- Modify: `apps/backend/libs/contracts/src/identity/identity.patterns.ts`

**Interfaces:**
- Produces: `IDENTITY_PATTERNS.AUTH_FORGOT_PASSWORD`, `IDENTITY_PATTERNS.AUTH_RESET_PASSWORD` (strings), consumidos por Task 5 (controller) y Task 6 (gateway).

- [ ] **Step 1: Agregar las dos claves**

En `apps/backend/libs/contracts/src/identity/identity.patterns.ts`, dentro del objeto, junto a `AUTH_REGISTER`:

```ts
  AUTH_LOGIN: 'identity.auth.login',
  AUTH_REGISTER: 'identity.auth.register',
  AUTH_FORGOT_PASSWORD: 'identity.auth.forgot_password',
  AUTH_RESET_PASSWORD: 'identity.auth.reset_password',
```

- [ ] **Step 2: Commit**

```bash
git add apps/backend/libs/contracts/src/identity/identity.patterns.ts
git commit -m "feat(contracts): add forgot/reset password patterns"
```

---

### Task 3: `MailService` (Resend, con fallback a log)

**Files:**
- Create: `apps/backend/apps/identity-service/src/modules/mail/mail.service.ts`
- Create: `apps/backend/apps/identity-service/src/modules/mail/mail.module.ts`
- Test: `apps/backend/apps/identity-service/src/modules/mail/mail.service.spec.ts`
- Modify: `apps/backend/package.json` (dependencia `resend`)

**Interfaces:**
- Produces: `MailService.sendPasswordResetCode(email: string, code: string): Promise<void>`. `MailModule` exporta `MailService`. Consumido por Task 4 (`AuthModule`/`AuthService`).
- Consumes: `ConfigService.get('RESEND_API_KEY')`, `ConfigService.get('MAIL_FROM', 'no-reply@koodisoft.com')`.

- [ ] **Step 1: Instalar el SDK de Resend**

Run: `pnpm --filter backend add resend`

- [ ] **Step 2: Escribir el test (falla primero)**

Crear `apps/backend/apps/identity-service/src/modules/mail/mail.service.spec.ts`:

```ts
import { Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

const sendMock = jest.fn().mockResolvedValue({ id: 'mail_1' });

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}));

function buildConfig(values: Record<string, unknown>): ConfigService {
  return {
    get: jest.fn((key: string, def?: unknown) => values[key] ?? def),
  } as unknown as ConfigService;
}

describe('MailService', () => {
  afterEach(() => jest.clearAllMocks());

  it('loggea el código en vez de mandarlo si no hay RESEND_API_KEY', async () => {
    const logSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    const service = new MailService(buildConfig({}));

    await service.sendPasswordResetCode('ana@example.com', '123456');

    expect(sendMock).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('123456'));
    logSpy.mockRestore();
  });

  it('manda el correo por Resend cuando hay RESEND_API_KEY', async () => {
    const service = new MailService(
      buildConfig({ RESEND_API_KEY: 'test_key', MAIL_FROM: 'no-reply@koodisoft.com' }),
    );

    await service.sendPasswordResetCode('ana@example.com', '123456');

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'ana@example.com',
        from: 'no-reply@koodisoft.com',
        subject: expect.any(String),
        html: expect.stringContaining('123456'),
      }),
    );
  });
});
```

- [ ] **Step 3: Correr el test y verificar que falla**

Run: `cd apps/backend && pnpm test -- mail.service.spec.ts`
Expected: FAIL — `Cannot find module './mail.service'`.

- [ ] **Step 4: Implementar `MailService`**

Crear `apps/backend/apps/identity-service/src/modules/mail/mail.service.ts`:

```ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger('MailService');
  private readonly resend: Resend | null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.from = this.config.get<string>('MAIL_FROM', 'no-reply@koodisoft.com');
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(`[mail:dev] código para ${email}: ${code}`);
      return;
    }

    await this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Tu código para restablecer tu contraseña',
      html: `<p>Tu código de verificación es <strong>${code}</strong>. Vence en 15 minutos.</p>`,
    });
  }
}
```

Crear `apps/backend/apps/identity-service/src/modules/mail/mail.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
```

- [ ] **Step 5: Correr el test y verificar que pasa**

Run: `cd apps/backend && pnpm test -- mail.service.spec.ts`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add apps/backend/package.json apps/backend/pnpm-lock.yaml apps/backend/apps/identity-service/src/modules/mail
git commit -m "feat(identity): add MailService with Resend + dev-log fallback"
```

---

### Task 4: `AuthService.forgotPassword` / `resetPassword`

**Files:**
- Modify: `apps/backend/apps/identity-service/src/modules/auth/auth.service.ts`
- Modify: `apps/backend/apps/identity-service/src/modules/auth/auth.module.ts`
- Test: `apps/backend/apps/identity-service/src/modules/auth/auth.service.password-reset.spec.ts`

**Interfaces:**
- Consumes: `MailService.sendPasswordResetCode(email, code)` (Task 3), `UsersService.findByEmail(email)` (existente, ya filtra `active: true`), `prisma.passwordResetCode.*`, `prisma.user.update`.
- Produces: `AuthService.forgotPassword(email: string): Promise<{ message: string }>`, `AuthService.resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }>`. Consumidos por Task 5 (controller).

- [ ] **Step 1: Escribir los tests (fallan primero)**

Crear `apps/backend/apps/identity-service/src/modules/auth/auth.service.password-reset.spec.ts`:

```ts
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

const USER = { id: 'user-1', email: 'ana@example.com', active: true } as any;

function buildService(opts: {
  user?: any;
  existingCode?: any;
} = {}) {
  const prisma = {
    passwordResetCode: {
      findFirst: jest.fn().mockResolvedValue(opts.existingCode ?? null),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      create: jest.fn().mockResolvedValue({ id: 'code-1' }),
      update: jest.fn().mockResolvedValue({}),
    },
    user: { update: jest.fn().mockResolvedValue({}) },
    $transaction: jest.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
  };
  const usersService = {
    findByEmail: jest.fn().mockResolvedValue(opts.user === undefined ? USER : opts.user),
  };
  const mailService = { sendPasswordResetCode: jest.fn().mockResolvedValue(undefined) };

  const service = new AuthService(
    usersService as any,
    {} as any,
    { get: jest.fn() } as any,
    {} as any,
    prisma as any,
    mailService as any,
  );

  return { service, prisma, usersService, mailService };
}

describe('AuthService · forgotPassword', () => {
  it('genera un código y manda el correo si el usuario existe', async () => {
    const { service, prisma, mailService } = buildService();

    const result = await service.forgotPassword('ana@example.com');

    expect(prisma.passwordResetCode.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ userId: 'user-1' }) }),
    );
    expect(mailService.sendPasswordResetCode).toHaveBeenCalledWith('ana@example.com', expect.any(String));
    expect(result).toEqual({ message: 'Si el correo existe, te llegó un código.' });
  });

  it('no crea código ni manda correo si el usuario no existe, pero responde igual', async () => {
    const { service, prisma, mailService } = buildService({ user: null });

    const result = await service.forgotPassword('nadie@example.com');

    expect(prisma.passwordResetCode.create).not.toHaveBeenCalled();
    expect(mailService.sendPasswordResetCode).not.toHaveBeenCalled();
    expect(result).toEqual({ message: 'Si el correo existe, te llegó un código.' });
  });

  it('no reenvía si ya hay un código pedido hace menos de 60s', async () => {
    const { service, prisma, mailService } = buildService({
      existingCode: {
        id: 'code-0',
        createdAt: new Date(Date.now() - 10_000),
        expiresAt: new Date(Date.now() + 14 * 60_000),
      },
    });

    await service.forgotPassword('ana@example.com');

    expect(prisma.passwordResetCode.create).not.toHaveBeenCalled();
    expect(mailService.sendPasswordResetCode).not.toHaveBeenCalled();
  });
});

describe('AuthService · resetPassword', () => {
  it('actualiza la contraseña con un código válido', async () => {
    const codeHash = await bcrypt.hash('123456', 10);
    const { service, prisma } = buildService({
      existingCode: { id: 'code-1', codeHash, attempts: 0, expiresAt: new Date(Date.now() + 60_000) },
    });

    const result = await service.resetPassword('ana@example.com', '123456', 'NuevaPass123');

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Contraseña actualizada.' });
  });

  it('rechaza un código incorrecto e incrementa attempts', async () => {
    const codeHash = await bcrypt.hash('123456', 10);
    const { service, prisma } = buildService({
      existingCode: { id: 'code-1', codeHash, attempts: 0, expiresAt: new Date(Date.now() + 60_000) },
    });

    await expect(service.resetPassword('ana@example.com', '000000', 'NuevaPass123')).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.passwordResetCode.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'code-1' }, data: expect.objectContaining({ attempts: 1 }) }),
    );
  });

  it('invalida el código al llegar a 5 intentos fallidos', async () => {
    const codeHash = await bcrypt.hash('123456', 10);
    const { service, prisma } = buildService({
      existingCode: { id: 'code-1', codeHash, attempts: 4, expiresAt: new Date(Date.now() + 60_000) },
    });

    await expect(service.resetPassword('ana@example.com', '000000', 'NuevaPass123')).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.passwordResetCode.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'code-1' },
        data: expect.objectContaining({ attempts: 5, usedAt: expect.any(Date) }),
      }),
    );
  });

  it('rechaza un código expirado', async () => {
    const codeHash = await bcrypt.hash('123456', 10);
    const { service } = buildService({
      existingCode: { id: 'code-1', codeHash, attempts: 0, expiresAt: new Date(Date.now() - 1000) },
    });

    await expect(service.resetPassword('ana@example.com', '123456', 'NuevaPass123')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rechaza si no hay ningún código pedido', async () => {
    const { service } = buildService({ existingCode: null });

    await expect(service.resetPassword('ana@example.com', '123456', 'NuevaPass123')).rejects.toThrow(
      BadRequestException,
    );
  });
});
```

- [ ] **Step 2: Correr los tests y verificar que fallan**

Run: `cd apps/backend && pnpm test -- auth.service.password-reset.spec.ts`
Expected: FAIL — `forgotPassword`/`resetPassword` no existen en `AuthService`.

- [ ] **Step 3: Implementar los métodos**

En `apps/backend/apps/identity-service/src/modules/auth/auth.service.ts`, cambiar los imports del inicio por:

```ts
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RbacService } from '../rbac/rbac.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

const RESET_CODE_TTL_MS = 15 * 60_000;
const RESET_CODE_RESEND_COOLDOWN_MS = 60_000;
const RESET_CODE_MAX_ATTEMPTS = 5;
const GENERIC_FORGOT_MESSAGE = 'Si el correo existe, te llegó un código.';
const INVALID_CODE_MESSAGE = 'Código incorrecto.';
const EXPIRED_CODE_MESSAGE = 'El código expiró o se agotaron los intentos. Solicita uno nuevo.';
```

Agregar `mailService` al constructor:

```ts
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly rbacService: RbacService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}
```

Y agregar, después de `register(...)`:

```ts
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const existing = await this.prisma.passwordResetCode.findFirst({
        where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' },
      });
      const recentlyRequested =
        existing && Date.now() - existing.createdAt.getTime() < RESET_CODE_RESEND_COOLDOWN_MS;

      if (!recentlyRequested) {
        await this.prisma.passwordResetCode.updateMany({
          where: { userId: user.id, usedAt: null },
          data: { usedAt: new Date() },
        });

        const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
        const codeHash = await bcrypt.hash(code, 10);
        await this.prisma.passwordResetCode.create({
          data: {
            userId: user.id,
            codeHash,
            expiresAt: new Date(Date.now() + RESET_CODE_TTL_MS),
          },
        });

        await this.mailService.sendPasswordResetCode(user.email, code);
      }
    }

    return { message: GENERIC_FORGOT_MESSAGE };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException(INVALID_CODE_MESSAGE);

    const record = await this.prisma.passwordResetCode.findFirst({
      where: { userId: user.id, usedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException(EXPIRED_CODE_MESSAGE);
    }

    const valid = await bcrypt.compare(code, record.codeHash);
    if (!valid) {
      const attempts = record.attempts + 1;
      const exhausted = attempts >= RESET_CODE_MAX_ATTEMPTS;
      await this.prisma.passwordResetCode.update({
        where: { id: record.id },
        data: exhausted ? { attempts, usedAt: new Date() } : { attempts },
      });
      throw new BadRequestException(exhausted ? EXPIRED_CODE_MESSAGE : INVALID_CODE_MESSAGE);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, updatedBy: 'password-reset' },
      }),
      this.prisma.passwordResetCode.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Contraseña actualizada.' };
  }
```

En `apps/backend/apps/identity-service/src/modules/auth/auth.module.ts`, importar y wirear `MailModule`:

```ts
import { MailModule } from '../mail/mail.module';
```

y agregarlo al array `imports` del `@Module`, junto a `RbacModule`.

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `cd apps/backend && pnpm test -- auth.service.password-reset.spec.ts`
Expected: PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git add apps/backend/apps/identity-service/src/modules/auth
git commit -m "feat(identity): add forgotPassword/resetPassword to AuthService"
```

---

### Task 5: Handlers de mensajería en `identity-service`

**Files:**
- Modify: `apps/backend/apps/identity-service/src/modules/auth/auth.controller.ts`

**Interfaces:**
- Consumes: `IDENTITY_PATTERNS.AUTH_FORGOT_PASSWORD`, `IDENTITY_PATTERNS.AUTH_RESET_PASSWORD` (Task 2); `AuthService.forgotPassword`/`resetPassword` (Task 4).
- Produces: handlers NATS que el gateway invoca (Task 6).

- [ ] **Step 1: Agregar los handlers**

En `apps/backend/apps/identity-service/src/modules/auth/auth.controller.ts`, después de `register(...)`:

```ts
  @MessagePattern(IDENTITY_PATTERNS.AUTH_FORGOT_PASSWORD)
  forgotPassword(@Payload() payload: { email: string }) {
    return this.authService.forgotPassword(payload.email);
  }

  @MessagePattern(IDENTITY_PATTERNS.AUTH_RESET_PASSWORD)
  resetPassword(@Payload() payload: { email: string; code: string; newPassword: string }) {
    return this.authService.resetPassword(payload.email, payload.code, payload.newPassword);
  }
```

- [ ] **Step 2: Verificar que compila**

Run: `cd apps/backend && pnpm run build:identity`
Expected: build sin errores de TypeScript.

- [ ] **Step 3: Commit**

```bash
git add apps/backend/apps/identity-service/src/modules/auth/auth.controller.ts
git commit -m "feat(identity): wire forgot/reset password message patterns"
```

---

### Task 6: Endpoints HTTP en el gateway

**Files:**
- Modify: `apps/backend/apps/gateway/src/identity/identity.controller.ts`

**Interfaces:**
- Consumes: `IDENTITY_PATTERNS.AUTH_FORGOT_PASSWORD`/`AUTH_RESET_PASSWORD` (Task 2), respuestas `{ message: string }` de Task 4/5.
- Produces: `POST /auth/forgot-password`, `POST /auth/reset-password` — consumidos por el frontend (Task 9).

- [ ] **Step 1: Agregar los endpoints**

En `apps/backend/apps/gateway/src/identity/identity.controller.ts`, después de `register(...)`:

```ts
  @Public()
  @Post('auth/forgot-password')
  forgotPassword(@Body() dto: { email: string }) {
    return firstValueFrom(
      this.client.send(IDENTITY_PATTERNS.AUTH_FORGOT_PASSWORD, dto),
    );
  }

  @Public()
  @Post('auth/reset-password')
  resetPassword(@Body() dto: { email: string; code: string; newPassword: string }) {
    return firstValueFrom(
      this.client.send(IDENTITY_PATTERNS.AUTH_RESET_PASSWORD, dto),
    );
  }
```

- [ ] **Step 2: Verificar que compila**

Run: `cd apps/backend && pnpm run build:gateway`
Expected: build sin errores de TypeScript.

- [ ] **Step 3: Commit**

```bash
git add apps/backend/apps/gateway/src/identity/identity.controller.ts
git commit -m "feat(gateway): add forgot/reset password endpoints"
```

---

### Task 7: Variables de entorno

**Files:**
- Modify: `apps/backend/.env.example`

**Interfaces:**
- Consumes: nada.
- Produces: `RESEND_API_KEY`, `MAIL_FROM` leídas por `MailService` (Task 3).

- [ ] **Step 1: Agregar la sección**

En `apps/backend/.env.example`, después de la sección `# ── JWT ──...`, agregar:

```
# ── Correo (Resend) ─────────────────────────────────────────────────────────
# Sin RESEND_API_KEY, el código de recuperación se loggea a consola en vez de
# mandarse por correo — útil para probar el flujo en local.
RESEND_API_KEY=
MAIL_FROM=no-reply@koodisoft.com
```

- [ ] **Step 2: Commit**

```bash
git add apps/backend/.env.example
git commit -m "docs(backend): document RESEND_API_KEY and MAIL_FROM"
```

---

### Task 8: Registrar la ruta pública en el frontend

**Files:**
- Modify: `apps/frontend/web-shell/lib/routes.ts`
- Modify: `apps/frontend/web-shell/proxy.ts`
- Modify: `apps/frontend/web-shell/app/identity/layout.tsx`

**Interfaces:**
- Produces: `appRoutes.forgotPassword = '/identity/forgot-password'`, incluida en `PUBLIC_ROUTES`. Consumido por Task 10/11.

- [ ] **Step 1: `lib/routes.ts`**

Agregar la clave, junto a `register`:

```ts
  register:      '/identity/register',
  forgotPassword: '/identity/forgot-password',
```

Y sumarla a `PUBLIC_ROUTES`:

```ts
export const PUBLIC_ROUTES: string[] = [appRoutes.login, appRoutes.register, appRoutes.forgotPassword];
```

- [ ] **Step 2: `proxy.ts`**

En `PUBLIC_PATHS`, agregar `'/identity/forgot-password'`:

```ts
const PUBLIC_PATHS = [
  '/identity/auth',
  '/identity/register',
  '/identity/forgot-password',
  '/modules/auth',
  '/modules/register',
];
```

- [ ] **Step 3: `app/identity/layout.tsx`**

En su `PUBLIC_PATHS` local, agregar la misma ruta:

```ts
const PUBLIC_PATHS = ['/identity/auth', '/identity/register', '/identity/forgot-password'];
```

- [ ] **Step 4: Commit**

```bash
git add apps/frontend/web-shell/lib/routes.ts apps/frontend/web-shell/proxy.ts apps/frontend/web-shell/app/identity/layout.tsx
git commit -m "feat(frontend): register /identity/forgot-password as a public route"
```

---

### Task 9: Cliente API del frontend

**Files:**
- Modify: `apps/frontend/web-shell/lib/api.ts`

**Interfaces:**
- Consumes: `POST /auth/forgot-password`, `POST /auth/reset-password` (Task 6), helper `post<T>(url, data?)` de `./apiClient`.
- Produces: `api.forgotPassword(email: string): Promise<{ message: string }>`, `api.resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }>`. Consumidos por Task 10.

- [ ] **Step 1: Agregar los métodos**

En `apps/frontend/web-shell/lib/api.ts`, dentro de `export const api = { ... }`, después de `register`:

```ts
  forgotPassword: (email: string) =>
    post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    post<{ message: string }>('/auth/reset-password', { email, code, newPassword }),
```

- [ ] **Step 2: Verificar que compila**

Run: `cd apps/frontend/web-shell && pnpm exec tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/web-shell/lib/api.ts
git commit -m "feat(frontend): add forgotPassword/resetPassword to api client"
```

---

### Task 10: Pantalla de recuperación (2 pasos)

**Files:**
- Create: `apps/frontend/web-shell/app/modules/auth/forgot-password.tsx`
- Create: `apps/frontend/web-shell/app/identity/forgot-password/page.tsx`

**Interfaces:**
- Consumes: `api.forgotPassword`, `api.resetPassword` (Task 9); `appRoutes` (Task 8); `Field`/`Input` (`@/app/components/ui/Input`), `Button` (`@/app/components/ui/Button`), `Icon`/`APP_ICONS`, `ApiError` (`@/lib/api`).
- Produces: página en `/identity/forgot-password`.

- [ ] **Step 1: Crear el componente**

Crear `apps/frontend/web-shell/app/modules/auth/forgot-password.tsx`:

```tsx
'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Field, Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { api, ApiError } from '@/lib/api';
import { appRoutes } from '@/lib/routes';
import { APP_ICONS } from '@/lib/icons';

type Step = 'request' | 'verify';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-10">
      <div className="w-full max-w-md">
        <Link
          href={appRoutes.login}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 no-underline transition-colors hover:text-neutral-800"
        >
          <Icon icon={APP_ICONS.chevronLeft} width={16} height={16} />
          Volver al inicio de sesión
        </Link>

        {step === 'request' ? (
          <RequestCodeCard
            onSent={(sentEmail) => {
              setEmail(sentEmail);
              setStep('verify');
            }}
          />
        ) : (
          <VerifyCodeCard
            email={email}
            onBack={() => setStep('request')}
            onSuccess={() => router.replace(appRoutes.login)}
          />
        )}
      </div>
    </div>
  );
}

function RequestCodeCard({ onSent }: Readonly<{ onSent: (email: string) => void }>) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(email.trim());
      onSent(email.trim());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo conectar con el servidor. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card auth-stagger rounded-2xl border border-neutral-200 bg-neutral-100 p-7 shadow-[0_12px_32px_rgba(23,50,77,0.08)] sm:p-9">
      <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center text-white mb-6 shadow-md">
        <Icon icon={APP_ICONS.lock} width={26} height={26} />
      </div>

      <h2 className="font-serif text-3xl text-neutral-900 mb-1">¿Olvidaste tu contraseña?</h2>
      <p className="text-sm text-neutral-500 mb-7">
        Ingresa tu correo y te mandamos un código para restablecerla.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Correo electrónico">
          <Input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        {error && (
          <div className="animate-fade-in bg-danger-50 text-danger-600 text-sm px-4 py-3 rounded border-l-4 border-danger-400 leading-relaxed">
            {error}
          </div>
        )}

        <Button variant="primary" size="lg" block loading={loading} type="submit" className="mt-1">
          {loading ? 'Enviando…' : 'Enviar código'}
        </Button>
      </form>
    </div>
  );
}

function VerifyCodeCard({
  email,
  onBack,
  onSuccess,
}: Readonly<{ email: string; onBack: () => void; onSuccess: () => void }>) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(email, code.trim(), password);
      setDone(true);
      setTimeout(onSuccess, 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo conectar con el servidor. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="auth-card rounded-2xl border border-neutral-200 bg-neutral-100 p-7 shadow-[0_12px_32px_rgba(23,50,77,0.08)] sm:p-9 text-center">
        <div className="w-12 h-12 rounded-lg bg-success-500 flex items-center justify-center text-white mb-6 shadow-md mx-auto">
          <Icon icon={APP_ICONS.checkFilled} width={26} height={26} />
        </div>
        <h2 className="font-serif text-2xl text-neutral-900 mb-1">Contraseña actualizada</h2>
        <p className="text-sm text-neutral-500">Te llevamos al inicio de sesión…</p>
      </div>
    );
  }

  return (
    <div className="auth-card auth-stagger rounded-2xl border border-neutral-200 bg-neutral-100 p-7 shadow-[0_12px_32px_rgba(23,50,77,0.08)] sm:p-9">
      <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center text-white mb-6 shadow-md">
        <Icon icon={APP_ICONS.key} width={26} height={26} />
      </div>

      <h2 className="font-serif text-3xl text-neutral-900 mb-1">Ingresa el código</h2>
      <p className="text-sm text-neutral-500 mb-7">
        Te lo mandamos a <strong>{email}</strong>. Vence en 15 minutos.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Código de 6 dígitos">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            required
          />
        </Field>

        <Field label="Nueva contraseña" hint="Mínimo 8 caracteres">
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </Field>

        <Field label="Confirmar contraseña">
          <Input
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </Field>

        {error && (
          <div className="animate-fade-in bg-danger-50 text-danger-600 text-sm px-4 py-3 rounded border-l-4 border-danger-400 leading-relaxed">
            {error}
          </div>
        )}

        <Button variant="primary" size="lg" block loading={loading} type="submit" className="mt-1">
          {loading ? 'Verificando…' : 'Restablecer contraseña'}
        </Button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="text-xs text-neutral-400 text-center mt-6 w-full hover:text-neutral-600 underline-offset-2 hover:underline"
      >
        ¿No te llegó? Pedir otro código
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Crear la ruta**

Crear `apps/frontend/web-shell/app/identity/forgot-password/page.tsx`:

```tsx
export { default } from '../../modules/auth/forgot-password';
```

- [ ] **Step 3: Verificar que compila**

Run: `cd apps/frontend/web-shell && pnpm exec tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 4: Commit**

```bash
git add apps/frontend/web-shell/app/modules/auth/forgot-password.tsx apps/frontend/web-shell/app/identity/forgot-password/page.tsx
git commit -m "feat(frontend): add forgot-password 2-step screen"
```

---

### Task 11: Enlazar el link del login

**Files:**
- Modify: `apps/frontend/web-shell/app/modules/auth/page.tsx`

**Interfaces:**
- Consumes: `appRoutes.forgotPassword` (Task 8), página creada en Task 10.

- [ ] **Step 1: Cambiar el href**

En `apps/frontend/web-shell/app/modules/auth/page.tsx`, dentro de `LoginForm`, reemplazar:

```tsx
          <Link href="#" className="text-primary-500 hover:text-primary-600 font-medium">
            ¿Olvidaste tu contraseña?
          </Link>
```

por:

```tsx
          <Link href={appRoutes.forgotPassword} className="text-primary-500 hover:text-primary-600 font-medium">
            ¿Olvidaste tu contraseña?
          </Link>
```

(`appRoutes` ya está importado en este archivo.)

- [ ] **Step 2: Prueba manual end-to-end**

Con `pnpm dev` corriendo (gateway + identity-service + frontend) y sin `RESEND_API_KEY` seteada aún:

1. Ir a `/identity/auth`, clic en "¿Olvidaste tu contraseña?" → debe llevar a `/identity/forgot-password`.
2. Ingresar el correo de un usuario existente → debe mostrar el paso 2.
3. Ver el log de `identity-service` en consola (línea `[mail:dev] código para ...: ######`) y copiar el código.
4. Ingresarlo junto con una contraseña nueva → debe mostrar "Contraseña actualizada" y redirigir al login.
5. Iniciar sesión con la contraseña nueva → debe funcionar.
6. Repetir el paso 1-2 con un correo que no existe → debe mostrar el mismo mensaje genérico (sin filtrar nada en el log del backend).

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/web-shell/app/modules/auth/page.tsx
git commit -m "feat(frontend): link forgot-password from the login form"
```
