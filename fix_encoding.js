const fs = require('fs');


const files = [
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/amenities/component/AmenitiesList.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/amenities/component/UpdateAmenityForm.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/brands/brands_components/DeleteBrand_modal.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/brands/brands_components/UpdateBrand_modal.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/categories/component/CategoryRestaurant_components.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/categories/component/createCategoryRestaurant_Form.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/categories/component/updateCategoryRestaurant_Form.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/restaurants/component/UpdateRestaurantStatus_Modal.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/reviews/component/SystemReviewsTable.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/subscriptions/component/CreateSubscriptionForm.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/subscriptions/component/SubscriptionsList.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/subscriptions/component/UpdateSubscriptionForm.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/tags/component/CreateTagForm.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin\tags/component/TagsList.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/tags/component/UpdateTagForm.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/users/component/formCreateUsersSytem-component.tsx",
    "D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/users/component/formUpdateUsersSytem-component.tsx"
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    
    // Read the corrupted UTF-8 file
    const corruptedContent = fs.readFileSync(file, 'utf8');
    
    // Check if it really contains mojibake like 'Quáº£n lÃ½'
    if (corruptedContent.includes('Quáº£n lÃ½') || corruptedContent.includes('Ã')) {
        // Convert the string to latin1 bytes (which corresponds to how it was read)
        const buffer = Buffer.from(corruptedContent, 'binary');
        // Parse the bytes as UTF-8
        let fixedContent = buffer.toString('utf8');
        
        // Remove the extra "use client"; added by powershell since it might have been duplicated or we want to cleanly add it
        fixedContent = fixedContent.replace(/^"use client";\r?\n/, '');
        
        // Prepend "use client"; correctly
        fixedContent = '"use client";\n' + fixedContent;
        
        fs.writeFileSync(file, fixedContent, 'utf8');
        console.log(`Fixed encoding for ${file}`);
    } else {
        console.log(`No mojibake found in ${file}, skipping decoding.`);
        // Just ensure it has use client
        if (!corruptedContent.match(/^"use client"/i)) {
            fs.writeFileSync(file, '"use client";\n' + corruptedContent, 'utf8');
            console.log(`Added use client to ${file}`);
        }
    }
}
