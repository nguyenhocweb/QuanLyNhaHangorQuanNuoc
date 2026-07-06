const fs = require('fs');

function fixData(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We are looking for lines like: address: { street: "12 Nguyễn Huệ, Quận 1", district: "TP.HCM", province: "Hồ Chí Minh" },
    // or address: { street: "12 Nguyễn Huệ, Quận 1", province: "TP.HCM" }
    
    content = content.replace(/address:\s*\{\s*street:\s*"([^"]+)",([^}]+)\}/g, (match, streetStr, rest) => {
        let street = streetStr;
        let district = "";
        
        // Split streetStr by comma
        if (streetStr.includes(',')) {
            const parts = streetStr.split(',');
            district = parts.pop().trim();
            street = parts.join(',').trim();
        }
        
        // Reconstruct the address object
        // we'll try to find province in `rest`
        let provinceMatch = rest.match(/province:\s*([^,\}]+)/);
        let province = '""';
        if (provinceMatch) {
            province = provinceMatch[1].trim();
        } else {
            // Check if district is in rest
            let districtMatch = rest.match(/district:\s*([^,\}]+)/);
            if (districtMatch) {
                province = districtMatch[1].trim();
            }
        }
        
        return `address: { street: "${street}", district: "${district}", province: ${province} }`;
    });
    
    fs.writeFileSync(filePath, content);
}

fixData('src/databases/seed/constants/brand.data.js');
fixData('src/databases/seed/constants/restaurant.data.js');
console.log('Fixed address fields');
