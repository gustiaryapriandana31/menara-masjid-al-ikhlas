import { PrismaClient, IncomeType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Manual loading of .env
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*"(.*)"\s*$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
console.log("Connecting to Database:", connectionString ? connectionString.split('@')[1] : "NONE");

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface IncomeRow {
  donorName: string;
  donorAddress: string | null;
  amount: number;
  date: string | null;
  description: string | null;
  type: 'CASH' | 'TRANSFER';
}

async function main() {
  console.log("Starting Excel data import to Supabase...");

  const dataPath = path.join(__dirname, 'income_data.json');
  if (!fs.existsSync(dataPath)) {
    throw new Error("income_data.json not found!");
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const items: IncomeRow[] = JSON.parse(rawData);

  console.log(`Found ${items.length} records to import.`);

  const formattedRecords = items.map((item) => ({
    donorName: item.donorName,
    donorAddress: item.donorAddress || null,
    donorPhone: null,
    amount: item.amount,
    date: item.date ? new Date(item.date) : null,
    description: item.description || null,
    type: item.type === 'CASH' ? IncomeType.CASH : IncomeType.TRANSFER,
    receiptUrls: [],
    donationConfirmationId: null
  }));

  // Bulk insert using createMany
  const result = await prisma.income.createMany({
    data: formattedRecords
  });

  console.log(`Successfully bulk inserted ${result.count} income records into Supabase!`);
}

main()
  .catch((e) => {
    console.error("Import failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
