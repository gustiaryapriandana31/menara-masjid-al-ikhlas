/*
  Warnings:

  - You are about to drop the column `proofUrl` on the `DonationConfirmation` table. All the data in the column will be lost.
  - You are about to drop the column `receiptUrl` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DonationConfirmation" DROP COLUMN "proofUrl",
ADD COLUMN     "proofUrls" TEXT[];

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "receiptUrl",
ADD COLUMN     "receiptUrls" TEXT[];
