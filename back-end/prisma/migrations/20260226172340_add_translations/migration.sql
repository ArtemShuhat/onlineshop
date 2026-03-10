
ALTER TABLE "categories" RENAME COLUMN "name" TO "name_ru";


ALTER INDEX "categories_name_key" RENAME TO "categories_name_ru_key";


ALTER TABLE "categories" ADD COLUMN "name_en" TEXT NOT NULL DEFAULT '';
ALTER TABLE "categories" ADD COLUMN "name_uk" TEXT NOT NULL DEFAULT '';


ALTER TABLE "categories" ALTER COLUMN "name_en" DROP DEFAULT;
ALTER TABLE "categories" ALTER COLUMN "name_uk" DROP DEFAULT;


ALTER TABLE "products" RENAME COLUMN "description" TO "description_ru";


ALTER TABLE "products" ADD COLUMN "description_en" TEXT NOT NULL DEFAULT '';
ALTER TABLE "products" ADD COLUMN "description_uk" TEXT NOT NULL DEFAULT '';


ALTER TABLE "products" ALTER COLUMN "description_en" DROP DEFAULT;
ALTER TABLE "products" ALTER COLUMN "description_uk" DROP DEFAULT;