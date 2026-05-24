# PCCL Microservices Contracts

## Purpose

This document defines how the 3 backend services talk to each other and how the gateway exposes the platform to the 3 microfrontends.

Use this document to:

- Keep service boundaries clear.
- Avoid direct database access between services.
- Standardize request and event payloads.
- Make contract changes versionable and reviewable.

## How To Use It

1. Define the public HTTP endpoints that the frontend will call.
2. Define the internal service-to-service calls only when an immediate response is required.
3. Prefer events for state changes that do not need a synchronous response.
4. Version payloads when a field changes in a breaking way.
5. Keep the event names stable and domain-oriented.

## HTTP API Boundary

The gateway is the only public entry point.

### Public routes through the gateway

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /dashboard`
- `GET /users`
- `POST /users`
- `GET /roles`
- `GET /courses`
- `POST /courses`
- `GET /lessons`
- `POST /lessons`
- `GET /inscriptions`
- `POST /inscriptions`
- `GET /progress`
- `POST /progress/:inscriptionId`
- `GET /califications`
- `POST /califications`
- `GET /certificates`
- `POST /certificates/:inscriptionId`
- `GET /audit`

### Internal service responsibilities

- Identity Service: users, roles, privileges, authentication support.
- Learning Service: courses, lessons, inscriptions, progress, califications.
- Certification & Audit Service: certificates and audit logs.

## Event Catalog

### Identity events

- `user.created`
- `role.assigned`
- `user.updated`

### Learning events

- `course.created`
- `course.published`
- `lesson.created`
- `lesson.updated`
- `lesson.deleted`
- `inscription.created`
- `inscription.updated`
- `inscription.completed`
- `inscription.deleted`
- `progress.created`
- `progress.updated`
- `progress.accessed`
- `calification.created`
- `calification.updated`
- `calification.deleted`

### Certification & Audit events

- `certificate.requested`
- `certificate.issued`
- `certificate.revoked`
- `audit.recorded`

## Event Payload Rules

- Include `eventId`, `eventType`, `occurredAt`, `source`, and `version`.
- Include the minimum payload needed by consumers.
- Use ISO-8601 timestamps.
- Use UUIDs for entity identifiers.
- Do not include sensitive data such as passwords or access tokens.

### Example event envelope

```json
{
  "eventId": "b6af5a5d-f4d4-4a5e-8d8c-07a8d2f7b3fd",
  "eventType": "inscription.completed",
  "version": 1,
  "source": "learning-service",
  "occurredAt": "2026-05-21T12:00:00.000Z",
  "data": {
    "inscriptionId": "f5f7f2d9-0c0d-4a4d-9a5f-0ec6a9a4d8c1",
    "userId": "6d1d2cb0-29b0-4c4e-9d14-8d5f5e17af90",
    "courseId": "9c1d48f2-7a7a-4b5b-8d8e-4f47f4a7ed11"
  }
}
```

## Recommended Sync Calls

Use synchronous calls only when the caller must know the result immediately:

- Login and token issuance.
- Authorization check for the current user.
- Create inscription with validation of user and course.
- Generate certificate only after verifying completion.

## Recommended Async Flows

- Course publication triggers downstream projections.
- Inscription completion triggers progress and certificate workflows.
- Audit service listens to all relevant events.

## Contract Versioning

- Add `v1`, `v2`, etc. when breaking a payload.
- Keep old versions running until all consumers are migrated.
- Add new optional fields before removing old ones.
