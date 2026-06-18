import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import type { PoolConfig } from "pg";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
  prismaConnectionString?: string;
};

function getConnectionString(
  connectionString: string,
  allowSelfSignedCertificate: boolean
): string {
  if (!allowSelfSignedCertificate) {
    return connectionString;
  }

  const url = new URL(connectionString);
  url.searchParams.set("sslmode", "no-verify");

  return url.toString();
}

export function getPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is required. " +
      "Please add your Supabase Postgres connection string to .env.local."
    );
  }

  const allowSelfSignedCertificate =
    process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "false";
  const normalizedConnectionString = getConnectionString(
    connectionString,
    allowSelfSignedCertificate
  );

  if (
    globalForPrisma.prisma &&
    globalForPrisma.prismaConnectionString === normalizedConnectionString
  ) {
    return globalForPrisma.prisma;
  }

  const poolConfig: PoolConfig = {
    connectionString: normalizedConnectionString,
    ssl: allowSelfSignedCertificate
      ? { rejectUnauthorized: false }
      : undefined,
  };
  const adapter = new PrismaPg(poolConfig);
  const prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
    globalForPrisma.prismaConnectionString = normalizedConnectionString;
  }

  return prisma;
}
