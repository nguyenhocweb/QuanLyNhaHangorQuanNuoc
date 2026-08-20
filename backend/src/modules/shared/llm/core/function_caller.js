/**
 * Bộ máy thực thi Function Calling (Công cụ) của AI
 */
export class FunctionCaller {
  /**
   * Thực thi các Tool Requests từ AI
   * @param {Array} functionCalls - Mảng các request (name, args)
   * @param {Object} executorMap - Map chứa các hàm xử lý tương ứng với Role
   * @returns {Array} - Mảng kết quả trả về cho LLM
   */
  static async execute(functionCalls, executorMap, context = {}) {
    if (!functionCalls || functionCalls.length === 0) return [];

    const promises = functionCalls.map(async (call) => {
      const executor = executorMap[call.name];
      if (!executor) {
        console.warn(`[Function Caller] Tool '${call.name}' không được phép hoặc không tồn tại trong ExecutorMap của Persona này!`);
        return { 
          functionResponse: { 
            name: call.name, 
            response: { error: "Bạn không có quyền gọi hàm này hoặc hàm không tồn tại." } 
          } 
        };
      }

      try {
        const dbResult = await executor(call.args, context);
        return { functionResponse: { name: call.name, response: dbResult } };
      } catch (error) {
        console.error(`[Function Caller] Lỗi khi thực thi Tool '${call.name}':`, error.message);
        return { 
          functionResponse: { 
            name: call.name, 
            response: { error: error.message } 
          } 
        };
      }
    });

    const apiResponses = (await Promise.all(promises)).filter(Boolean);
    return apiResponses;
  }
}
