import { PrismaClient } from './src/databases/prisma/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  const templates = await prisma.template.findMany();
  for (const t of templates) {
    await prisma.template.update({
      where: { id: t.id },
      data: {
        desktopImages: [
          t.thumbnailUrl || "https://res.cloudinary.com/dwbzexuqd/image/upload/v1785295604/quan_ly_nha_hang/templates/template_1785295603900.jpg"
        ],
        mobileImages: [
          t.thumbnailUrl || "https://res.cloudinary.com/dwbzexuqd/image/upload/v1785295604/quan_ly_nha_hang/templates/template_1785295603900.jpg"
        ],
        tabletImages: [
          t.thumbnailUrl || "https://res.cloudinary.com/dwbzexuqd/image/upload/v1785295604/quan_ly_nha_hang/templates/template_1785295603900.jpg"
        ]
      }
    });
  }
  console.log("Updated dummy images for all templates!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
