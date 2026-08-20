import { menusData } from "../constants/menu.data.js";

export const menusExtension = async (prisma) => {

  console.log("Creating menus...");




 

  const MenuResult = await prisma.Menu.createMany({
    data: menusData
  });


  console.log(`✅ Created ${MenuResult.count} menus`);

};
