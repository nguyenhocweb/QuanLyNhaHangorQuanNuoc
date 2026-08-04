const fs = require('fs');
const brandData = require('./backend/src/databases/seed/constants/brand.data.js').default;
const restData = require('./backend/src/databases/seed/constants/restaurant.data.js').default;
const userData = require('./backend/src/databases/seed/constants/user.data.js').default;

const brandOwners = userData.slice(1, 11); // Some users to be brand owners
const restManagers = userData.slice(11, 21); // Some users to be rest managers

let brandEmployments = [];
let idx = 0;
for (const brand of brandData) {
    const user = brandOwners[idx % brandOwners.length];
    brandEmployments.push({
        id: "65b2a1c0d4f3e2" + brand.id.substring(14),
        userId: user.id,
        brandId: brand.id,
        restaurantId: null,
        salary_type: "MONTHLY"
    });
    idx++;
}

let restEmployments = [];
idx = 0;
for (const rest of restData) {
    const user = restManagers[idx % restManagers.length];
    restEmployments.push({
        id: "65b2a1c0d4f3e2" + rest.id.substring(14),
        userId: user.id,
        brandId: null,
        restaurantId: rest.id,
        salary_type: "MONTHLY"
    });
    idx++;
}

const fileContent = `
export const Brand_employment = ${JSON.stringify(brandEmployments, null, 2)};
export const Restaurant_employment = ${JSON.stringify(restEmployments, null, 2)};
`;

fs.writeFileSync('./backend/src/databases/seed/constants/Employment.data.js', fileContent);
console.log('Successfully generated employments for ALL brands and restaurants!');
