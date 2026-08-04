import { PrismaClient } from './src/databases/prisma/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  const templates = await prisma.template.findMany();
  console.log(JSON.stringify(templates, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
