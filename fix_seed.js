const fs = require('fs');
const brandData = require('./backend/src/databases/seed/constants/brand.data.js').default;
const restData = require('./backend/src/databases/seed/constants/restaurant.data.js').default;

const b1 = brandData[0].id;
const b2 = brandData[1].id;
const b3 = brandData[2].id;
const b4 = brandData[3].id;

let content = fs.readFileSync('./backend/src/databases/seed/constants/Employment.data.js', 'utf8');

// Replace old brand IDs
content = content.replace(/fbcee99cfd560dbfe3b8c050/g, b1);
content = content.replace(/65b2a1c0d4f3e2a1b0c9d8e8/g, b2);
content = content.replace(/65b2a1c0d4f3e2a1b0c9d8e9/g, b3);
content = content.replace(/65b2a1c0d4f3e2a1b0c9d8ea/g, b4);

const r1 = restData[0].id;
const r2 = restData[1].id;
const r3 = restData[2].id;
const r4 = restData[3].id;
const r5 = restData[4].id;

// Replace old restaurant IDs
content = content.replace(/417f8c41d2c6c6678369ef90/g, r1);
content = content.replace(/65b2a1c0d4f3e2a1b0c9d99a/g, r2);
content = content.replace(/65b2a1c0d4f3e2a1b0c9d99b/g, r3);
content = content.replace(/65b2a1c0d4f3e2a1b0c9d99c/g, r4);
content = content.replace(/65b2a1c0d4f3e2a1b0c9d99d/g, r5);

fs.writeFileSync('./backend/src/databases/seed/constants/Employment.data.js', content);
console.log('Updated Employment.data.js');
