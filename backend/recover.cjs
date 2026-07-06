const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\win\\.gemini\\antigravity-ide\\brain\\5898c6ca-7a0a-45fc-bc03-036eaa16eea1\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
        const step = JSON.parse(line);
        if (step.type === 'TOOL_RESPONSE' && typeof step.content === 'string') {
            if (step.content.includes('brand.data.js') && step.content.includes('Total Lines: 602')) {
                fs.writeFileSync('d:\\DuAnCaNhan\\QuanLyNhaHang\\backend\\raw_brand.txt', step.content);
                console.log('Found brand');
            }
            if (step.content.includes('restaurant.data.js') && step.content.includes('Total Lines: 691')) {
                fs.writeFileSync('d:\\DuAnCaNhan\\QuanLyNhaHang\\backend\\raw_rest.txt', step.content);
                console.log('Found rest');
            }
        }
    } catch(e) {}
  }
}
processLineByLine();
