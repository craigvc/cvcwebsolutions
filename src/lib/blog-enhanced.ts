import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'src/content/blog')

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  author: string
  featuredImage?: string
  content: string
  seoMetaDescription?: string
  estimatedReadTime?: number
}

export function getAllPosts(): BlogPost[] {
  try {
    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPosts = fileNames
      .filter(fileName => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.(mdx|md)$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          title: data.title || 'Untitled',
          excerpt: data.excerpt || '',
          date: data.date || new Date().toISOString(),
          category: data.category || 'general',
          tags: data.tags || [],
          author: data.author || 'CVC Web Solutions',
          featuredImage: data.featuredImage,
          content,
          seoMetaDescription: data.seoMetaDescription,
          estimatedReadTime: data.estimatedReadTime || 5
        }
      })

    // Sort posts by date
    return allPosts.sort((a, b) => {
      if (a.date < b.date) return 1
      if (a.date > b.date) return -1
      return 0
    })
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const mdxPath = path.join(postsDirectory, `${slug}.mdx`)
    const mdPath = path.join(postsDirectory, `${slug}.md`)
    
    let fullPath = ''
    if (fs.existsSync(mdxPath)) {
      fullPath = mdxPath
    } else if (fs.existsSync(mdPath)) {
      fullPath = mdPath
    } else {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      date: data.date || new Date().toISOString(),
      category: data.category || 'general',
      tags: data.tags || [],
      author: data.author || 'CVC Web Solutions',
      featuredImage: data.featuredImage,
      content,
      seoMetaDescription: data.seoMetaDescription,
      estimatedReadTime: data.estimatedReadTime || 5
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post => post.category === category)
}

export function getPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post => post.tags.includes(tag))
}

export function getCategories(): string[] {
  const allPosts = getAllPosts()
  const categories = new Set(allPosts.map(post => post.category))
  return Array.from(categories)
}

export function getTags(): string[] {
  const allPosts = getAllPosts()
  const tags = new Set(allPosts.flatMap(post => post.tags))
  return Array.from(tags)
}