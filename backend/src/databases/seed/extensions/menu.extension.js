import { menusData } from "../constants/menu.data.js";

export const menusExtension = async (prisma) => {

  console.log("Creating menus...");

  // 1️⃣ lấy brand
  const brands = await prisma.brand.findMany({
    select: {
      id: true,
      name: true 
    }
  });

  const mapBrand = new Map(
    brands.map(e => [e.name, e.id])
  );

  // 2️⃣ lấy restaurant
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true
    }
  });

  const mapRestaurant = new Map(
    restaurants.map(e => [e.name, e.id])
  );

  // 3️⃣ tách menu brand và menu restaurant
  const brandMenus = menusData.filter(e => e.brandName);
  const restaurantMenus = menusData.filter(e => e.restaurantName);

  // 4️⃣ tạo menu brand trước
  const brandMenuResult = await prisma.menu.createMany({
    data: brandMenus.map(e => ({
      brandId: mapBrand.get(e.brandName),
      restaurantId: null,

      name: e.name,
      type: e.type,
      description: e.description,

      available_days: e.available_days,
      available_from: e.available_from,
      available_until: e.available_until,

      valid_from: e.valid_from ?? null,
      valid_until: e.valid_until ?? null,

      is_active: true,
      sort_order: e.sort_order ?? 0
    }))
  });

  console.log(`✅ Created ${brandMenuResult.count} brand menus`);

  // 5️⃣ lấy lại menu để map parent
  const menus = await prisma.menu.findMany({
    select: {
      id: true,
      name: true
    }
  });

  const mapMenu = new Map(
    menus.map(e => [e.name, e.id])
  );

  // 6️⃣ tạo menu restaurant (kế thừa menu brand)
  const restaurantMenuResult = await prisma.menu.createMany({
    data: restaurantMenus.map(e => ({
      brandId: null,
      restaurantId: mapRestaurant.get(e.restaurantName),


      name: e.name,
      type: e.type,
      description: e.description,

      available_days: e.available_days,
      available_from: e.available_from,
      available_until: e.available_until,

      valid_from: e.valid_from ?? null,
      valid_until: e.valid_until ?? null,

      is_active: true,
      sort_order: e.sort_order ?? 0
    }))
  });

  console.log(`✅ Created ${restaurantMenuResult.count} restaurant menus`);

};