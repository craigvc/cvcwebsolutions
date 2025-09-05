import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export type BlogPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  category: string
  readingTime: string
  content: string
}

const postsDirectory = path.join(process.cwd(), 'src/content/blog')

export function getAllPosts(): BlogPost[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const stats = readingTime(content)

      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || '',
        author: data.author || 'CVC Team',
        category: data.category || 'General',
        readingTime: stats.text,
        content,
      }
    })

  return allPosts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const stats = readingTime(content)

  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    excerpt: data.excerpt || '',
    author: data.author || 'CVC Team',
    category: data.category || 'General',
    readingTime: stats.text,
    content,
  }
}