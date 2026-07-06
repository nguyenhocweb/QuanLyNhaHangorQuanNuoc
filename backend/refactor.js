import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Because type="module" is in package.json, we use import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcModulesDir = path.join(__dirname, 'src', 'modules');
const roleDirs = ['public', 'customer', 'staff', 'system_admin', 'shared'];

const folderMapping = {
  'auth': 'public/auth',
  'ai': 'public/ai',
  'restaurant': 'public/restaurant',
  'dish': 'public/menu',
  'reservation': 'customer/reservation',
  'table': 'staff/table',
  'brand': 'system_admin/brand',
  'dashboard': 'system_admin/dashboard',
  'cloudinary': 'shared/cloudinary',
  'llm': 'shared/llm',
  'vector': 'shared/vector',
  'user': 'customer/profile'
};

roleDirs.forEach(dir => {
  const dirPath = path.join(srcModulesDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

function refactor() {
  const moveOperations = [];

  const mappings = Object.entries(folderMapping).map(([oldName, newRelPath]) => {
    return {
      oldName,
      oldModuleRoot: path.join(srcModulesDir, oldName),
      newModuleRoot: path.join(srcModulesDir, newRelPath)
    };
  });

  mappings.forEach(({ oldModuleRoot, newModuleRoot }) => {
    if (fs.existsSync(oldModuleRoot)) {
      function collectFiles(currentDir) {
        const items = fs.readdirSync(currentDir);
        items.forEach(item => {
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            collectFiles(fullPath);
          } else {
            const relToModule = path.relative(oldModuleRoot, fullPath);
            const newFilePath = path.join(newModuleRoot, relToModule);
            moveOperations.push({ oldFilePath: fullPath, newFilePath, oldModuleRoot, newModuleRoot });
          }
        });
      }
      collectFiles(oldModuleRoot);
    }
  });

  // Calculate new target path for any absolute path in src/modules
  function getNewTargetPath(absolutePath) {
    for (const { oldModuleRoot, newModuleRoot } of mappings) {
      if (absolutePath.startsWith(oldModuleRoot)) {
        const rel = path.relative(oldModuleRoot, absolutePath);
        return path.join(newModuleRoot, rel);
      }
    }
    return absolutePath; // Didn't move
  }

  moveOperations.forEach(({ oldFilePath, newFilePath }) => {
    const dir = path.dirname(newFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let content = fs.readFileSync(oldFilePath, 'utf8');

    if (oldFilePath.endsWith('.js') || oldFilePath.endsWith('.ts')) {
      const regex = /(from\s+['"]|require\(['"]|import\(['"])(\.\.?\/.*?)(['"])/g;
      
      content = content.replace(regex, (match, p1, p2, p3) => {
        const oldFileDir = path.dirname(oldFilePath);
        const resolvedImportPath = path.resolve(oldFileDir, p2);
        
        const newTargetPath = getNewTargetPath(resolvedImportPath);
        const newFileDir = path.dirname(newFilePath);
        
        let newRelPath = path.relative(newFileDir, newTargetPath);
        // Ensure relative paths start with ./ or ../
        if (!newRelPath.startsWith('.')) {
          newRelPath = './' + newRelPath;
        }
        
        // Normalize slashes for imports
        newRelPath = newRelPath.replace(/\\/g, '/');
        
        return `${p1}${newRelPath}${p3}`;
      });
    }

    fs.writeFileSync(newFilePath, content, 'utf8');
  });

  // Delete old folders
  mappings.forEach(({ oldModuleRoot }) => {
    if (fs.existsSync(oldModuleRoot)) {
      fs.rmSync(oldModuleRoot, { recursive: true, force: true });
    }
  });
  
  console.log("Refactoring complete!");
}

refactor();
