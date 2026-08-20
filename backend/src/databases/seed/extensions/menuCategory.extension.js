import { menuCategoriesData } from "../constants/menuCategories.data.js";

export const MenuCategoriesExtension = async (prisma) => {

  console.log("Creating menu categories...");

  // 1️⃣ lấy menu
  const menus = await prisma.menu.findMany({
    select:{
      id:true,
      name:true
    }
  });

  // 2️⃣ map menu
  const mapMenu = new Map(
    menus.map(e => [e.name, e.id])
  );

  // 3️⃣ tạo data
  const data = menuCategoriesData.map(({menuName, ...e}) => ({
    ...e,
    menuId: mapMenu.get(menuName)
  }));

  // 4️⃣ insert
  const result = await prisma.menuCategory.createMany({
    data
  });

  console.log(`✅ Created ${result.count} menu categories`);

};