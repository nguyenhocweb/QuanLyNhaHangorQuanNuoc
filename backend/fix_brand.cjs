const fs = require('fs');

function formatAddress(addrString, city) {
    let street = addrString.trim();
    let district = "";
    if (addrString.includes(',')) {
        const parts = addrString.split(',');
        let lastPart = parts.pop().trim();
        // Sometimes the last part is the province if city is not provided correctly, but here we assume it's city in the string?
        // Wait, "123 Nguyễn Huệ, Quận 1, TP.HCM"
        // If it has 3 parts: street, district, province.
        if (parts.length > 0) {
            let potentialDistrict = parts.pop().trim();
            // wait, if "123 Nguyễn Huệ, Quận 1, TP.HCM" -> parts = ["123 Nguyễn Huệ", "Quận 1"], lastPart = "TP.HCM"
            // we want district to be "Quận 1", province to be "TP.HCM", street to be "123 Nguyễn Huệ"
            if (lastPart.startsWith('TP.') || lastPart.startsWith('Tỉnh') || lastPart.includes('Hà Nội')) {
                // lastPart is province
                district = potentialDistrict;
                street = parts.join(',').trim();
                if (!street) {
                    street = district;
                    district = "";
                }
                return `{ street: "${street}", district: "${district}", province: "${lastPart}" }`;
            } else {
                // lastPart is district, no province in string?
                district = lastPart;
                street = parts.concat(potentialDistrict).join(',').trim();
                return `{ street: "${street}", district: "${district}", province: ${city ? city : '""'} }`;
            }
        }
    }
    return `{ street: "${street}", district: "${district}", province: ${city ? city : '""'} }`;
}

let brandContent = fs.readFileSync('src/databases/seed/constants/brand.data.js', 'utf8');

// Match address: "...",
brandContent = brandContent.replace(/address:\s*"([^"]+)",/g, (match, addr) => {
    return `address: ${formatAddress(addr, null)},`;
});

fs.writeFileSync('src/databases/seed/constants/brand.data.js', brandContent);
console.log('Fixed brand.data.js');
