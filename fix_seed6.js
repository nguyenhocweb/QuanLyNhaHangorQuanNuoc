const fs = require('fs');
const brandData = require('./backend/src/databases/seed/constants/brand.data.js').default;
const restData = require('./backend/src/databases/seed/constants/restaurant.data.js').default;
const userData = require('./backend/src/databases/seed/constants/user.data.js').default;

const validUsers = userData; // Exactly 5 users

// Find specific brands to test
const targetBrands = [];
const queenDiner = brandData.find(b => b.name === 'Queen Diner 972') || brandData[0];
const goldenBBQ = brandData.find(b => b.name === 'Golden BBQ 563') || brandData[1];
targetBrands.push(queenDiner, goldenBBQ, brandData[2], brandData[3], brandData[4]);

const targetRests = restData.slice(0, 5);

let brandEmployments = [];
let restEmployments = [];
let evps = [];

const ROLE_BRAND_OWNER = '65b2a1c0d4f3e2a1b0c9d8fd';
const ROLE_REST_MANAGER = '65b2a1c0d4f3e2a1b0c9d8fe';

for (let i = 0; i < 5; i++) {
    const brand = targetBrands[i];
    const user = validUsers[i];
    const empId = "65b2a1c0d4f3e2" + brand.id.substring(14);
    
    brandEmployments.push({
        id: empId,
        userId: user.id,
        brandId: brand.id,
        restaurantId: null,
        salary_type: "MONTHLY"
    });
    
    evps.push({
        id: "evp_br_" + brand.id.substring(0, 10),
        roleId: ROLE_BRAND_OWNER,
        permissionId: null,
        employmentId: empId
    });
}

for (let i = 0; i < 5; i++) {
    const rest = targetRests[i];
    const user = validUsers[i];
    const empId = "65b2a1c0d4f3e2" + rest.id.substring(14);
    
    restEmployments.push({
        id: empId,
        userId: user.id,
        brandId: null,
        restaurantId: rest.id,
        salary_type: "MONTHLY"
    });
    
    evps.push({
        id: "evp_re_" + rest.id.substring(0, 10),
        roleId: ROLE_REST_MANAGER,
        permissionId: null,
        employmentId: empId
    });
}

const fileContentEmp = `
export const Brand_employment = ${JSON.stringify(brandEmployments, null, 2)};
export const Restaurant_employment = ${JSON.stringify(restEmployments, null, 2)};
`;

const fileContentEvp = `
export const emp_vs_per = ${JSON.stringify(evps, null, 2)};
`;

fs.writeFileSync('./backend/src/databases/seed/constants/Employment.data.js', fileContentEmp);
fs.writeFileSync('./backend/src/databases/seed/constants/emloyment_vs_permission.data.js', fileContentEvp);
console.log('Successfully generated employments for 5 unique users!');
