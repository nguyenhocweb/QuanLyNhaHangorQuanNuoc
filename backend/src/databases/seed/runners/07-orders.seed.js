import fs from "fs";
import { prisma } from "../../init.mongodb.js";

/**
 * Runner 07: Khởi tạo Đơn Gọi Món Tại Bàn (Order), Chi Tiết Món Ăn (OrderItem),
 * Điều Phối Bếp KDS & Giao Dịch Thanh Toán (Transaction) từ data/orders.json
 */
export const seedOrders = async () => {
    console.log("👉 [7/8] Khởi tạo Đơn gọi món tại bàn & Giao dịch thanh toán (từ data/orders.json)...");

    // 1. Đọc template đơn hàng từ data/orders.json
    const ordersPath = new URL("../data/orders.json", import.meta.url);
    const sampleOrders = JSON.parse(fs.readFileSync(ordersPath, "utf-8"));

    // 2. Tải Master Entities
    const [allReservations, allMenuItems, allTables, allRestaurants] = await Promise.all([
        prisma.reservations.findMany({
            take: 10
        }),
        prisma.menuItem.findMany({
            take: 6
        }),
        prisma.tables.findMany({
            where: { status: "ACTIVE" },
            take: 10
        }),
        prisma.restaurant.findMany({
            where: { statusByAdmin: "ACTIVE" },
            take: 5
        })
    ]);

    if (allReservations.length === 0 || allMenuItems.length === 0 || allTables.length === 0) {
        console.warn("⚠️ Bỏ qua Orders: Chưa đủ dữ liệu Reservations / MenuItems / Tables");
        return true;
    }

    let createdOrderCount = 0;

    for (let i = 0; i < sampleOrders.length; i++) {
        const orderData = sampleOrders[i];
        const res = allReservations[i % allReservations.length];
        const rest = allRestaurants[i % allRestaurants.length];
        const table = allTables[i % allTables.length];

        const orderNumber = `ORD_${res.id.slice(-4).toUpperCase()}_${Date.now().toString().slice(-4)}_${i + 1}`;

        // Tính subtotal từ items
        let subtotal = 0;
        const orderItemsToCreate = [];

        for (const itm of orderData.items) {
            const menuItem = allMenuItems[itm.item_index % allMenuItems.length];
            const itemSubtotal = menuItem.base_price * itm.quantity;
            subtotal += itemSubtotal;

            orderItemsToCreate.push({
                menuItemId: menuItem.id,
                name: menuItem.name,
                unitPrice: menuItem.base_price,
                quantity: itm.quantity,
                subtotal: itemSubtotal,
                totalPrice: itemSubtotal,
                status: itm.status,
                note: itm.note
            });
        }

        const taxRate = 8.0; // 8% VAT
        const taxAmount = (subtotal * taxRate) / 100;
        const totalAmount = subtotal + taxAmount - orderData.discount_amount;

        const order = await prisma.order.create({
            data: {
                reservationId: res.id,
                restaurantId: rest.id,
                tableId: table.id,
                order_number: orderNumber,
                status: orderData.order_status,
                subtotal: subtotal,
                discount_amount: orderData.discount_amount,
                tax_amount: taxAmount,
                total_amount: totalAmount,
                payment_method: orderData.payment_method,
                paid_at: orderData.payment_status === "PAID" ? new Date() : null,
                items: {
                    create: orderItemsToCreate
                }
            }
        });
        createdOrderCount++;

        // Nếu đơn đã thanh toán -> Tạo Transaction
        if (orderData.payment_status === "PAID") {
            await prisma.transaction.create({
                data: {
                    orderId: order.id,
                    amount: totalAmount,
                    provider: orderData.payment_method,
                    status: "SUCCESS",
                    externalTransactionId: `TXN_${Date.now()}_${i}`
                }
            });
        }
    }

    console.log(`✅ Đã khởi tạo hoàn tất ${createdOrderCount} Đơn gọi món và Giao dịch thanh toán từ data/orders.json!`);
    return true;
};
