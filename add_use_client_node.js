const fs = require('fs');

const files = [
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/brands/brands_components/DeleteBrand_modal.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/brands/brands_components/UpdateBrand_modal.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/categories/component/createCategoryRestaurant_Form.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/categories/component/updateCategoryRestaurant_Form.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/subscriptions/component/CreateSubscriptionForm.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/subscriptions/component/SubscriptionsList.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/subscriptions/component/UpdateSubscriptionForm.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/users/component/formCreateUsersSytem-component.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/users/component/formUpdateUsersSytem-component.tsx"
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    
    const content = fs.readFileSync(file, 'utf8');
    if (!content.match(/^"use client"/i)) {
        fs.writeFileSync(file, '"use client";\n' + content, 'utf8');
        console.log(`Added use client to ${file}`);
    }
}
