/*
  Warnings:

  - You are about to drop the column `isPaidForOther` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `paidForOtherStatus` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "isPaidForOther",
DROP COLUMN "paidForOtherStatus";

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "isPaidForOther" BOOLEAN DEFAULT false,
ADD COLUMN     "paidForOtherStatus" BOOLEAN DEFAULT false;
