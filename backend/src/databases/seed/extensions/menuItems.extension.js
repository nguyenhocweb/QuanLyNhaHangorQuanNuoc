import { menuItemsData } from "../constants/menuItems.data.js";

export const MenuItemsExtension = async (prisma) => {

  console.log("Creating menu items...");

  // lấy category
  const categories = await prisma.menuCategory.findMany({
    select:{
      id:true,
      name:true
    }
  });

  const mapCategory = new Map(
    categories.map(e => [e.name, e.id])
  );

  // lấy brand
  const brands = await prisma.brand.findMany({
    select:{
      id:true,
      name:true
    }
  });

  const mapBrand = new Map(
    brands.map(e => [e.name, e.id])
  );

  // lấy restaurant
  const restaurants = await prisma.restaurant.findMany({
    select:{
      id:true,
      name:true
    }
  });

  const mapRestaurant = new Map(
    restaurants.map(e => [e.name, e.id])
  );

  const data = menuItemsData.map(({categoryName,brandName,restaurantName,...e}) => ({

    ...e,

    categoryId: mapCategory.get(categoryName),

    brandId: brandName ? mapBrand.get(brandName) : null,

    restaurantId: restaurantName
      ? mapRestaurant.get(restaurantName)
      : null

  }));

  const result = await prisma.menuItem.createMany({
    data
  });

  console.log(`✅ Created ${result.count} menu items`);

};