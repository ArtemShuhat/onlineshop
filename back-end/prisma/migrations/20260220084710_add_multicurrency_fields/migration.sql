/*
  Warnings:

  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - Added the required column `unit_price` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_usd` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'UAH');

-- Добавляем новые колонки как nullable
ALTER TABLE "products" ADD COLUMN "price_usd" INTEGER;
ALTER TABLE "products" ADD COLUMN "price_eur" INTEGER;
ALTER TABLE "products" ADD COLUMN "price_uah" INTEGER;

ALTER TABLE "order_items" ADD COLUMN "unit_price" INTEGER;
ALTER TABLE "order_items" ADD COLUMN "currency" "Currency" DEFAULT 'USD';

ALTER TABLE "orders" ADD COLUMN "currency" "Currency" DEFAULT 'USD';

-- Переносим данные из price в price_usd
UPDATE "products" SET "price_usd" = "price";

-- Вычисляем unit_price из amount_item / quantity
UPDATE "order_items"
SET
    "unit_price" = CASE
        WHEN "quantity" > 0 THEN ROUND("amount_item"::numeric / "quantity")
        ELSE 0
    END,
    "currency" = 'USD';

-- Устанавливаем валюту для заказов
UPDATE "orders" SET "currency" = 'USD';

-- Делаем поля обязательными
ALTER TABLE "products" ALTER COLUMN "price_usd" SET NOT NULL;
ALTER TABLE "order_items" ALTER COLUMN "unit_price" SET NOT NULL;
ALTER TABLE "order_items" ALTER COLUMN "currency" SET NOT NULL;
ALTER TABLE "orders" ALTER COLUMN "currency" SET NOT NULL;