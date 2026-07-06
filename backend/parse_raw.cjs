const fs = require('fs');
let text = fs.readFileSync('found_raw_utf8.txt', 'utf8').split('\n');

for (let line of text) {
    if (!line.trim()) continue;
    let jsonStart = line.indexOf('{');
    if (jsonStart === -1) continue;
    let jsonStr = line.substring(jsonStart);
    try {
        let step = JSON.parse(jsonStr);
        let content = step.content;
        if (!content) continue;
        
        let brandMatch = content.match(/File Path: [^\n]+brand\.data\.js[^\n]*\nTotal Lines: \d+[^\n]*\n(?:[^\n]*\n)*?The following code[^\n]*\n([\s\S]*?)The above content shows/m);
        if (brandMatch) {
            let raw = brandMatch[1];
            let lines = raw.split('\n');
            let out = [];
            for (let l of lines) {
                out.push(l.replace(/^\d+:\s?/, ''));
            }
            fs.writeFileSync('src/databases/seed/constants/brand.data.js', out.join('\n').trim() + '\n');
            console.log('Restored brand.data.js');
        }

        let restMatch = content.match(/File Path: [^\n]+restaurant\.data\.js[^\n]*\nTotal Lines: \d+[^\n]*\n(?:[^\n]*\n)*?The following code[^\n]*\n([\s\S]*?)The above content shows/m);
        if (restMatch) {
            let raw = restMatch[1];
            let lines = raw.split('\n');
            let out = [];
            for (let l of lines) {
                out.push(l.replace(/^\d+:\s?/, ''));
            }
            fs.writeFileSync('src/databases/seed/constants/restaurant.data.js', out.join('\n').trim() + '\n');
            console.log('Restored restaurant.data.js');
        }
    } catch(e) {}
}
