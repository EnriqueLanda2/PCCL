Resumen rápido para `docker-compose` (desarrollo local)

Pasos básicos:

1. Construir y arrancar los contenedores:

```bash
docker compose up --build -d
```

2. Ver logs:

```bash
docker compose logs -f gateway
```

3. Aplicar migraciones (si usas Prisma desde el contenedor):
```bash
docker compose exec gateway bash -lc "npx prisma migrate deploy"
```

Notas:
- El `docker-compose.yml` está pensado para desarrollo: monta el código local (`./backend`) dentro del contenedor y ejecuta `npm install` al inicio.
- Variables de ejemplo en `.env.example` dentro de `backend/`.
- Si trabajas localmente (sin containers), sigue usando tus scripts habituales: `npm run build` y `npm run start:*`.

Preguntas útiles:
- ¿Quieres que añada Redis o un broker (RabbitMQ/NATS) al `compose` ahora?
- ¿Prefieres que cree `Dockerfile`s para cada servicio en lugar de usar `node:20` con `npm install` en `command`?

Notas sobre el cambio de esquema:
- Se añadieron los modelos `Evaluation` y `EvaluationAttempt` al archivo `prisma/schema.prisma`.
- Después de desplegar/ejecutar migraciones, ejecuta `npx prisma generate` si es necesario.
- Para desarrollo con Docker Compose, los servicios ahora se construyen localmente usando `Dockerfile.gateway`, `Dockerfile.identity`, `Dockerfile.learning` y `Dockerfile.certification`.
 - Los contenedores montan el código local (`./backend`) para permitir desarrollo en caliente (rebuilds locales aún necesarios para cambios TypeScript que afectan `dist`).

Comandos recomendados:

```bash
# Levantar (con build inicial)
docker compose up --build -d

# Aplicar migraciones desde el gateway (deploy para entornos de CI/CD o dev interactivo)
docker compose exec gateway bash -lc "npx prisma migrate dev --name add-evaluations-and-attempts"

# Ver logs
docker compose logs -f gateway
```
