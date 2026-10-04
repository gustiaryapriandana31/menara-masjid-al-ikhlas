import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  const pool = new Pool({
    connectionString,
    ssl: (isProduction || (connectionString && connectionString.includes('supabase')))
      ? { rejectUnauthorized: false }
      : undefined
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal?: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

let db: ReturnType<typeof prismaClientSingleton>;

if (process.env.NODE_ENV === 'production') {
  db = prismaClientSingleton();
} else {
  // In development, recreate client if new models (such as materialDonation) aren't present on cached instance
  if (!globalThis.prismaGlobal || !('materialDonation' in globalThis.prismaGlobal)) {
    globalThis.prismaGlobal = prismaClientSingleton();
  }
  db = globalThis.prismaGlobal;
}

export default db;

