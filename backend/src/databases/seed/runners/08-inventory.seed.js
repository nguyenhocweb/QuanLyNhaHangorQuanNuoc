import fs from "fs";
import { prisma } from "../../init.mongodb.js";

/**
 * Runner 08: Khởi tạo Chuỗi Cung Ứng (Suppliers), Kho Nguyên Liệu (InventoryItems & Stocks),
 * Định Lượng Công Thức (Recipes), Đơn Mua Hàng (PurchaseOrders) & Cảnh Báo (Alerts)
 * Dữ liệu tải trực tiếp từ data/inventory.json
 */
export const seedInventory = async () => {
    console.log("👉 [8/8] Khởi tạo Chuỗi cung ứng & Kho nguyên liệu (từ data/inventory.json)...");

    // 1. Đọc dữ liệu từ data/inventory.json
    const invPath = new URL("../data/inventory.json", import.meta.url);
    const invData = JSON.parse(fs.readFileSync(invPath, "utf-8"));
    const sampleSuppliers = invData.suppliers;
    const sampleIngredients = invData.ingredients;

    // 2. Tải Brands, Restaurants và MenuItems
    const [allBrands, allRestaurants, allMenuItems, existingSuppliers] = await Promise.all([
        prisma.brand.findMany({
            where: { isActive: "ACTIVE" },
            take: 10
        }),
        prisma.restaurant.findMany({
            where: { statusByAdmin: "ACTIVE" },
            take: 10
        }),
        prisma.menuItem.findMany({
            take: 10
        }),
        prisma.supplier.findMany({
            take: 10
        })
    ]);

    if (allBrands.length === 0 || allRestaurants.length === 0) {
        console.warn("⚠️ Bỏ qua Inventory: Chưa có Brands hoặc Restaurants sẵn sàng");
        return true;
    }

    // 3. Khởi tạo Suppliers & Items nếu chưa có
    if (existingSuppliers.length === 0) {
        for (const brand of allBrands.slice(0, 3)) {
            for (const sData of sampleSuppliers) {
                const supplier = await prisma.supplier.create({
                    data: {
                        brandId: brand.id,
                        name: `${sData.name} - Đối Tác ${brand.name}`,
                        taxCode: sData.taxCode,
                        contact: JSON.stringify(sData.contact),
                        status: sData.status
                    }
                });

                for (const ing of sampleIngredients) {
                    const sku = `${ing.skuPrefix}_${brand.id.slice(-4).toUpperCase()}_${Date.now().toString().slice(-4)}`;
                    await prisma.inventoryItem.create({
                        data: {
                            brandId: brand.id,
                            supplierId: supplier.id,
                            sku: sku,
                            name: ing.name,
                            baseUnit: ing.baseUnit,
                            minPrice: ing.minPrice,
                            maxPrice: ing.maxPrice,
                            minStockLevel: ing.minStockLevel,
                            type: ing.type || "INGREDIENT",
                            isActive: true
                        }
                    });
                }
            }
        }
    }

    const allInventoryItems = await prisma.inventoryItem.findMany({ take: 10 });
    const allSupps = await prisma.supplier.findMany({ take: 5 });

    // 4. Khởi tạo Tồn kho (InventoryStock)
    const stocksToCreate = [];
    const alertsToCreate = [];
    const txnsToCreate = [];

    const existingStocks = await prisma.inventoryStock.findMany({
        select: { restaurantId: true, inventoryItemId: true }
    });
    const stockSet = new Set(existingStocks.map(s => `${s.restaurantId}_${s.inventoryItemId}`));

    for (const rest of allRestaurants) {
        for (let j = 0; j < allInventoryItems.length; j++) {
            const item = allInventoryItems[j];
            const stockKey = `${rest.id}_${item.id}`;

            if (!stockSet.has(stockKey)) {
                const isLowStock = j === 0;
                const stockQty = isLowStock ? 2.0 : (j + 1) * 15.0;

                stocksToCreate.push({
                    restaurantId: rest.id,
                    inventoryItemId: item.id,
                    quantity: stockQty,
                    minStockLevel: item.minStockLevel,
                    location: `Kho Thực Phẩm Lạnh - Kệ B${j + 1}`
                });
                stockSet.add(stockKey);

                if (isLowStock) {
                    alertsToCreate.push({
                        restaurantId: rest.id,
                        inventoryItemId: item.id,
                        type: "LOW_STOCK",
                        status: "UNREAD"
                    });
                }

                txnsToCreate.push({
                    restaurantId: rest.id,
                    inventoryItemId: item.id,
                    userId: rest.brandId,
                    type: "IN",
                    quantityChange: 50.0,
                    balanceAfter: stockQty,
                    notes: "Nhập hàng từ nhà cung cấp định kỳ đầu tuần"
                });
            }
        }
    }

    if (stocksToCreate.length > 0) {
        await prisma.inventoryStock.createMany({ data: stocksToCreate });
    }
    if (alertsToCreate.length > 0) {
        await prisma.inventoryAlert.createMany({ data: alertsToCreate });
    }
    if (txnsToCreate.length > 0) {
        await prisma.stockTransaction.createMany({ data: txnsToCreate });
    }

    // 5. Khởi tạo PurchaseOrder mẫu
    if (allSupps.length > 0 && allInventoryItems.length >= 2 && allRestaurants.length > 0) {
        const rest = allRestaurants[0];
        const supplier = allSupps[0];
        const poNumber = `PO_${rest.id.slice(-4).toUpperCase()}_${Date.now().toString().slice(-6)}`;

        const existingPo = await prisma.purchaseOrder.findUnique({ where: { poNumber: poNumber } });
        if (!existingPo) {
            await prisma.purchaseOrder.create({
                data: {
                    restaurantId: rest.id,
                    supplierId: supplier.id,
                    createdBy: rest.id,
                    poNumber: poNumber,
                    status: "COMPLETED",
                    totalAmount: 18500000,
                    items: {
                        create: [
                            {
                                inventoryItemId: allInventoryItems[0].id,
                                orderQty: 10.0,
                                receivedQty: 10.0,
                                unitPrice: allInventoryItems[0].minPrice,
                                actualAmount: 10.0 * allInventoryItems[0].minPrice
                            },
                            {
                                inventoryItemId: allInventoryItems[1].id,
                                orderQty: 20.0,
                                receivedQty: 20.0,
                                unitPrice: allInventoryItems[1].minPrice,
                                actualAmount: 20.0 * allInventoryItems[1].minPrice
                            }
                        ]
                    }
                }
            });
        }
    }

    // 6. Định lượng Recipe cho MenuItem
    if (allMenuItems.length > 0 && allInventoryItems.length >= 2) {
        for (let m = 0; m < Math.min(allMenuItems.length, 5); m++) {
            const menuItem = allMenuItems[m];
            const existingRecipe = await prisma.recipe.findFirst({ where: { menuItemId: menuItem.id } });
            if (!existingRecipe) {
                await prisma.recipe.create({
                    data: {
                        menuItemId: menuItem.id,
                        inventoryItemId: allInventoryItems[m % allInventoryItems.length].id,
                        quantityRequired: 0.25
                    }
                });
            }
        }
    }

    console.log(`✅ Đã khởi tạo hoàn tất Nhà cung cấp, Nguyên liệu & Tồn kho từ data/inventory.json!`);
    return true;
};
