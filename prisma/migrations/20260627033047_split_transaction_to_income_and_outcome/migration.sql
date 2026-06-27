/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('CASH', 'TRANSFER');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_donationConfirmationId_fkey";

-- DropTable
DROP TABLE "Transaction";

-- DropEnum
DROP TYPE "TransactionType";

-- CreateTable
CREATE TABLE "Income" (
    "id" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "donorAddress" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "type" "IncomeType" NOT NULL,
    "receiptUrls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "donationConfirmationId" TEXT,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outcome" (
    "id" TEXT NOT NULL,
    "buyer" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "receiptUrls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Income_donationConfirmationId_key" ON "Income"("donationConfirmationId");

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_donationConfirmationId_fkey" FOREIGN KEY ("donationConfirmationId") REFERENCES "DonationConfirmation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
