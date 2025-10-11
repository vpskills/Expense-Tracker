-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "emoji" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
