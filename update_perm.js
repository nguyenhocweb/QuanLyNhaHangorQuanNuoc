import { prisma } from "./backend/src/databases/init.mongodb.js";

async function main() {
  await prisma.permission.updateMany({
    where: { name: "MANAGE_STAFF" },
    data: {
      name: "CREATE_STAFF",
      description: "Thêm, rút biên chế nhân viên tại chi nhánh (Không có quyền sửa, phân quyền)"
    }
  });
  console.log("Updated MANAGE_STAFF to CREATE_STAFF");
  process.exit(0);
}

main().catch(console.error);
