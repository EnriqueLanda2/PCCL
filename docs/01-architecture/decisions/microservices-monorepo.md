# PCCL Microservices Monorepo Structure

## Purpose

This document defines the recommended folder structure for the distributed NestJS setup with 3 backend services and 3 microfrontends.

Use this document to:

- Organize each service in a predictable place.
- Share contracts and shared utilities without coupling services.
- Keep deployment and infrastructure files separated from application code.

## How To Use It

1. Create the root as a single monorepo.
2. Put each backend service in its own `apps/` folder.
3. Put each microfrontend in its own `frontends/` folder.
4. Put shared types and reusable primitives in `packages/`.
5. Keep infrastructure files in `infra/`.
6. Do not move database access logic into shared packages.

## Recommended Layout

```text
backend/
  apps/
    gateway/
    identity-service/
    learning-service/
    certification-audit-service/
  packages/
    contracts/
    shared-kernel/
    observability/
  infra/
    docker/
    postgres/
    redis/
    rabbitmq/
  docs/

frontend/
  apps/
    identity-mfe/
    learning-mfe/
    certification-mfe/
```

## Folder Responsibilities

### apps/gateway

- Receives all external traffic.
- Validates tokens and forwards requests.
- Handles request shaping and rate limiting.

### apps/identity-service

- Users.
- Roles.
- Privileges.
- Authentication support.

### apps/learning-service

- Courses.
- Lessons.
- Inscriptions.
- Progress tracking.
- Califications and assessment records.

### apps/certification-audit-service

- Certificate generation and validation.
- Audit logs and traceability.

### frontends/identity-mfe

- Login.
- Profile.
- User administration.
- Role and privilege administration.

### frontends/learning-mfe

- Course catalog.
- Lesson authoring.
- Course enrollment.
- Progress view.
- Califications and assessments.

### frontends/certification-mfe

- Certificate listing and download.
- Audit and reporting views.
- Compliance-focused administration.

### packages/contracts

- Event definitions.
- DTOs shared only as contracts.
- API request/response types.

### packages/shared-kernel

- Common utilities.
- Base exceptions.
- Date and ID helpers.
- Logging abstractions.

### packages/observability

- Shared tracing, logging, and metrics configuration.

### infra

- Docker Compose.
- Local broker setup.
- PostgreSQL bootstrap.
- Redis bootstrap.

## Setup Instructions

1. Generate each Nest app separately inside `apps/`.
2. Configure each app with its own `main.ts`, `app.module.ts`, and `.env` file.
3. Add a local `package.json` only at the monorepo root unless a service needs isolated tooling.
4. Keep contracts in TypeScript so both gateway and services can compile against the same schemas.
5. Keep Prisma schema per service if each service owns its database.
6. Keep each microfrontend focused on one user journey or business area.

## What This Structure Solves

- Makes each service deployable on its own.
- Prevents the codebase from turning into one large backend again.
- Allows independent scaling of auth and learning hot paths.
- Keeps shared code limited to contracts and utilities.
