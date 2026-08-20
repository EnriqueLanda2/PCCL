# Recuperación de contraseña por correo — diseño

Fecha: 2026-08-20

## Contexto

No existe infraestructura de correo en el backend (sin nodemailer, sin
SDK de ningún proveedor transaccional). El login (`LoginForm` en
`app/modules/auth/page.tsx`) ya tiene un link "¿Olvidaste tu
contraseña?" que hoy apunta a `href="#"`. Este spec cubre construir el
flujo completo: solicitar código, verificarlo y establecer nueva
contraseña.

Proveedor de correo elegido: **Resend**, con el dominio propio
`koodisoft.com` (verificación DNS del dominio la hace el usuario fuera
de este trabajo). Flujo elegido: **código OTP de 6 dígitos** (no link
con token) — el usuario lo pide desde la pantalla, lo recibe por
correo y lo teclea junto con la nueva contraseña. Expiración: **15
minutos**.

## Arquitectura

```
Frontend (2 pasos)  →  Gateway (HTTP)  →  RabbitMQ  →  identity-service  →  Resend
```

Se agregan dos endpoints al mismo patrón que ya usa `/auth/login` y
`/auth/register` (gateway hace `client.send(PATTERN, dto)` a
identity-service vía microservicio, ver `identity.controller.ts` +
`IDENTITY_PATTERNS`).

### Contratos nuevos (`libs/contracts/src/identity/identity.patterns.ts`)

```ts
AUTH_FORGOT_PASSWORD: 'identity.auth.forgot_password',
AUTH_RESET_PASSWORD:  'identity.auth.reset_password',
```

### Endpoints HTTP (gateway, `identity.controller.ts`)

- `POST /auth/forgot-password` — body `{ email: string }`.
  Responde siempre `{ message: 'Si el correo existe, te llegó un código.' }`
  (200), exista o no la cuenta — evita enumeración de usuarios.
- `POST /auth/reset-password` — body
  `{ email: string; code: string; newPassword: string }`.
  200 si el reset fue exitoso; 400 con mensaje claro si el código es
  inválido/expirado/agotado.

## Modelo de datos

Nueva tabla en `apps/identity-service/prisma/schema.prisma`, junto a
`User`, `Notification`, etc.:

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

Agregar relación inversa `passwordResetCodes PasswordResetCode[]` en
`model User`.

Reglas de negocio (en `AuthService`, mismo archivo que `login`/`register`):

- **Un código vivo a la vez**: al pedir uno nuevo, se borran/invalidan
  los anteriores del usuario que no estén usados.
- **Anti-spam simple**: si ya existe un código no usado, no expirado y
  creado hace menos de 60s, la solicitud responde el mismo mensaje
  genérico sin generar ni reenviar otro correo (evita spamear al
  clickear "reenviar" repetido).
- **Hash del código**: igual que las contraseñas, con `bcrypt`. El
  código en texto plano solo existe en memoria y en el correo enviado,
  nunca en DB.
- **Intentos**: cada verificación fallida de `reset-password`
  incrementa `attempts`. Al llegar a 5, el código se invalida
  (`usedAt` se marca aunque no se haya usado con éxito) y hay que
  pedir uno nuevo.
- **Expiración**: 15 minutos desde `createdAt`.
- Al resetear con éxito: actualiza `passwordHash` del `User` y marca
  el código `usedAt`.

## Módulo de correo

Nuevo módulo `apps/identity-service/src/modules/mail/`:

- `mail.service.ts` — wrapper delgado sobre el SDK oficial `resend`.
  Un método: `sendPasswordResetCode(email: string, code: string)`.
- `mail.module.ts` — provee `MailService`, importado por `AuthModule`.

Config (`ConfigService`): `RESEND_API_KEY`, `MAIL_FROM` (ej.
`no-reply@koodisoft.com`).

**Fallback sin key**: si `RESEND_API_KEY` no está seteada en el
entorno, `MailService` no llama a Resend — hace `console.log` del
código con un prefijo claro (`[mail:dev] código para <email>: 123456`).
Esto permite probar el flujo completo en local antes de tener el
dominio verificado en Resend. Cuando la key exista, se usa el SDK real
sin cambiar código, solo variables de entorno.

Se agregan `RESEND_API_KEY=` y `MAIL_FROM=` a `.env.example` (vacías,
comentadas como opcionales — sin key, cae al modo log).

## Frontend

Nueva ruta pública `/identity/forgot-password`:

- `apps/frontend/web-shell/app/identity/forgot-password/page.tsx` —
  re-exporta desde el módulo, mismo patrón que `app/identity/auth/page.tsx`.
- `apps/frontend/web-shell/app/modules/auth/forgot-password.tsx` —
  componente con la lógica, reutiliza el estilo de tarjeta
  (`auth-card`) de `LoginForm`/`RegisterForm` pero sin el
  intercambio animado (es navegación de página completa, no hace
  falta evitar el desmontaje).

Dos pasos dentro del mismo componente (estado local `step`):

1. **Pedir código** — input de correo → `api.forgotPassword(email)` →
   pasa a paso 2 mostrando el correo ingresado.
2. **Verificar y resetear** — input de código (6 dígitos), nueva
   contraseña, confirmar contraseña → validación cliente igual que en
   `RegisterForm` (mínimo 8 caracteres, coinciden) →
   `api.resetPassword(email, code, newPassword)` → éxito → mensaje +
   redirect a `/identity/auth` (`router.replace`).

Cambios en archivos existentes:

- `lib/routes.ts` — agregar `appRoutes.forgotPassword` y sumarlo a
  `PUBLIC_ROUTES`.
- `lib/api.ts` — agregar `api.forgotPassword(email)` y
  `api.resetPassword(email, code, newPassword)` siguiendo el patrón
  de `post<T>()` ya usado por `login`/`register`.
- `app/modules/auth/page.tsx` — el link "¿Olvidaste tu contraseña?"
  en `LoginForm` cambia `href="#"` por `appRoutes.forgotPassword`.

## Manejo de errores

- Paso 1: siempre mensaje genérico de éxito (nunca revela si el
  correo existe). Error solo si falla la conexión con el servidor.
- Paso 2: mensajes específicos —
  - código inválido → "Código incorrecto."
  - código expirado o agotado (5 intentos) → "El código expiró o se
    agotaron los intentos. Solicita uno nuevo." + link para volver al
    paso 1.
  - contraseñas no coinciden / muy cortas → igual que `RegisterForm`.
  - error de conexión → mismo mensaje genérico que el resto del auth.

## Testing

- Unit tests de `AuthService` (identity-service): código válido,
  código expirado, código con intentos agotados, anti-spam de
  reenvío, reset exitoso actualiza `passwordHash`.
- `MailService`: fallback a log cuando no hay `RESEND_API_KEY`.
- Prueba manual del flujo completo en navegador (login → "olvidaste tu
  contraseña" → pedir código → verlo en log del backend, ya que no hay
  key de Resend todavía → resetear → login con contraseña nueva).

## Fuera de alcance

- Verificación del dominio en Resend (lo hace el usuario en su
  dashboard/DNS).
- Rate limiting a nivel de infraestructura (ej. por IP) — el anti-spam
  es solo a nivel de aplicación, por usuario/email.
- Notificación push o in-app de "tu contraseña cambió" — no pedida.
