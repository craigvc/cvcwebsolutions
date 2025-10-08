import re
import json

# Read the SQL file
with open(r'C:\Users\craig\Desktop\cvcwebsolutions_wp_jdqla.sql', 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Find the posts INSERT statement
posts_pattern = r"INSERT INTO `k8gbJ99R_posts` \([^)]+\) VALUES (.+?);"
match = re.search(posts_pattern, sql_content, re.DOTALL)

if not match:
    print("Could not find posts INSERT statement")
    exit(1)

values_text = match.group(1)
print(f"Found VALUES section, length: {len(values_text)}")

# Column names
columns = ['ID', 'post_author', 'post_date', 'post_date_gmt', 'post_content', 'post_title',
           'post_excerpt', 'post_status', 'comment_status', 'ping_status', 'post_password',
           'post_name', 'to_ping', 'pinged', 'post_modified', 'post_modified_gmt',
           'post_content_filtered', 'post_parent', 'guid', 'menu_order', 'post_type',
           'post_mime_type', 'comment_count']

# Parse each row - split by ),(
# Need careful parsing because content contains ),(
rows = []
current_row = ""
depth = 0
in_string = False
escape_next = False

for i, char in enumerate(values_text):
    if escape_next:
        current_row += char
        escape_next = False
        continue

    if char == '\\':
        current_row += char
        escape_next = True
        continue

    if char == "'" and not escape_next:
        in_string = not in_string
        current_row += char
        continue

    if not in_string:
        if char == '(':
            depth += 1
            if depth == 1:
                current_row = ""
            else:
                current_row += char
        elif char == ')':
            depth -= 1
            if depth == 0:
                if current_row.strip():
                    rows.append(current_row)
                current_row = ""
            else:
                current_row += char
        else:
            current_row += char
    else:
        current_row += char

print(f"Extracted {len(rows)} total WordPress entries")

# Now parse each row's values
blog_posts = []

for row_idx, row in enumerate(rows):
    # Split by comma, but respect quoted strings
    values = []
    current_val = ""
    in_string = False
    escape_next = False

    for char in row:
        if escape_next:
            current_val += char
            escape_next = False
            continue

        if char == '\\':
            current_val += char
            escape_next = True
            continue

        if char == "'":
            in_string = not in_string
            current_val += char
            continue

        if char == ',' and not in_string:
            values.append(current_val.strip())
            current_val = ""
        else:
            current_val += char

    # Add last value
    if current_val.strip():
        values.append(current_val.strip())

    # Create post dict
    if len(values) != len(columns):
        print(f"Row {row_idx}: Expected {len(columns)} values, got {len(values)}")
        continue

    post = dict(zip(columns, values))

    # Clean up values - remove quotes
    for key in post:
        val = post[key]
        if val == 'NULL':
            post[key] = None
        elif val.startswith("'") and val.endswith("'"):
            post[key] = val[1:-1]  # Remove quotes

    # Only keep published blog posts
    if post.get('post_type') == 'post' and post.get('post_status') == 'publish':
        blog_posts.append(post)
        print(f"Found blog post: {post['post_title']}")

print(f"\nFound {len(blog_posts)} published blog posts")

# Save to JSON
with open('wordpress-blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(blog_posts, f, indent=2, ensure_ascii=False)

print(f"Saved to wordpress-blog-posts.json")
