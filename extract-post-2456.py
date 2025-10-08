import re

with open(r'D:\UL Unreal Assets\cvcwebsolutions_wp_jdqla.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# Find post 2456
idx = content.find('(2456,')
if idx != -1:
    # Extract the full row
    start = idx
    depth = 0
    in_string = False
    escape_next = False

    for i in range(idx, min(idx + 50000, len(content))):
        char = content[i]

        if escape_next:
            escape_next = False
            continue

        if char == '\\' and in_string:
            escape_next = True
            continue

        if char == "'":
            in_string = not in_string
            continue

        if not in_string:
            if char == '(':
                depth += 1
            elif char == ')':
                depth -= 1
                if depth == 0:
                    end = i
                    break

    row_text = content[start:end+1]
    print(f'Extracted row for post 2456: {len(row_text)} characters')

    # Parse the fields
    fields = []
    current_field = []
    in_str = False
    esc = False
    paren_depth = 0

    # Skip opening paren
    for i in range(1, len(row_text) - 1):
        char = row_text[i]

        if esc:
            current_field.append(char)
            esc = False
            continue

        if char == '\\' and in_str:
            current_field.append(char)
            esc = True
            continue

        if char == "'":
            in_str = not in_str
            continue

        if not in_str:
            if char == '(':
                paren_depth += 1
                current_field.append(char)
            elif char == ')':
                paren_depth -= 1
                current_field.append(char)
            elif char == ',' and paren_depth == 0:
                fields.append(''.join(current_field).strip())
                current_field = []
            else:
                current_field.append(char)
        else:
            current_field.append(char)

    if current_field:
        fields.append(''.join(current_field).strip())

    print(f'\nParsed {len(fields)} fields')

    if len(fields) >= 21:
        print(f'\nPost ID: {fields[0]}')
        print(f'Post Title: {fields[5][:100]}')
        print(f'Post Status: {fields[7]}')
        print(f'Post Slug: {fields[11]}')
        print(f'Post Type (field 20): {fields[20]}')
        print(f'Post Date: {fields[2]}')
        print(f'\nContent preview (first 200 chars):')
        print(fields[4][:200])
    else:
        print(f'\nWarning: Only parsed {len(fields)} fields, expected at least 21')
        print('Fields found:')
        for i, field in enumerate(fields):
            print(f'{i}: {field[:50]}...')
else:
    print('Post 2456 not found')
