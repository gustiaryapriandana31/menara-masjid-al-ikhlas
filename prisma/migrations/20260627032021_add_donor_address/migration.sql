-- AlterTable
ALTER TABLE "DonationConfirmation" ADD COLUMN     "donorAddress" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "donorAddress" TEXT;
