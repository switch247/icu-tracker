import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  console.log('Connected to the database successfully!');
}

main()
  .catch((e) => {
    console.error('Error connecting to the database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
