import 'dotenv/config';
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { execSync } from "node:child_process";
import { join } from "path";

import { beforeAll, beforeEach, afterAll } from '@jest/globals';

const generateDatabaseURL = () => {
  if (!process.env.TEST_DATABASE_URL) {
    throw new Error('Tolong sediakan TEST_DATABASE_URL di file .env');
  }
  return process.env.TEST_DATABASE_URL;
}

const url = generateDatabaseURL();

process.env.DATABASE_URL = url;

const testDbUrl = new URL(url);

const adapter = new PrismaMariaDb({
  host: testDbUrl.hostname,
  user: testDbUrl.username,
  password: testDbUrl.password,
  database: testDbUrl.pathname.substring(1),
  port: Number(testDbUrl.port) || 3306,
  connectionLimit: 5,
  connectTimeout: 5000
});

const prisma = new PrismaClient({ adapter });
const prismaBinary = join(process.cwd(), 'node_modules', '.bin', 'prisma');

beforeAll(async () => {
  execSync(`${prismaBinary} db push --accept-data-loss --url="${url}"`, {
    env: {
      ...process.env,
      DATABASE_URL: url,
    },
  });
});

beforeEach(async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.token.deleteMany();

  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };