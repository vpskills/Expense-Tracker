-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Expense_userId_date_idx" ON "public"."Expense"("userId", "date");
