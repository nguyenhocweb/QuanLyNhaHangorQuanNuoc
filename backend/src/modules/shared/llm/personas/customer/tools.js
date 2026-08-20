import { customerTools, customerExecutors } from "../../tools/customer/index.js";

// 1. Khai báo Tools cho AI (Định dạng của Hãng)
export const declaredTools = [
  ...customerTools
];

// 2. Map hàm DB nội bộ tương ứng với Tools (Function Calling)
export const executorMap = {
  ...customerExecutors
};
