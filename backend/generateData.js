import fs from 'fs';

const generateObjectId = () => {
    return [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};

const cities = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng"];
const prefixes = ["Golden", "Silver", "Happy", "Ocean", "Green", "Royal", "King", "Queen", "Viet", "Asia"];
const suffixes = ["Restaurant", "Bistro", "Steakhouse", "Seafood", "BBQ", "Sushi", "Hotpot", "Kitchen", "Eatery", "Diner"];

const brands = [];
const restaurants = [];

let brandIndex = 0;
let restaurantIndex = 0;

for (let i = 0; i < 30; i++) {
    const brandId = generateObjectId();
    const brandName = prefixes[Math.floor(Math.random() * prefixes.length)] + " " + suffixes[Math.floor(Math.random() * suffixes.length)] + " " + Math.floor(Math.random() * 1000);
    const city = cities[Math.floor(Math.random() * cities.length)];
    const brandEmail = "contact" + i + "@" + brandName.replace(/\\s+/g, '').toLowerCase() + ".vn";
    const link = "https://" + brandName.replace(/\\s+/g, '').toLowerCase() + ".vn";
    
    brands.push("  {\n" +
"    id: \"" + brandId + "\",\n" +
"    name: \"" + brandName + "\",\n" +
"    email_contact: \"" + brandEmail + "\",\n" +
"    phone_contact: \"090" + Math.floor(1000000 + Math.random() * 9000000) + "\",\n" +
"    tax_code: \"031" + Math.floor(1000000 + Math.random() * 9000000) + "\",\n" +
"    link: \"" + link + "\",\n" +
"    address: { street: \"" + Math.floor(Math.random() * 200) + " Đường ABC\", district: \"Quận trung tâm\", province: \"" + city + "\" },\n" +
"    isActive: \"ACTIVE\",\n" +
"    imageMain: \"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4\",\n" +
"    description: \"Thương hiệu nổi tiếng với các món ăn đặc sắc, mang đến trải nghiệm tuyệt vời cho khách hàng.\",\n" +
"    isFeatured: " + (Math.random() > 0.5) + ",\n" +
"    isNew: " + (Math.random() > 0.5) + ",\n" +
"    restaurantCount: 2\n" +
"  }");

    // Generate 2 restaurants per brand
    for (let j = 0; j < 2; j++) {
        const restaurantId = generateObjectId();
        const resCity = cities[Math.floor(Math.random() * cities.length)];
        const resName = brandName + " - Chi nhánh " + resCity + " " + (j+1);
        const slug = resName.toLowerCase().replace(/\\s+/g, '-').normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
        const resEmail = "res" + restaurantIndex + "@" + brandName.replace(/\\s+/g, '').toLowerCase() + ".vn";

        restaurants.push("  {\n" +
"    id: \"" + restaurantId + "\",\n" +
"    brandId: \"" + brandId + "\",\n" +
"    brandName: \"" + brandName + "\",\n" +
"    name: \"" + resName + "\",\n" +
"    slug: \"" + slug + "\",\n" +
"    address: { street: \"" + Math.floor(Math.random() * 200) + " Đường XYZ\", district: \"Quận trung tâm\", province: \"" + resCity + "\" },\n" +
"    city: \"" + resCity + "\",\n" +
"    email_contact: \"" + resEmail + "\",\n" +
"    phone_contact: \"091" + Math.floor(1000000 + Math.random() * 9000000) + "\",\n" +
"    isActive: \"ACTIVE\",\n" +
"    imageMain: \"https://images.unsplash.com/photo-1552566626-52f8b828add9\",\n" +
"    max_party_size: " + Math.floor(Math.random() * 100 + 20) + ",\n" +
"    booking_window_days: 7,\n" +
"    cancellation_hours: 3,\n" +
"    deposit_required: " + (Math.random() > 0.5) + ",\n" +
"    deposit_amount: " + (Math.random() > 0.5 ? 200000 : "null") + ",\n" +
"    totalRating: " + Math.floor(Math.random() * 50 + 5) + ",\n" +
"    averageRating: " + (Math.random() * 2 + 3).toFixed(1) + ",\n" +
"    average_food_rating: " + (Math.random() * 2 + 3).toFixed(1) + ",\n" +
"    average_service_rating: " + (Math.random() * 2 + 3).toFixed(1) + ",\n" +
"    average_ambiance_rating: " + (Math.random() * 2 + 3).toFixed(1) + ",\n" +
"    createdAt: new Date(Date.now() - " + Math.floor(Math.random() * 10) + " * 24 * 60 * 60 * 1000),\n" +
"    weightedScore: " + (Math.random() * 2 + 3).toFixed(2) + "\n" +
"  }");
        restaurantIndex++;
    }
}

const brandFileContent = "const brandData = [\n" + brands.join(',\n') + "\n];\n\nexport default brandData;\n";
const restaurantFileContent = "const restaurantData = [\n" + restaurants.join(',\n') + "\n];\n\nexport default restaurantData;\n";

fs.writeFileSync('./src/databases/seed/constants/brand.data.js', brandFileContent);
fs.writeFileSync('./src/databases/seed/constants/restaurant.data.js', restaurantFileContent);

console.log('Successfully generated seed data!');
