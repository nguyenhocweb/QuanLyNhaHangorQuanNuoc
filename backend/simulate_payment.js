import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function simulateSuccess(transactionId) {
    console.log(`Simulating success for transaction: ${transactionId}`);
    try {
        const transaction = await prisma.brandSubscriptionTransaction.findUnique({
            where: { id: transactionId }
        });

        if (!transaction) {
            console.log("Transaction not found!");
            return;
        }

        // Update Transaction to SUCCESS
        await prisma.brandSubscriptionTransaction.update({
            where: { id: transactionId },
            data: { status: 'SUCCESS' }
        });

        // Update Subscription to ACTIVE
        await prisma.brandSubscription.update({
            where: { id: transaction.brandSubscriptionId },
            data: { status: 'ACTIVE' }
        });

        console.log("✅ Successfully simulated payment!");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

// Lấy ID từ tham số dòng lệnh
const args = process.argv.slice(2);
if (args.length > 0) {
    simulateSuccess(args[0]);
} else {
    console.log("Please provide a transaction ID: node simulate_payment.js <id>");
}
