const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('Foleat')) {
        content = content.replace(/Foleat/g, 'NVNguyen');
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
        count++;
    }
});
console.log(`Successfully replaced Foleat with NVNguyen in ${count} files.`);
