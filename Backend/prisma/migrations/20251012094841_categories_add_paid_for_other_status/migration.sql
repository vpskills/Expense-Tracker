-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isPaidForOther" BOOLEAN DEFAULT false,
ADD COLUMN     "paidForOtherStatus" BOOLEAN DEFAULT false;
