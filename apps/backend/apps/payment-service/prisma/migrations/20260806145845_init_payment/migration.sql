-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "user_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "provider" VARCHAR(40) NOT NULL DEFAULT 'stripe',
    "provider_payment_intent_id" VARCHAR(160),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "order_id" UUID NOT NULL,
    "provider_payment_id" VARCHAR(160) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "paid_at" TIMESTAMP(6),
    "raw_payload" JSONB NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_provider_payment_intent_id_key" ON "orders"("provider_payment_intent_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_order_id_key" ON "payments"("order_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
