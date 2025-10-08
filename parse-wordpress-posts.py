import re
import json

print('Reading WordPress SQL dump...')
with open(r'D:\UL Unreal Assets\cvcwebsolutions_wp_jdqla.sql', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Total lines: {len(lines)}')

# Extract lines 12598-12605 (the posts INSERT)
print('\nExtracting posts INSERT statement (lines 12598-12605)...')
insert_lines = lines[12597:12606]  # 0-indexed

# Join the lines
full_insert = ''.join(insert_lines)

# Find VALUES section
match = re.search(r'VALUES\s+(.+);', full_insert, re.DOTALL)
if not match:
    print('Could not find VALUES section')
    exit(1)

values_text = match.group(1)
print(f'VALUES section extracted: {len(values_text)} characters')

# Manual parsing: split by "),(" at the top level
print('\nParsing rows...')
rows = []
current_row = []
depth = 0
in_string = False
escape_next = False
i = 0

while i < len(values_text):
    char = values_text[i]

    if escape_next:
        current_row.append(char)
        escape_next = False
        i += 1
        continue

    if char == '\\' and in_string:
        current_row.append(char)
        escape_next = True
        i += 1
        continue

    if char == "'" and not escape_next:
        in_string = not in_string
        current_row.append(char)
        i += 1
        continue

    if not in_string:
        if char == '(':
            depth += 1
            if depth == 1:
                current_row = []
            else:
                current_row.append(char)
        elif char == ')':
            depth -= 1
            if depth == 0:
                if current_row:
                    rows.append(''.join(current_row))
            else:
                current_row.append(char)
        else:
            current_row.append(char)
    else:
        current_row.append(char)

    i += 1

print(f'Found {len(rows)} rows')

# Parse each row
blog_posts = []
all_posts = []

for idx, row in enumerate(rows):
    # Split by commas at top level (not in strings or parens)
    fields = []
    current_field = []
    in_str = False
    esc = False
    paren_depth = 0

    for j, c in enumerate(row):
        if esc:
            current_field.append(c)
            esc = False
            continue

        if c == '\\' and in_str:
            current_field.append(c)
            esc = True
            continue

        if c == "'":
            in_str = not in_str
            current_field.append(c)
            continue

        if not in_str:
            if c == '(':
                paren_depth += 1
                current_field.append(c)
            elif c == ')':
                paren_depth -= 1
                current_field.append(c)
            elif c == ',' and paren_depth == 0:
                fields.append(''.join(current_field).strip())
                current_field = []
            else:
                current_field.append(c)
        else:
            current_field.append(c)

    if current_field:
        fields.append(''.join(current_field).strip())

    if len(fields) >= 21:
        post_id = fields[0]
        title = fields[5].strip("'")
        post_type = fields[20].strip("'")
        post_status = fields[7].strip("'")
        post_name = fields[11].strip("'")
        post_date = fields[2].strip("'")
        post_content = fields[4].strip("'")
        post_excerpt = fields[6].strip("'")

        post_data = {
            'id': post_id,
            'title': title,
            'slug': post_name,
            'status': post_status,
            'type': post_type,
            'date': post_date,
            'content_preview': post_content[:200] if post_content else '',
            'content_length': len(post_content)
        }

        all_posts.append(post_data)

        if post_type == 'post' and post_status == 'publish':
            blog_posts.append({
                'id': post_id,
                'title': title,
                'slug': post_name,
                'date': post_date,
                'content': post_content,
                'excerpt': post_excerpt
            })
            print(f'  Blog Post {len(blog_posts)}: {title}')

print(f'\n--- Summary ---')
print(f'Total posts in database: {len(all_posts)}')
print(f'Published blog posts (post_type="post"): {len(blog_posts)}')

# Count by type
types = {}
for p in all_posts:
    t = p['type']
    types[t] = types.get(t, 0) + 1

print('\nPosts by type:')
for t, count in sorted(types.items(), key=lambda x: -x[1]):
    print(f'  {t}: {count}')

# Save blog posts
if blog_posts:
    with open('wordpress-blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(blog_posts, f, indent=2, ensure_ascii=False)
    print(f'\n✓ Saved {len(blog_posts)} blog posts to wordpress-blog-posts.json')
else:
    print('\n✗ No blog posts found to save')

# Save all posts summary
with open('wordpress-all-posts-summary.json', 'w', encoding='utf-8') as f:
    json.dump(all_posts, f, indent=2, ensure_ascii=False)
print(f'✓ Saved summary of all {len(all_posts)} posts to wordpress-all-posts-summary.json')
