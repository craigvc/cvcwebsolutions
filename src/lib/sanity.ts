import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-09-11',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// GROQ queries
export const blogQueries = {
  // Get all published blog posts
  getAllPosts: `*[_type == "blog" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    "author": author->{
      name,
      slug,
      avatar
    },
    "categories": categories[]->{
      title,
      slug,
      color
    },
    "readingTime": round(length(pt::text(content)) / 5 / 200)
  }`,
  
  // Get a single blog post by slug
  getPostBySlug: `*[_type == "blog" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    publishedAt,
    updatedAt,
    mainImage,
    "author": author->{
      name,
      slug,
      bio,
      avatar,
      socialLinks
    },
    "categories": categories[]->{
      title,
      slug,
      color,
      description
    },
    tags,
    seo,
    "readingTime": round(length(pt::text(content)) / 5 / 200),
    "related": *[_type == "blog" && status == "published" && slug.current != $slug && count(categories[@._ref in ^.categories[]._ref]) > 0] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage,
      "author": author->{
        name,
        slug
      }
    }
  }`,
  
  // Get posts by category
  getPostsByCategory: `*[_type == "blog" && status == "published" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    "author": author->{
      name,
      slug,
      avatar
    },
    "readingTime": round(length(pt::text(content)) / 5 / 200)
  }`,
  
  // Get posts by author
  getPostsByAuthor: `*[_type == "blog" && status == "published" && author->slug.current == $authorSlug] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    "categories": categories[]->{
      title,
      slug,
      color
    },
    "readingTime": round(length(pt::text(content)) / 5 / 200)
  }`,
  
  // Get featured posts
  getFeaturedPosts: `*[_type == "blog" && status == "published" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    "author": author->{
      name,
      slug,
      avatar
    },
    "categories": categories[]->{
      title,
      slug,
      color
    }
  }`,
  
  // Get all categories
  getCategories: `*[_type == "category"] | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    color,
    icon,
    "postCount": count(*[_type == "blog" && status == "published" && references(^._id)])
  }`,
  
  // Get all authors
  getAuthors: `*[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    bio,
    avatar,
    role,
    featured,
    "postCount": count(*[_type == "blog" && status == "published" && references(^._id)])
  }`
}
