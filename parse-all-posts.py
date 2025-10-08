import re
import json

with open(r'C:\Users\craig\Desktop\cvcwebsolutions_wp_jdqla.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the posts table INSERT
match = re.search(r'INSERT INTO `k8gbJ99R_posts`[^)]+\) VALUES (.+?);', content, re.DOTALL)

if match:
    values = match.group(1)
    print(f'Found VALUES section: {len(values)} characters')

    # Split by '),(' to separate rows
    rows = []
    depth = 0
    current_row = []
    in_string = False

    i = 0
    while i < len(values):
        char = values[i]

        # Handle string literals
        if char == "'" and (i == 0 or values[i-1] != '\\'):
            in_string = not in_string
            current_row.append(char)
        elif not in_string:
            if char == '(':
                depth += 1
                if depth == 1:
                    current_row = []
                else:
                    current_row.append(char)
            elif char == ')':
                depth -= 1
                if depth == 0:
                    rows.append(''.join(current_row))
                else:
                    current_row.append(char)
            else:
                current_row.append(char)
        else:
            current_row.append(char)

        i += 1

    print(f'\nTotal rows found: {len(rows)}')
    print('\n--- All Posts ---')

    all_posts = []

    for idx, row in enumerate(rows):
        # Parse the row values - simple split won't work, need to handle quoted strings
        values_list = []
        current_val = []
        in_str = False
        escaped = False

        for j, c in enumerate(row):
            if escaped:
                current_val.append(c)
                escaped = False
                continue

            if c == '\\' and not escaped:
                escaped = True
                current_val.append(c)
                continue

            if c == "'" and not escaped:
                in_str = not in_str
                current_val.append(c)
                continue

            if c == ',' and not in_str:
                values_list.append(''.join(current_val).strip())
                current_val = []
            else:
                current_val.append(c)

        if current_val:
            values_list.append(''.join(current_val).strip())

        if len(values_list) >= 21:
            post_id = values_list[0]
            title = values_list[5].strip("'").replace('\\\\', '\\')
            post_type = values_list[20].strip("'")
            post_status = values_list[7].strip("'")
            post_content = values_list[4].strip("'")[:200]

            post_info = {
                'id': post_id,
                'title': title,
                'type': post_type,
                'status': post_status
            }
            all_posts.append(post_info)

            print(f'ID: {post_id} | Type: {post_type} | Status: {post_status} | Title: {title[:80]}')

    # Save to JSON
    with open('all-wordpress-posts.json', 'w', encoding='utf-8') as f:
        json.dump(all_posts, f, indent=2, ensure_ascii=False)

    print(f'\nSaved {len(all_posts)} posts to all-wordpress-posts.json')

    # Count by type
    types = {}
    for post in all_posts:
        t = post['type']
        types[t] = types.get(t, 0) + 1

    print('\nPosts by type:')
    for t, count in types.items():
        print(f'  {t}: {count}')
else:
    print('No INSERT statement found')
