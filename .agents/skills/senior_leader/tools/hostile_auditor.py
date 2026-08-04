import sys
import os
import urllib.request
import urllib.error
import json
import time

MAX_CHARS = 1000000 # Safeguard limit ~ 1M characters

def call_gemini_api(prompt, file_content, contract_content, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    # Smart Truncation: Prioritize Code over ADRs
    base_overhead = len(prompt) + 200 # Approx prompt overhead
    available_chars = MAX_CHARS - base_overhead
    
    if len(file_content) > available_chars:
        # Extreme case: code itself is too big
        file_content = file_content[:available_chars] + "\n...[CODE TRUNCATED DUE TO LIMIT]"
        contract_content = ""
    elif len(file_content) + len(contract_content) > available_chars:
        # ADRs are too big, cut ADRs but keep full code
        allowed_contract_len = available_chars - len(file_content)
        print(f"[AUDITOR WARNING] Ngữ cảnh ADR quá dài, cắt bỏ phần ngọn xuống còn {allowed_contract_len} chars...")
        contract_content = contract_content[:allowed_contract_len] + "\n...[ADR TRUNCATED DUE TO LIMIT]"
        
    context_text = ""
    if contract_content:
        context_text = f"\n\nPROJECT CONTRACT/ADR:\n{contract_content}\n(Ensure the code complies with these architectural decisions)"
        
    combined_text = prompt + context_text + "\n\nCODE TO AUDIT:\n" + file_content
    
    data = {
        "contents": [{
            "parts": [{"text": combined_text}]
        }],
        "systemInstruction": {
            "parts": [{"text": "You are a Hostile Security Auditor. Your ONLY goal is to find architectural, logic, and security flaws, or deviations from the Project Contract."}]
        },
        "generationConfig": {
            "temperature": 0.2
        }
    }
    
    encoded_data = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method='POST')
    
    max_retries = 3
    base_delay = 2 # seconds
    
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                response_body = response.read().decode('utf-8')
                try:
                    result = json.loads(response_body)
                    return result['candidates'][0]['content']['parts'][0]['text']
                except (json.JSONDecodeError, KeyError) as parse_err:
                    print(f"[AUDITOR FATAL] Lỗi Parse JSON (Có thể do Safety Filter). Phản hồi: {response_body[:200]}...")
                    sys.exit(1) # Không retry lỗi cấu trúc
                    
        except urllib.error.HTTPError as e:
            if 400 <= e.code < 500 and e.code != 429: # Lỗi client/auth, không retry (trừ 429 rate limit)
                print(f"[AUDITOR FATAL] Client Error ({e.code}). Dừng gọi API: {e.read().decode('utf-8')}")
                sys.exit(1)
            print(f"[AUDITOR ERROR] HTTP Error {e.code} (Attempt {attempt+1}/{max_retries})")
        except urllib.error.URLError as e:
            print(f"[AUDITOR ERROR] Network/Timeout Error (Attempt {attempt+1}/{max_retries}): {e.reason}")
        except Exception as e:
            print(f"[AUDITOR ERROR] Unexpected Error (Attempt {attempt+1}/{max_retries}): {str(e)}")
            
        if attempt < max_retries - 1:
            sleep_time = base_delay * (2 ** attempt)
            print(f"Retrying in {sleep_time} seconds...")
            time.sleep(sleep_time)
        else:
            print("[AUDITOR FATAL] Hết lượt retry. Lỗi mạng hoặc API. Chặn Gate 5.")
            sys.exit(1)

def read_context_paths(paths):
    combined_content = ""
    for path in paths:
        if os.path.isfile(path):
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    combined_content += f"\n--- File: {path} ---\n{f.read()}"
            except Exception as e:
                print(f"[AUDITOR WARNING] Không thể đọc contract file {path}: {str(e)}")
        elif os.path.isdir(path):
            for root, _, files in os.walk(path):
                for file in files:
                    if file.endswith(('.md', '.yaml', '.yml', '.json')):
                        filepath = os.path.join(root, file)
                        try:
                            with open(filepath, 'r', encoding='utf-8') as f:
                                combined_content += f"\n--- File: {filepath} ---\n{f.read()}"
                        except Exception as e:
                            pass
    return combined_content

def main():
    if len(sys.argv) < 2:
        print("Sử dụng: python hostile_auditor.py <đường_dẫn_file_code> [đường_dẫn_file_contract_hoặc_thư_mục_ADRs...]")
        sys.exit(1)
        
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("[AUDITOR ERROR] Missing GEMINI_API_KEY environment variable. Gate 5 Blocked.")
        sys.exit(1)
        
    file_path = sys.argv[1]
    if not os.path.exists(file_path):
        print(f"[AUDITOR ERROR] Không tìm thấy file code: {file_path}")
        sys.exit(1)
        
    contract_content = ""
    if len(sys.argv) > 2:
        contract_content = read_context_paths(sys.argv[2:])

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            code_content = f.read()
    except Exception as e:
        print(f"[AUDITOR ERROR] Không thể đọc file code: {str(e)}")
        sys.exit(1)
        
    prompt = """
Hãy đóng vai một Auditor cực kỳ thù địch và khắt khe. Phân tích đoạn code sau đây.
Nếu bạn tìm thấy BẤT KỲ lỗi logic, lỗ hổng bảo mật, kiến trúc tồi, HOẶC vi phạm Contract/ADR đã cho, hãy chỉ ra chi tiết và BẮT BUỘC kết thúc phản hồi bằng chuỗi chính xác: "[AUDITOR_RESULT: REJECT]"
Nếu code hoàn toàn an toàn, tối ưu, tuân thủ đúng hợp đồng và không có lỗi nào, hãy trả về chuỗi chính xác: "[AUDITOR_RESULT: APPROVE]"
    """
    
    print(f"--- BẮT ĐẦU PHIÊN KIỂM TOÁN CÁCH LY (HOSTILE AUDITOR) ---")
    print(f"Đang phân tích file: {file_path} qua Gemini API (Timeout 30s, Smart Retry=3)...")
    
    response_text = call_gemini_api(prompt, code_content, contract_content, api_key)
    print("\n--- LLM AUDITOR FEEDBACK ---")
    print(response_text)
    print("----------------------------\n")
    
    if "[AUDITOR_RESULT: REJECT]" in response_text:
        print("[AUDITOR FATAL] Phát hiện lỗi bảo mật/logic/vi phạm hợp đồng. Chặn Gate 5.")
        sys.exit(1)
    elif "[AUDITOR_RESULT: APPROVE]" in response_text:
        print("[AUDITOR PASS] Code an toàn, chuẩn xác. Gate 5 Approved.")
        sys.exit(0)
    else:
        print("[AUDITOR WARNING] LLM không trả về kết quả chuẩn định dạng. Mặc định REJECT.")
        sys.exit(1)

if __name__ == "__main__":
    main()
