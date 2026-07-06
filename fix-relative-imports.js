const fs = require('fs');
const path = require('path');

const feDir = path.join(__dirname, 'fe', 'src', 'features');

const getAllFiles = (dir, fileList = []) => {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
};

const allFiles = getAllFiles(feDir);

const map = {
  'auth': 'auth',
  'cloudinary': 'shared/cloudinary',
  'user': 'system_admin/users',
  'table': 'staff/table',
  'reservation': 'customer/reservation',
  'restaurant': 'public/restaurant'
};

let count = 0;
for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const [oldName, newName] of Object.entries(map)) {
    // Replace import ".../../<feature>/..." with "@/src/features/<role>/<feature>/..."
    const regex = new RegExp(`from (['"])\\.\\./\\.\\./${oldName}/`, 'g');
    content = content.replace(regex, `from $1@/src/features/${newName}/`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
    count++;
  }
}
console.log(`Updated ${count} files.`);
