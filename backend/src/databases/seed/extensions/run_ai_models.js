import { PrismaClient } from "../../prisma/generated/prisma/index.js";
import { aiModelsExtension } from "./ai_models.extension.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.aiModel.deleteMany({});
  await aiModelsExtension(prisma);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
