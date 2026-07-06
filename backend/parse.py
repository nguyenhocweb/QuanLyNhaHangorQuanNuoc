import json
import re

log_path = r"C:\Users\win\.gemini\antigravity-ide\brain\5898c6ca-7a0a-45fc-bc03-036eaa16eea1\.system_generated\logs\transcript_full.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if not line.strip(): continue
        try:
            step = json.loads(line)
            if step.get('type') == 'TOOL_RESPONSE':
                content = step.get('content', '')
                if 'File Path: `file:///d:/DuAnCaNhan/QuanLyNhaHang/backend/src/databases/seed/constants/brand.data.js`' in content:
                    with open('raw_brand.txt', 'w', encoding='utf-8') as out:
                        out.write(content)
                        print("Saved raw_brand.txt")
                if 'File Path: `file:///d:/DuAnCaNhan/QuanLyNhaHang/backend/src/databases/seed/constants/restaurant.data.js`' in content:
                    with open('raw_rest.txt', 'w', encoding='utf-8') as out:
                        out.write(content)
                        print("Saved raw_rest.txt")
        except:
            pass
