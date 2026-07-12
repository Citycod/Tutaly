import re
import os

with open('lint_output_2.txt', 'r') as f:
    lines = f.readlines()

file_warnings = {}
current_file = None

# /home/uplix/Desktop/UPLIX/tutaly/apps/web/src/app/...
# => src/app/...

for line in lines:
    line = line.strip()
    if line.startswith('/home/uplix/Desktop/UPLIX/tutaly/apps/web/'):
        # Normalize path
        current_file = line.replace('/home/uplix/Desktop/UPLIX/tutaly/apps/web/', '')
        if current_file not in file_warnings:
            file_warnings[current_file] = []
    elif current_file and 'Unused eslint-disable directive' in line:
        # e.g., "38:7  warning  Unused eslint-disable directive"
        match = re.match(r'^(\d+):', line)
        if match:
            line_num = int(match.group(1))
            file_warnings[current_file].append(line_num)

for file_path, warnings in file_warnings.items():
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        file_lines = f.readlines()
    
    # Sort descending so popping doesn't affect earlier indices
    warnings.sort(reverse=True)
    
    modified = False
    for line_num in warnings:
        idx = line_num - 1
        if 0 <= idx < len(file_lines):
            # Verify it's an eslint-disable line just to be safe
            if 'eslint-disable' in file_lines[idx]:
                file_lines.pop(idx)
                modified = True
    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(file_lines)
        print(f"Fixed {file_path}")
