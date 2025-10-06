import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { BlogPosts } from './payload/collections/BlogPosts'
import { Categories } from './payload/collections/Categories'
import { Authors } from './payload/collections/Authors'
import { Media } from './payload/collections/Media'
import { Portfolio } from './payload/collections/Portfolio'
import { PortfolioCategories } from './payload/collections/PortfolioCategories'
import { Pages } from './payload/collections/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Authors.slug,
  },
  collections: [
    Pages,
    BlogPosts,
    Categories,
    Authors,
    Media,
    Portfolio,
    PortfolioCategories,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-here',
  typescript: {
    outputFile: path.resolve(dirname, 'payload/payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: `file:${path.resolve(dirname, '../data/payload.db').replace(/\\/g, '/')}`,
    },
  }),
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
})
