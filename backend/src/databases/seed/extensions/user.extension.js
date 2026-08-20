import {User_Admin,User_Brand,User_Customer,User_Restaurant} from "../constants/user.data.js";
// lấy id role để gán cho user admin khách hàng
const getRoleId = async (prisma) => {
    return await prisma.Role.findMany({
        select:{
            id: true,
            name: true
        }
    })
}
export const users_Extension =async (prisma) => {
        // xóa dữ liệu cũ
        console.log('creating users...');
        const Role = await getRoleId(prisma);
        
        
       
        // tạo dữ liệu admin
        const adminUser=await User_Admin();
        const result_admin = await prisma.User.createMany({
            data:adminUser.map(user => ({...user, roleId: Role.find(r => r.name === "Admin")?.id})),       // Mảng dữ liệu
        });
        console.log(`✅ Đã tạo thành công ${result_admin.count} Admin!`);
        // tạo dữ liệu cho khách hàng
        const customerUser =await User_Customer();
        const result_customer = await prisma.User.createMany({
            data: customerUser.map(user => ({...user, roleId: Role.find(r => r.name === "Khách hàng")?.id})),       // Mảng dữ liệu
        });
        console.log(`✅ Đã tạo thành công ${result_customer.count} Khách hàng!`);
        
        // tạo dữ liệu cho nhân viên thương hiệu
        const brandUser=await User_Brand();
        const result_brand = await prisma.User.createMany({
            data: brandUser  // Mảng dữ liệu
        });
        console.log(`✅ Đã tạo thành công ${result_brand.count} Nhân viên thương hiệu!`);
        
        // tạo dữ liệu cho nhân viên nhà hàng
        const restauranUser=await User_Restaurant();
        const result_restaurant = await prisma.User.createMany({
            data: restauranUser,       // Mảng dữ liệu
        });
        console.log(`✅ Đã tạo thành công ${result_restaurant.count} Nhân viên nhà hàng!`);
}
