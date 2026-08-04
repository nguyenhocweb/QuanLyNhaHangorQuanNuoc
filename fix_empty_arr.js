const fs = require('fs');

let empData = fs.readFileSync('./backend/src/databases/seed/constants/Employment.data.js', 'utf8');

const replacement = `export const Restaurant_employment = [
  { id: "65b2a1c0d4f3e2a1b0c9db01", userId: "65b2a1c0d4f3e2a1b0c9d90b", brandId: null, restaurantId: "65b2a1c0d4f3e2a1b0c9d999", salary_type: "MONTHLY" }
];`;

empData = empData.replace('export const Restaurant_employment = [];', replacement);
fs.writeFileSync('./backend/src/databases/seed/constants/Employment.data.js', empData);
