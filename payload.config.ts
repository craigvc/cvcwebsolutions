import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { BlogPosts } from './src/payload/collections/BlogPosts'
import { Categories } from './src/payload/collections/Categories'
import { Authors } from './src/payload/collections/Authors'
import { Media } from './src/payload/collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Authors.slug,
  },
  collections: [
    BlogPosts,
    Categories,
    Authors,
    Media,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-here',
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload/payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: `file:${path.resolve(dirname, './data/payload.db').replace(/\\/g, '/')}`,
    },
    push: false, // Disable automatic schema migrations
  }),
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
})
