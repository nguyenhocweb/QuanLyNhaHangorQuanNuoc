/**
 * Lớp Quản lý Bộ nhớ (Chat History) của AI
 * Hiện tại dùng In-Memory Store (Tạm thời). 
 * Cần nâng cấp lên Redis hoặc MongoDB trong tương lai để scale.
 */
const chatHistoryDB = new Map();

export class AIMemoryService {
  /**
   * Lấy lịch sử trò chuyện của một Session
   * @param {string} sessionId - ID phiên chat
   * @param {number} limit - Số lượng tin nhắn gần nhất cần lấy
   * @returns {Array} Mảng các tin nhắn theo định dạng chuẩn (role, parts)
   */
  static getHistory(sessionId, limit = 10) {
    if (!sessionId) return [];
    
    const history = chatHistoryDB.get(sessionId) || [];
    // Lấy `limit` tin nhắn gần nhất để tránh tràn Context Window
    const recentHistory = history.slice(-limit);

    // Bắt buộc tuân thủ API của Gemini: Lịch sử phải LUÔN LUÔN bắt đầu bằng role 'user'
    // Nếu mảng bị cắt lẻ khiến phần tử đầu tiên là 'model', ta phải vứt bỏ nó.
    while (recentHistory.length > 0 && recentHistory[0].role !== 'user') {
      recentHistory.shift();
    }

    return recentHistory;
  }

  /**
   * Lưu tin nhắn vào lịch sử
   * @param {string} sessionId - ID phiên chat
   * @param {string} role - "user" hoặc "model"
   * @param {string} text - Nội dung tin nhắn
   */
  static saveMessage(sessionId, role, text) {
    if (!sessionId) return;

    const history = chatHistoryDB.get(sessionId) || [];
    history.push({
      role: role,
      parts: [{ text: text }]
    });

    chatHistoryDB.set(sessionId, history);
  }

  /**
   * Xóa lịch sử trò chuyện (Khi kết thúc phiên)
   */
  static clearSession(sessionId) {
    chatHistoryDB.delete(sessionId);
  }
}
