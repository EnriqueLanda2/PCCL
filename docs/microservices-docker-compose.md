# PCCL Docker Compose Base

## Purpose

This document defines the local orchestration stack for the distributed architecture with 3 backend services and 3 microfrontends.

Use this document to:

- Start all backend pieces together in development.
- Reproduce the same environment for the team.
- Validate inter-service communication before deployment.

## How To Use It

1. Start infrastructure first: PostgreSQL, Redis, and the broker.
2. Start the gateway and services after the dependencies are healthy.
3. Start the three microfrontends after the gateway is ready.
4. Use one database per service in production.
5. Keep local development simple, even if production later uses managed services.

## Base Stack

- Gateway
- Identity Service
- Learning Service
- Certification & Audit Service
- Identity MFE
- Learning MFE
- Certification MFE
- PostgreSQL
- Redis
- RabbitMQ or NATS

## Example Base Compose

```yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"

  gateway:
    build: ./apps/gateway
    env_file:
      - ./apps/gateway/.env
    depends_on:
      - postgres
      - redis
      - rabbitmq

  identity-service:
    build: ./apps/identity-service
    env_file:
      - ./apps/identity-service/.env
    depends_on:
      - postgres
      - rabbitmq

  learning-service:
    build: ./apps/learning-service
    env_file:
      - ./apps/learning-service/.env
    depends_on:
      - postgres
      - rabbitmq

  certification-audit-service:
    build: ./apps/certification-audit-service
    env_file:
      - ./apps/certification-audit-service/.env
    depends_on:
      - postgres
      - rabbitmq

  identity-mfe:
    build: ./frontends/identity-mfe
    env_file:
      - ./frontends/identity-mfe/.env
    depends_on:
      - gateway

  learning-mfe:
    build: ./frontends/learning-mfe
    env_file:
      - ./frontends/learning-mfe/.env
    depends_on:
      - gateway

  certification-mfe:
    build: ./frontends/certification-mfe
    env_file:
      - ./frontends/certification-mfe/.env
    depends_on:
      - gateway

volumes:
  postgres_data:
```

## Environment Variables To Standardize

- `DATABASE_URL`
- `REDIS_URL`
- `RABBITMQ_URL`
- `JWT_SECRET`
- `SERVICE_PORT`
- `SERVICE_NAME`
- `NODE_ENV`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_AUTH_MODE`

## Boot Order

1. Databases and broker.
2. Shared observability stack.
3. Gateway.
4. Business services.
5. Microfrontends.

## Why This File Exists

- To give the team a repeatable local setup.
- To make service startup order explicit.
- To show which infrastructure each service needs.
- To make later CI/CD and Kubernetes migration easier.
