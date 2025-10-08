import re
import json
import sqlite3

# Read the SQL file
print('Reading WordPress SQL dump...')
with open(r'D:\UL Unreal Assets\cvcwebsolutions_wp_jdqla.sql', 'r', encoding='utf-8') as f:
    sql_content = f.read()

print(f'SQL file loaded: {len(sql_content)} characters')

# Create a temporary SQLite database
print('\nCreating temporary SQLite database...')
conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# Create the posts table
cursor.execute('''
CREATE TABLE posts (
    ID INTEGER PRIMARY KEY,
    post_author INTEGER,
    post_date TEXT,
    post_date_gmt TEXT,
    post_content TEXT,
    post_title TEXT,
    post_excerpt TEXT,
    post_status TEXT,
    comment_status TEXT,
    ping_status TEXT,
    post_password TEXT,
    post_name TEXT,
    to_ping TEXT,
    pinged TEXT,
    post_modified TEXT,
    post_modified_gmt TEXT,
    post_content_filtered TEXT,
    post_parent INTEGER,
    guid TEXT,
    menu_order INTEGER,
    post_type TEXT,
    post_mime_type TEXT,
    comment_count INTEGER
)
''')

# Extract INSERT statements for k8gbJ99R_posts
print('\nExtracting INSERT statements...')
insert_pattern = r'INSERT INTO `k8gbJ99R_posts`[^V]+VALUES\s+(.*?);'
matches = re.finditer(insert_pattern, sql_content, re.DOTALL | re.MULTILINE)

total_posts = 0
for match in matches:
    values_str = match.group(1)

    # Convert MySQL INSERT to SQLite compatible format
    # The values are already in the format we need, just need to insert them
    try:
        insert_sql = f"INSERT INTO posts VALUES {values_str}"
        cursor.execute(insert_sql)
        rows_added = cursor.rowcount
        total_posts += rows_added
        print(f'  Added {rows_added} posts from this INSERT statement')
    except sqlite3.Error as e:
        print(f'  Error inserting: {e}')

conn.commit()

print(f'\nTotal posts loaded into database: {total_posts}')

# Query for blog posts (post_type = 'post')
print('\nQuerying for blog posts (post_type="post")...')
cursor.execute('''
    SELECT ID, post_title, post_name, post_status, post_date, post_type,
           LENGTH(post_content) as content_length
    FROM posts
    WHERE post_type = 'post' AND post_status = 'publish'
    ORDER BY post_date DESC
''')

blog_posts = cursor.fetchall()

print(f'\nFound {len(blog_posts)} published blog posts:')
print('-' * 100)

all_posts_data = []

for post in blog_posts:
    post_id, title, slug, status, date, post_type, content_len = post
    print(f'ID: {post_id} | {date} | {title[:60]} | Content: {content_len} chars')

    # Get full post data
    cursor.execute('SELECT * FROM posts WHERE ID = ?', (post_id,))
    full_post = cursor.fetchone()

    all_posts_data.append({
        'id': post_id,
        'title': title,
        'slug': slug,
        'status': status,
        'date': date,
        'content': full_post[4],  # post_content
        'excerpt': full_post[6]   # post_excerpt
    })

# Save to JSON
output_file = 'wordpress-blog-posts-extracted.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_posts_data, f, indent=2, ensure_ascii=False)

print(f'\n✓ Saved {len(all_posts_data)} blog posts to {output_file}')

# Also show stats by post type
print('\n--- All Posts by Type ---')
cursor.execute('''
    SELECT post_type, COUNT(*) as count
    FROM posts
    GROUP BY post_type
    ORDER BY count DESC
''')

for row in cursor.fetchall():
    print(f'{row[0]}: {row[1]}')

conn.close()
