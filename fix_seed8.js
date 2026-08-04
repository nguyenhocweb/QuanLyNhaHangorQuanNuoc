const fs = require('fs');

let userData = fs.readFileSync('./backend/src/databases/seed/constants/user.data.js', 'utf8');

// Change User_Brand array: make all 10 users "Quản lý thương hiệu"
// "65b2a1c0d4f3e2a1b0c9d8ff" is "Nhân viên", we change it to "65b2a1c0d4f3e2a1b0c9d8fd" (Quản lý thương hiệu)
// But we only want to do this for User_Brand!
// User_Restaurant also uses "65b2a1c0d4f3e2a1b0c9d8ff". Let's change ALL of them to Quản lý thương hiệu and Quản lý nhà hàng?
// Wait, if we change ALL of them, then User_Restaurant users will also be Quản lý thương hiệu?
// Let's just use string replacement carefully.
const regex = /id: "65b2a1c0d4f3e2a1b0c9d90[1-9a]",\s+roleId: "65b2a1c0d4f3e2a1b0c9d8ff"/g;
userData = userData.replace(regex, (match) => {
    return match.replace("65b2a1c0d4f3e2a1b0c9d8ff", "65b2a1c0d4f3e2a1b0c9d8fd");
});

// For restaurant users (65b2a1c0d4f3e2a1b0c9d90c to 65b2a1c0d4f3e2a1b0c9d914), make them "Quản lý nhà hàng" (65b2a1c0d4f3e2a1b0c9d8fe)
const regex2 = /id: "65b2a1c0d4f3e2a1b0c9d9(0[b-f]|1[0-4])",\s+roleId: "65b2a1c0d4f3e2a1b0c9d8ff"/g;
userData = userData.replace(regex2, (match) => {
    return match.replace("65b2a1c0d4f3e2a1b0c9d8ff", "65b2a1c0d4f3e2a1b0c9d8fe");
});

fs.writeFileSync('./backend/src/databases/seed/constants/user.data.js', userData);

// Now generate Employment.data.js for 10 target brands and 10 target restaurants
const brandData = require('./backend/src/databases/seed/constants/brand.data.js').default;
const restData = require('./backend/src/databases/seed/constants/restaurant.data.js').default;

const validBrandUsers = [
    "65b2a1c0d4f3e2a1b0c9d901", "65b2a1c0d4f3e2a1b0c9d902", "65b2a1c0d4f3e2a1b0c9d903",
    "65b2a1c0d4f3e2a1b0c9d904", "65b2a1c0d4f3e2a1b0c9d905", "65b2a1c0d4f3e2a1b0c9d906",
    "65b2a1c0d4f3e2a1b0c9d907", "65b2a1c0d4f3e2a1b0c9d908", "65b2a1c0d4f3e2a1b0c9d909",
    "65b2a1c0d4f3e2a1b0c9d90a"
];

const targetBrands = [];
const queenDiner = brandData.find(b => b.name === 'Queen Diner 972') || brandData[0];
const goldenBBQ = brandData.find(b => b.name === 'Golden BBQ 563') || brandData[1];
targetBrands.push(queenDiner, goldenBBQ);
for (const b of brandData) {
    if (!targetBrands.includes(b)) targetBrands.push(b);
    if (targetBrands.length === 10) break;
}

let brandEmployments = [];
for (let i = 0; i < 10; i++) {
    const brand = targetBrands[i];
    brandEmployments.push({
        id: "65b2a1c0d4f3e2" + brand.id.substring(14),
        userId: validBrandUsers[i],
        brandId: brand.id,
        restaurantId: null,
        salary_type: "MONTHLY"
    });
}

const fileContentEmp = `
export const Brand_employment = ${JSON.stringify(brandEmployments, null, 2)};
export const Restaurant_employment = [];
`;

fs.writeFileSync('./backend/src/databases/seed/constants/Employment.data.js', fileContentEmp);
console.log("Updated user.data.js and Employment.data.js successfully!");
