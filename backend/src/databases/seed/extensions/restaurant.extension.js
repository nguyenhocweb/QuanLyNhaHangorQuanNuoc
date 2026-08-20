import restaurantData from '../constants/restaurant.data.js';
import { upsertVector } from "../../../modules/shared/vector/service/vectorDB.service.js";
import { embedText } from "../../../modules/shared/vector/service/embedding.service.js";
import { buildRestaurantVector } from "../../../modules/shared/vector/core_builders/restaurant.builder.js";
import { tableVector } from '../../../config/tableVector.js';
export const restaurant_Extension = async(prisma)=>{
    // nơi lưu id của thương hiệu để gán cho nhà hàng
   

    
    // xóa dữ liệu cũ
    console.log('creating restaurants...');

  
    // tạo dữ liệu
   
        
    const result = await prisma.Restaurant.createMany({
        data: restaurantData.map(({brandName, city, ...e})=>e)
    });
    for (const restaurantDataItem of restaurantData) {
        const text = [
        `nhà hàng: ${restaurantDataItem.name || "Nhà hàng ẩn danh"} là 1 nhà hàng.`,
        `${restaurantDataItem.brandName ? `nhà hàng này thuộc thương hiệu: ${restaurantDataItem.brandName}` : ""} .`,
        ` Địa chỉ: ${restaurantDataItem.address || "Chưa cập nhật địa chỉ"},`,
        restaurantDataItem.statusByAdmin === "INACTIVE" ? "tạm thời nghĩ" : restaurantDataItem.statusByAdmin === "TERMINATED" ? "nghĩ vĩnh viễn" : " đang hoạt động",
        restaurantDataItem.isNew === false ? "" : "Nhà hàng mới",
        ` ${restaurantDataItem.city || "chưa cập nhật thành phố"}. `,
        `Đánh giá trung bình: ${restaurantDataItem.averageRating || "chưa có đánh giá"}.`,
        `${restaurantDataItem.description || "chưa cập nhật mô tả"}. `,
        ` Slug: ${restaurantDataItem.slug || "chưa có slug"}.`,
    ].join(" "); 
        const embedding = await embedText(text);
        const RestaurantVector = buildRestaurantVector({
            id: `restaurant_${restaurantDataItem.id}`,
            name: restaurantDataItem.name, 
            description: restaurantDataItem.description,
            city: restaurantDataItem.city,
            address: restaurantDataItem.address,
            slug: restaurantDataItem.slug,
            brandName:restaurantDataItem.brandName,
            averageRating: restaurantDataItem.averageRating,
            embedding: embedding
        });
        await upsertVector( [RestaurantVector], tableVector.restaurant );
    }
    console.log(`✅ Đã tạo thành công ${result.count} Restaurants!`);
}
