import { prisma } from "./src/databases/init.mongodb.js";
import { getTemplatesRepo } from "./src/modules/system_admin/template/repositories/template.get.repo.js";

async function check() {
    console.log("All templates in DB:", await prisma.template.findMany());
    
    console.log("Fetching with Repo (BRAND_TEMPLATE):");
    console.log(await getTemplatesRepo({ where: { type: "BRAND_TEMPLATE" }, skip: 0, take: 10 }));
    
    console.log("Fetching with Repo (RESTAURANT_TEMPLATE):");
    console.log(await getTemplatesRepo({ where: { type: "RESTAURANT_TEMPLATE" }, skip: 0, take: 10 }));
    
    process.exit(0);
}

check().catch(console.error);
