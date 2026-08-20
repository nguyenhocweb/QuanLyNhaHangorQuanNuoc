import { emp_vs_per } from "../constants/emloyment_vs_permission.data.js";

export const emp_vd_per_extension = async (prisma) => {
    console.log('🚀 Đang khởi tạo Permission vs Employment...');

    // 1. Lấy danh sách username duy nhất để query
    const uniqueUserNames = [...new Set(emp_vs_per.map(e => e.user_name))];

    // 2. Query song song để tiết kiệm thời gian
    const [users, permissions] = await Promise.all([
        prisma.user.findMany({
            where: { user_name: { in: uniqueUserNames } },
            select: {
                user_name: true,
                employments: { select: { id: true }, take: 1 }
            }
        }),
        prisma.permission.findMany({
            select: { id: true, name: true, type: true }
        })
    ]);

    // 3. Chuyển dữ liệu sang Map để "get" cho nhanh
    // Map User: key = user_name, value = employment_id
    const empMap = new Map(
        users
            .filter(u => u.employments.length > 0)
            .map(u => [u.user_name, u.employments[0].id])
    );

    // Map Permission: key = "NAME_TYPE", value = id
    const perMap = new Map(
        permissions.map(p => [`${p.name}_${p.type}`, p.id])
    );

    // 4. Tạo mảng dữ liệu để nạp vào DB
    const dataToCreate = emp_vs_per
        .map(e => {
            const employmentId = empMap.get(e.user_name);
            const permissionId = perMap.get(`${e.namePermission}_${e.type}`);

            return (employmentId && permissionId) 
                ? { employmentId, permissionId } 
                : null;
        })
        .filter(Boolean); // Loại bỏ các giá trị null nhanh gọn

    // 5. Thực thi nạp dữ liệu
    if (dataToCreate.length > 0) {
        // Tùy chọn: Xóa dữ liệu cũ nếu bạn muốn seed lại từ đầu
        // await prisma.permission_vs_Employment.deleteMany({});

        const result = await prisma.permission_vs_Employment.createMany({
            data: dataToCreate
         });
        console.log(`✅ Đã tạo thành công ${result.count} bản ghi!`);
    } else {
        console.log("⚠️ Không tìm thấy dữ liệu khớp để tạo.");
    }
};