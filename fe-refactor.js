const fs = require('fs');
const path = require('path');

const srcFeaturesDir = path.join(__dirname, 'fe', 'src', 'features');
const feDir = path.join(__dirname, 'fe', 'src'); // Check both features and app

// Map old feature folders to new role/feature paths
const moveMap = {
  'ChatBoxAi': 'public/chatbox_ai',
  'dish': 'public/dish',
  'restaurant': 'public/restaurant',
  'auth': 'auth/auth',
  'reservation': 'customer/reservation',
  'brands': 'system_admin/brands',
  'system': 'system_admin/dashboard',
  'user': 'system_admin/users',
  'table': 'staff/table',
  'cloudinary': 'shared/cloudinary',
  'profile': 'shared/profile'
};

// 1. Move directories
console.log('--- MOVING DIRECTORIES ---');
for (const [oldFolder, newRelativePath] of Object.entries(moveMap)) {
  const oldPath = path.join(srcFeaturesDir, oldFolder);
  const newPath = path.join(srcFeaturesDir, newRelativePath);

  if (fs.existsSync(oldPath)) {
    // create parent dirs if not exist
    fs.mkdirSync(path.dirname(newPath), { recursive: true });
    
    // move
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`Moved: ${oldFolder} -> ${newRelativePath}`);
    } catch (e) {
      console.error(`Failed to move ${oldFolder}: ${e.message}`);
    }
  } else {
    console.log(`Skipped: ${oldFolder} (Not found)`);
  }
}

// 2. Update imports in ALL .ts, .tsx files inside `fe/src`
console.log('\n--- UPDATING IMPORTS ---');

const getAllFiles = (dir, fileList = []) => {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // skip node_modules just in case
      if (file !== 'node_modules') {
        getAllFiles(filePath, fileList);
      }
    } else if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
};

const allFiles = getAllFiles(feDir);
let filesUpdated = 0;

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace import paths
  for (const [oldFolder, newRelativePath] of Object.entries(moveMap)) {
    // Update alias imports: @/src/features/OLD/... -> @/src/features/NEW/...
    const regexAlias = new RegExp(`@/src/features/${oldFolder}/`, 'g');
    content = content.replace(regexAlias, `@/src/features/${newRelativePath}/`);
    
    const regexAliasNoSlash = new RegExp(`@/src/features/${oldFolder}(['"\`])`, 'g');
    content = content.replace(regexAliasNoSlash, `@/src/features/${newRelativePath}$1`);
  }

  // NOTE: For relative imports inside `features`, it's more complex if they moved across levels.
  // We assume most imports are alias-based as seen in grep results.
  // If there are relative imports `../../`, they might break. We will rely on alias.

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
  }
}

console.log(`\nUpdated imports in ${filesUpdated} files.`);
