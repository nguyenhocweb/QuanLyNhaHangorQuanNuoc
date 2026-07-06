import brandData from '../constants/brand.data.js';
import { tableVector } from '../../../config/tableVector.js';
import { buildBrandVector } from "../../../modules/shared/vector/builders/brand.builder.js"
import { upsertVector } from "../../../modules/shared/vector/service/vectorDB.service.js";
import { embedText } from "../../../modules/shared/vector/service/embedding.service.js";
export const Brand_Extension = async (prisma) => {
    console.log('creating brands...');

    // tạo dữ liệu
    const result = await prisma.Brand.createMany({
        data: brandData,       // Mảng dữ liệu
    });




    const vectorsToUpsert = [];

    // 2. Chuẩn bị dữ liệu Vector
    for (const brandDataItem of brandData) {
        const text = [
            ` Thương hiệu: ${brandDataItem.name || 'Thương hiệu ẩn danh'} là 1 thương hiệu. `,
            brandDataItem.isActive === "INACTIVE" ? "tạm thời nghĩ" : brandDataItem.isActive === "TERMINATED" ? "nghĩ vĩnh viễn" : " đang hoạt động",
            brandDataItem.isFeatured ? "thương hiệu Tiêu biêu" : "",
            brandDataItem.new === false ? "" : "thương hiệu hàng mới",
            ` Mô tả: ${brandDataItem.description || "chưa cập nhật mô tả"}.`,
            ` Địa chỉ: ${brandDataItem.address || "chưa cập nhật địa chỉ"},`,
            ` ${brandDataItem.city || "chưa cập nhật thành phố"}.`,


        ].join(" ");

        const embedding = await embedText(text);
        if (!embedding) {
            console.log(`❌ Skip: ${brandDataItem.name}`);
            continue;
        }
        const BrandVector = buildBrandVector({
            id: `brand_${brandDataItem.id}`,
            name: brandDataItem.name,
            description: brandDataItem.description,
            city: brandDataItem.city,
            address: brandDataItem.address,
            isActive: brandDataItem.isActive || null,
            isFeatured: brandDataItem.isFeatured || true,
            new: brandDataItem.new || true,
            embedding: embedding
        });

        vectorsToUpsert.push(BrandVector);
        console.log(`✅ Prepared: ${brandDataItem.name}`);


    }

    // 3. CÚ CHỐT: Đẩy tất cả lên Pinecone trong 1 lần gọi duy nhất
    if (vectorsToUpsert.length > 0) {
        await upsertVector(vectorsToUpsert, tableVector.brand);
        console.log(`✅ Đã đẩy thành công ${vectorsToUpsert.length} vectors lên Pinecone!`);
    }
    console.log(`✅ Đã tạo thành công ${result.count} Brands!`);
}