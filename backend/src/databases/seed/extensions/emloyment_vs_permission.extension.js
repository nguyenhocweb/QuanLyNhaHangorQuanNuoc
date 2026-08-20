import { emp_vs_per } from "../constants/emloyment_vs_permission.data.js";

export const emp_vd_per_extension = async (prisma) => {
    // create data employment vs permission
    const result = await prisma.Permission_vs_Employment.createMany({
        data: emp_vs_per
    });
    console.log(`✅ Đã tạo thành công ${result.count} Employment vs Permission!`);
};
