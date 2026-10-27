import { prisma } from "../../../../databases/init.mongodb.js";

export const registerRepo = {
    findExistingUser: async ({ user_name, email }) => {
        return prisma.user.findFirst({
            where: {
                OR: [
                    { user_name: { equals: user_name, mode: "insensitive" } },
                    { email: { equals: email, mode: "insensitive" } }
                ]
            },
            select: {
                id: true,
                user_name: true,
                email: true
            }
        });
    },

    getCustomerRole: async () => {
        return prisma.systemRole.findFirst({
            where: {
                name: "Khách hàng"
            }
        });
    },

    createUser: async (userData) => {
        return prisma.user.create({
            data: userData,
            select: {
                id: true,
                user_name: true,
                email: true,
                name: true,
                gender: true,
                date_of_birth: true,
                is_active: true,
                createdAt: true
            }
        });
    }
};
