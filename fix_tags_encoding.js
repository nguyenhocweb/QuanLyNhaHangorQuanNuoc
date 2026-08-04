const fs = require('fs');
const file = 'D:/DuAnCaNhan/QuanLyNhaHang/fe/src/features/system_admin/tags/component/TagsList.tsx';
const corruptedContent = fs.readFileSync(file, 'utf8');
if (corruptedContent.includes('Ã')) {
    const buffer = Buffer.from(corruptedContent, 'binary');
    let fixedContent = buffer.toString('utf8');
    fixedContent = fixedContent.replace(/^"use client";\r?\n/, '');
    fixedContent = '"use client";\n' + fixedContent;
    fs.writeFileSync(file, fixedContent, 'utf8');
    console.log('Fixed TagsList.tsx');
} else {
    console.log('TagsList.tsx was fine');
}
