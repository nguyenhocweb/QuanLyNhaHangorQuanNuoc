import { index } from "../../../../config/pinecone.config.js";
// upsert
// src/modules/vector/service/vectorDB.service.js
export const upsertVector = async (payload, namespace = "") => {
  const rawRecords = (Array.isArray(payload) ? payload : [payload]).flat();

  // DEBUG: Log thử record đầu tiên xem cấu trúc đúng chưa


  if (rawRecords.length === 0) {
    console.error("Mảng rỗng, không có gì để gửi");
    return;
  }

  try {
    // Đảm bảo dùng mảng sạch
     await index.namespace(namespace).upsert({ records: rawRecords });
  
   
  } catch (error) {
    console.error("❌ Pinecone Upsert Error:", error.message);
    throw error;
  }
};
// search
export const queryVector = async ({ vector, topK = 5, filter = {}, namespace = "" }) => {
  const queryOptions = {
    vector,
    topK,
    includeMetadata: true,
  };
  
  if (filter && Object.keys(filter).length > 0) {
    queryOptions.filter = filter;
  }

  const result = await index.namespace(namespace).query(queryOptions);
  return result.matches || [];
};

// delete
export const deleteVector = async (id, namespace = "") => {
  await index.namespace(namespace).deleteOne(id);
};
export const deleteAllVector = async (namespace = "") => {
  try {
    console.log("⏳ Bắt đầu xóa toàn bộ vector trên Pinecone...");
    await index.namespace(namespace).deleteAll();
    console.log("✅ Xóa vector thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi xóa vector trên Pinecone:", error);
  }
};