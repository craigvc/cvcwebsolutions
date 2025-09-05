import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Create database directory if it doesn't exist
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database
const db = new Database(path.join(dbDir, 'content.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables for portfolio case studies
db.exec(`
  CREATE TABLE IF NOT EXISTS portfolio_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT,
    client_category TEXT,
    description TEXT,
    image TEXT,
    tags TEXT,
    featured BOOLEAN DEFAULT 0,
    url TEXT,
    year TEXT,
    achievements TEXT,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    key_features TEXT,
    testimonial TEXT,
    testimonial_author TEXT,
    testimonial_role TEXT,
    technologies TEXT,
    client_name TEXT,
    work_type TEXT,
    duration TEXT,
    team_size TEXT,
    role TEXT,
    status TEXT DEFAULT 'published',
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create tables for blog posts
db.exec(`
  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author TEXT,
    category TEXT,
    tags TEXT,
    featured_image TEXT,
    meta_description TEXT,
    published BOOLEAN DEFAULT 0,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add screenshot_url column if it doesn't exist (migration)
try {
  db.exec(`ALTER TABLE portfolio_projects ADD COLUMN screenshot_url TEXT`);
} catch (e) {
  // Column already exists, ignore error
}

// Create indexes for better performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio_projects(slug);
  CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_projects(featured);
  CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
  CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published);
`);

// Portfolio functions
export const getPortfolioProjects = (limit = 100) => {
  const stmt = db.prepare(`
    SELECT * FROM portfolio_projects 
    WHERE status = 'published'
    ORDER BY published_at DESC, created_at DESC 
    LIMIT ?
  `);
  return stmt.all(limit);
};

export const getPortfolioProject = (idOrSlug: string | number) => {
  const isId = typeof idOrSlug === 'number';
  const query = isId 
    ? 'SELECT * FROM portfolio_projects WHERE id = ?'
    : 'SELECT * FROM portfolio_projects WHERE slug = ?';
  const stmt = db.prepare(query);
  return stmt.get(idOrSlug);
};

export const addPortfolioProject = (project: any) => {
  const stmt = db.prepare(`
    INSERT INTO portfolio_projects (
      title, slug, category, client_category, description, image, tags, 
      featured, url, year, achievements, challenge, solution, results,
      key_features, testimonial, testimonial_author, testimonial_role,
      technologies, client_name, work_type, duration, team_size, role,
      published_at
    ) VALUES (
      @title, @slug, @category, @client_category, @description, @image, @tags,
      @featured, @url, @year, @achievements, @challenge, @solution, @results,
      @key_features, @testimonial, @testimonial_author, @testimonial_role,
      @technologies, @client_name, @work_type, @duration, @team_size, @role,
      @published_at
    )
  `);
  
  const info = stmt.run({
    ...project,
    tags: Array.isArray(project.tags) ? project.tags.join(',') : project.tags,
    achievements: Array.isArray(project.achievements) ? project.achievements.join(',') : project.achievements,
    technologies: Array.isArray(project.technologies) ? project.technologies.join(',') : project.technologies,
    featured: project.featured ? 1 : 0,
    published_at: new Date().toISOString()
  });
  
  return info.lastInsertRowid;
};

export const updatePortfolioProject = (idOrSlug: string | number, updates: any) => {
  const isId = typeof idOrSlug === 'number';
  const whereClause = isId ? 'id = ?' : 'slug = ?';
  const fields = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
  const stmt = db.prepare(`
    UPDATE portfolio_projects 
    SET ${fields}, updated_at = CURRENT_TIMESTAMP 
    WHERE ${whereClause}
  `);
  
  const info = stmt.run({
    ...updates,
    tags: Array.isArray(updates.tags) ? updates.tags.join(',') : updates.tags,
    achievements: Array.isArray(updates.achievements) ? updates.achievements.join(',') : updates.achievements,
    technologies: Array.isArray(updates.technologies) ? updates.technologies.join(',') : updates.technologies,
    featured: updates.featured !== undefined ? (updates.featured ? 1 : 0) : updates.featured
  }, idOrSlug);
  
  return info.changes > 0;
};

export const deletePortfolioProject = (idOrSlug: string | number) => {
  const isId = typeof idOrSlug === 'number';
  const whereClause = isId ? 'id = ?' : 'slug = ?';
  const stmt = db.prepare(`DELETE FROM portfolio_projects WHERE ${whereClause}`);
  const info = stmt.run(idOrSlug);
  return info.changes > 0;
};

// Blog functions
export const getBlogPosts = (limit = 100, publishedOnly = true) => {
  const query = publishedOnly 
    ? 'SELECT * FROM blog_posts WHERE published = 1 ORDER BY published_at DESC, created_at DESC LIMIT ?'
    : 'SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT ?';
  const stmt = db.prepare(query);
  return stmt.all(limit);
};

export const getBlogPost = (slug: string) => {
  const stmt = db.prepare('SELECT * FROM blog_posts WHERE slug = ?');
  return stmt.get(slug);
};

export const addBlogPost = (post: any) => {
  const stmt = db.prepare(`
    INSERT INTO blog_posts (
      title, slug, content, excerpt, author, category, tags,
      featured_image, meta_description, published, published_at
    ) VALUES (
      @title, @slug, @content, @excerpt, @author, @category, @tags,
      @featured_image, @meta_description, @published, @published_at
    )
  `);
  
  const info = stmt.run({
    ...post,
    tags: Array.isArray(post.tags) ? post.tags.join(',') : post.tags,
    published: post.published ? 1 : 0,
    published_at: post.published ? new Date().toISOString() : null
  });
  
  return info.lastInsertRowid;
};

export const updateBlogPost = (slug: string, updates: any) => {
  const fields = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
  const stmt = db.prepare(`
    UPDATE blog_posts 
    SET ${fields}, updated_at = CURRENT_TIMESTAMP 
    WHERE slug = ?
  `);
  
  const info = stmt.run({
    ...updates,
    tags: Array.isArray(updates.tags) ? updates.tags.join(',') : updates.tags,
    published: updates.published ? 1 : 0,
    published_at: updates.published ? new Date().toISOString() : null
  }, slug);
  
  return info.changes > 0;
};

export const deleteBlogPost = (slug: string) => {
  const stmt = db.prepare('DELETE FROM blog_posts WHERE slug = ?');
  const info = stmt.run(slug);
  return info.changes > 0;
};

// Bulk import function for marketing suite sync
export const syncPortfolioProjects = (projects: any[]) => {
  const deleteStmt = db.prepare('DELETE FROM portfolio_projects');
  const insertStmt = db.prepare(`
    INSERT INTO portfolio_projects (
      title, slug, category, client_category, description, image, tags, 
      featured, url, year, achievements, challenge, solution, results,
      key_features, testimonial, testimonial_author, testimonial_role,
      technologies, client_name, work_type, duration, team_size, role,
      published_at
    ) VALUES (
      @title, @slug, @category, @client_category, @description, @image, @tags,
      @featured, @url, @year, @achievements, @challenge, @solution, @results,
      @key_features, @testimonial, @testimonial_author, @testimonial_role,
      @technologies, @client_name, @work_type, @duration, @team_size, @role,
      @published_at
    )
  `);
  
  const transaction = db.transaction((projects) => {
    deleteStmt.run(); // Clear existing projects
    
    for (const project of projects) {
      const slug = project.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      insertStmt.run({
        ...project,
        slug,
        tags: Array.isArray(project.tags) ? project.tags.join(',') : project.tags,
        achievements: Array.isArray(project.achievements) ? project.achievements.join(',') : project.achievements,
        technologies: Array.isArray(project.technologies) ? project.technologies.join(',') : project.technologies,
        featured: project.featured ? 1 : 0,
        published_at: project.publishedAt || new Date().toISOString()
      });
    }
  });
  
  transaction(projects);
  return projects.length;
};

export default db;