const fs = require('fs');
const brandData = require('./backend/src/databases/seed/constants/brand.data.js').default;
const restData = require('./backend/src/databases/seed/constants/restaurant.data.js').default;
const userData = require('./backend/src/databases/seed/constants/user.data.js').default;

const brandOwners = userData.slice(1, 11); // Some users to be brand owners
const restManagers = userData.slice(11, 21); // Some users to be rest managers

let brandEmployments = [];
let restEmployments = [];
let evps = [];
let idx = 0;

const ROLE_BRAND_OWNER = '65b2a1c0d4f3e2a1b0c9d8fd';
const ROLE_REST_MANAGER = '65b2a1c0d4f3e2a1b0c9d8fe';

for (const brand of brandData) {
    const user = brandOwners[idx % brandOwners.length];
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
    idx++;
}

idx = 0;
for (const rest of restData) {
    const user = restManagers[idx % restManagers.length];
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
    idx++;
}

const fileContentEmp = `
export const Brand_employment = ${JSON.stringify(brandEmployments, null, 2)};
export const Restaurant_employment = ${JSON.stringify(restEmployments, null, 2)};
`;

const fileContentEvp = `
const emp_vs_per = ${JSON.stringify(evps, null, 2)};
export default emp_vs_per;
`;

fs.writeFileSync('./backend/src/databases/seed/constants/Employment.data.js', fileContentEmp);
fs.writeFileSync('./backend/src/databases/seed/constants/emloyment_vs_permission.data.js', fileContentEvp);
console.log('Successfully generated employments and EVPs for ALL brands and restaurants!');
