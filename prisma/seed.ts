import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { pbkdf2Sync, randomBytes } from 'crypto';

// Hashing helper
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seeding...");

  // 1. Delete existing users to ensure only 1 account exists
  const deleteResult = await prisma.user.deleteMany();
  console.log(`Deleted ${deleteResult.count} existing users.`);

  // 2. Create the single Panitia user
  const hashedPassword = hashPassword("AdminMenaraKito02");
  
  const adminUser = await prisma.user.create({
    data: {
      name: "Panitia Pembangunan Menara",
      username: "adminmenara",
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  console.log("Seeding completed successfully! Created user:", {
    id: adminUser.id,
    name: adminUser.name,
    username: adminUser.username,
    role: adminUser.role
  });
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
