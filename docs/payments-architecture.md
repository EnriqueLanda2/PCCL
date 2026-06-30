# PCCL Payments Architecture Proposal

## Goal

Introduce monetization into PCCL by adding a payment step between course
enrollment and content access, without breaking the current free-learning flow
and respecting the existing microservices boundaries.

## Current State (Baseline)

PCCL today works as a **free LMS**. The end-to-end business flow is:

```text
1. User registers / logs in              -> Identity Service (JWT)
2. Admin creates Course + Lessons        -> Learning Service
3. Admin publishes course (published)    -> Learning Service
4. User enrolls (Inscription)            -> Learning Service
5. Progress is tracked                    -> Learning Service
6. User takes evaluations (score)        -> Learning Service
7. Inscription marked "completed" (100%) -> Learning Service
8. Certificate issued (valid 2 years)    -> Certification Service
9. Everything recorded in Audit Log      -> Audit Service
```

### Why payments do not exist yet

- `Course` has **no** `price`, `currency`, or `isFree` field.
- Enrollment is free: `InscriptionsService.create()` only validates that the
  user and course exist and that there is no duplicate enrollment, then creates
  the inscription directly.
- There is **no** payment, order, transaction, or invoice entity.
- There is **no** payment gateway integration (Stripe, MercadoPago, PayPal).

The monetization gap is precisely **between step 4 (enrollment) and content
access**.

## Target Style

- Keep the current async/event-driven model (RabbitMQ or NATS).
- Database per service: payments own their own schema.
- Payment is **decoupled** from enrollment through events.
- The gateway never trusts a client-reported payment status; only a signed
  webhook from the provider confirms a payment.
- Free courses (`isFree = true`) keep the current frictionless flow.

## Phase 1 - Pricing on Courses

Add pricing fields to the `Course` model so the catalog can distinguish free
and paid courses without touching the rest of the flow yet.

```prisma
model Course {
  // ...existing fields...
  price       Decimal  @default(0) @db.Decimal(10, 2) // 0 = free
  currency    String   @default("USD") @db.VarChar(3)
  isFree      Boolean  @default(false)
}
```

Deliverables:

- Prisma migration.
- Course create/update DTOs updated.
- Frontend course catalog shows price (or "Free").

## Phase 2 - Payment Service (new microservice)

A 5th service (suggested port `4004`) that owns its own database schema,
following the "database per service" rule.

### Owned models

```prisma
model Order {
  id         String   @id @default(uuid()) @db.Uuid
  userId     String   @map("user_id") @db.Uuid
  courseId   String   @map("course_id") @db.Uuid
  amount     Decimal  @db.Decimal(10, 2)
  currency   String   @db.VarChar(3)
  status     String   @default("pending") @db.VarChar(20) // pending|paid|failed|refunded
  provider   String   @db.VarChar(40)                     // stripe|mercadopago
  createdAt  DateTime @default(now()) @map("created_at")
  payments   Payment[]
  invoice    Invoice?
}

model Payment {
  id                String   @id @default(uuid()) @db.Uuid
  orderId           String   @map("order_id") @db.Uuid
  order             Order    @relation(fields: [orderId], references: [id])
  providerPaymentId String   @map("provider_payment_id") @db.VarChar(160)
  status            String   @db.VarChar(20)
  paidAt            DateTime? @map("paid_at")
  rawPayload        Json     @map("raw_payload")
}

model Invoice {
  id        String   @id @default(uuid()) @db.Uuid
  orderId   String   @unique @map("order_id") @db.Uuid
  order     Order    @relation(fields: [orderId], references: [id])
  number    String   @unique @db.VarChar(60)
  pdfUrl    String?  @map("pdf_url") @db.Text
  issuedAt  DateTime @map("issued_at")
}
```

> Note: include the standard PCCL audit columns (`transactionDate`,
> `createdBy`, `updatedBy`, `startDate`, `endDate`) to stay consistent with the
> rest of the schema.

### Purchase flow

```text
User clicks "Buy course"
  -> Payment Service creates Order (pending)
  -> redirects to provider (Stripe Checkout / MercadoPago)
  -> provider webhook confirms payment
  -> Order = paid
  -> emits  payment.completed
  -> Learning Service consumes -> creates Inscription
  -> emits  inscription.created
```

## Phase 3 - Event Catalog Additions

Extend the existing async event catalog with payment events:

- `order.created`
- `payment.completed`
- `payment.failed`
- `refund.requested`
- `refund.completed`
- `invoice.issued`

All payment webhook handlers must be **idempotent** (the provider may deliver
the same event more than once). Use event-driven projections for read models,
as already recommended in the architecture doc.

## Phase 4 - Enrollment Gate

Modify enrollment so that, for paid courses, an inscription is only created
after a paid `Order` exists.

- `isFree = true` -> keep the current direct enrollment flow.
- Paid course -> `InscriptionsService.create()` validates a paid `Order`
  (via a synchronous call to the Payment Service, or by consuming
  `payment.completed`).

This keeps payment and enrollment decoupled while enforcing access control.

## Phase 5 - Business Add-ons (incremental)

- **Coupons / discounts** (`Coupon` model).
- **Subscriptions** (time-based access, reusing the existing `startDate` /
  `endDate` columns present in every table).
- **Refunds** with revocation of the associated inscription/certificate.
- **Invoicing** with PDF generation (reuse the `pdfUrl` pattern already used in
  `Certificate`).
- **Revenue reporting** inside the existing Audit/Reporting module.

## Security Requirements

- Never trust a client-reported payment `status`; confirm only via a signed
  provider webhook.
- Verify webhook signatures (Stripe signing secret / MercadoPago validation).
- Record every transaction in the existing `AuditLog`
  (`transactionType: "payment"`).
- Store secrets (API keys, signing secrets) as environment variables, never in
  source.

## Recommended Provider

- **Stripe** for international coverage, or **MercadoPago** for LATAM.
- Start with hosted Checkout to minimize PCI scope.

## Suggested Infrastructure Changes

- Add `payment-service` to `docker-compose.yml` (port `4004`, own DB or schema).
- Add `PAYMENT_SERVICE_URL` to the gateway environment and a proxy route.
- Add a `Payments` microfrontend section (or extend Learning) for checkout and
  order history.

## Recommended Delivery Order

1. **Phase 1 + Phase 2** as the monetizable MVP.
2. Phase 3 (events) and Phase 4 (enrollment gate).
3. Phase 5 add-ons as needed.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Duplicate webhook delivery | Idempotent handlers keyed by `providerPaymentId` |
| Payment/enrollment desync | Event-driven projections + reconciliation job |
| Chargebacks / fraud | Provider fraud tools + refund flow |
| Distributed transaction failure | Saga pattern, outbox table for events |

## Related Documents

- [Microservices architecture](microservices-architecture.md)
- [Service contracts and event catalog](microservices-contracts.md)
- [Docker Compose base](microservices-docker-compose.md)
