# PCCL Microservices Architecture Proposal

## Goal

Move PCCL from a single backend into a distributed architecture that reduces saturation, isolates failures, and allows each domain to scale independently.

## Recommended Approach

The best option for PCCL is a staged migration from the current modular monolith to microservices, not a big-bang split.

Why this is the best fit:

- The current backend already has clear bounded contexts.
- A staged extraction lowers operational risk and avoids breaking the platform during the migration.
- The most used areas can scale independently once split.
- Async communication helps absorb load spikes and reduces direct coupling.

## Target Style

- API Gateway in front of all services.
- Database per service.
- Async event bus for cross-domain events.
- Synchronous calls only when the user-facing flow really needs an immediate response.
- Token-based auth shared across frontend and backend.

## Proposed Service Split

### 1. API Gateway

Responsibility:

- Single entry point for all frontends and external clients.
- Routing, auth validation, rate limiting, request tracing, and response shaping.

Exposes:

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /dashboard`
- Proxy routes to internal services.

### 2. Identity Service

Owns:

- Users
- Roles
- Privileges
- User-role assignments

Responsibilities:

- Registration and user profile management.
- Authentication support.
- Authorization data and role catalog.
- Session-related claims and permissions.

### 3. Learning Service

Owns:

- Courses
- Lessons
- Inscriptions
- Progress
- Califications

Responsibilities:

- Course and lesson management.
- Enrollment and completion flow.
- Progress tracking.
- Evaluation and scoring.
- Student learning state.

### 4. Certification & Audit Service

Owns:

- Certificates
- Audit logs

Responsibilities:

- Certificate generation and validation.
- Append-only activity log.
- Security and transaction traceability.
- Reporting for compliance and history.

## Proposed Microfrontend Split

### 1. Identity Microfrontend

Use:

- Login and logout.
- Profile management.
- User administration.
- Role and privilege administration.

### 2. Learning Microfrontend

Use:

- Course catalog.
- Lesson authoring.
- Course enrollment.
- Progress view.
- Califications and assessments.

### 3. Certification Microfrontend

Use:

- Certificate listing and download.
- Audit and reporting views.
- Compliance-focused administration.

## Data Ownership Rules

- Each service owns its own database schema.
- No service queries another service's database directly.
- Cross-service data must be shared through APIs or events.
- Read-only duplication is allowed only in denormalized projections.

## Communication Model

### Synchronous

- Gateway to service requests.
- User-facing validations that require an immediate answer.
- Login and token issuance.
- Authorization checks.
- Course enrollment validations.

### Asynchronous

- `user.created`
- `role.assigned`
- `course.published`
- `lesson.created`
- `inscription.created`
- `inscription.completed`
- `progress.updated`
- `calification.created`
- `certificate.requested`
- `certificate.issued`
- `audit.recorded`

Recommended transport:

- RabbitMQ or NATS for the first version.
- Kafka only if the event volume becomes high enough to justify it.

## Suggested Infrastructure

- Frontend: 3 microfrontends in Next.js.
- API Gateway: NestJS.
- Services: NestJS microservices.
- Databases: PostgreSQL per service.
- Cache: Redis.
- Message broker: RabbitMQ or NATS.
- Observability: OpenTelemetry, centralized logs, health checks.

## Recommended Migration Order

1. Extract Identity Service and Identity Microfrontend.
2. Extract Learning Service and Learning Microfrontend.
3. Extract Certification & Audit Service and Certification Microfrontend.

## Risks

- Distributed transactions.
- Duplicate data across services.
- Increased debugging complexity.
- Network latency between services.

## Mitigations

- Use idempotent handlers.
- Use event-driven projections for read models.
- Keep service contracts versioned.
- Add tracing from day one.

## Initial Folder Structure

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
  infra/
    docker/
    rabbitmq/
    redis/
    postgres/

frontend/
  apps/
    identity-mfe/
    learning-mfe/
    certification-mfe/
```

## Next Documents To Add

- [Service contracts and event catalog](microservices-contracts.md)
- [Monorepo folder structure and setup](microservices-monorepo.md)
- [Docker Compose base for local orchestration](microservices-docker-compose.md)
- Database schema per service.
- Deployment topology.
- Authentication and authorization flow.
