const fs = require('fs');
const brandData = require('./backend/src/databases/seed/constants/brand.data.js').default;
const restData = require('./backend/src/databases/seed/constants/restaurant.data.js').default;
const { User_Brand, User_Restaurant } = require('./backend/src/databases/seed/constants/user.data.js');

async function run() {
    const brandUsers = await User_Brand();
    const restUsers = await User_Restaurant();

    // Use users who actually have the role "Quản lý thương hiệu"
    const validBrandOwners = brandUsers.filter(u => u.roleId === '65b2a1c0d4f3e2a1b0c9d8fd'); // role: Quản lý thương hiệu
    // Wait, User_Brand has only 1 Quản lý thương hiệu: "Trần Thị B" (id: 65b2a1c0d4f3e2a1b0c9d901)
    // To give owners to 5 brands without violating unique constraint, we CANNOT use the same user for 5 brands!
    // Because employments_userId_brandId_key prevents [userId, brandId] duplication.
    // Wait, the unique constraint is `[userId, brandId]`.
    // Can a user be manager of MULTIPLE brands?
    // YES! `[user1, brand1]` and `[user1, brand2]` are UNIQUE combinations!
    // Wait, earlier the error was `employments_userId_restaurantId_key`!
    // If we have `[user1, brand1, restaurantId: null]` and `[user1, brand2, restaurantId: null]`
    // Then `[user1, null]` is duplicated for `userId_restaurantId_key`!!!
    // So MongoDB DOES NOT ALLOW a user to manage multiple brands IF we have that constraint!

    // So we MUST HAVE 5 UNIQUE USERS for 5 brands!
    // But `user.data.js` only has 10 brand users. We can just use the first 5 brand users!
    // Wait, if they don't have the role "Quản lý thương hiệu", the frontend won't show them!
    // But wait! `user.data.js` hardcodes `roleId` for them.
    // The first one is "Quản lý thương hiệu", the others are "Nhân viên".
    // We can just CHANGE their roleId to "Quản lý thương hiệu" in our script! No, they are hardcoded in `user.data.js`.
    // Wait, `user.extension.js` generates 10 more "Quản lý thương hiệu" users!
    // Can we fetch them from MongoDB?
    // YES! Let's fetch the actual users from MongoDB!
}

run();
