import { CollectionConfig } from 'payload/types'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'status', 'year'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      label: '📌 Website URL (Start Here First!)',
      admin: {
        description: '🚀 Enter the website URL first, then use AI to auto-populate all other fields with contextual information',
        placeholder: 'https://example.com',
      },
    },
    {
      name: 'github_url',
      type: 'text',
      admin: {
        description: 'GitHub repository URL (if applicable)',
        placeholder: 'https://github.com/username/repo',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Project title (auto-populated from website)',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Compelling tagline for the project (auto-populated from website)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the title',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: '🌐 Websites', value: 'Websites' },
        { label: '� Web Applications', value: 'Web Applications' },
        { label: '📱 Mobile Apps', value: 'Mobile Apps' },
        { label: '� E-Commerce', value: 'E-Commerce' },
      ],
      admin: {
        description: 'Primary category for this project',
      },
    },
    {
      name: 'clientCategory',
      type: 'text',
      admin: {
        description: 'Optional client-specific category',
      },
    },
    {
      name: 'custom_subtitle',
      type: 'text',
      admin: {
        description: 'Custom subtitle for featured projects',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief project description (auto-populated from website meta description)',
      },
    },
    {
      name: 'long_description',
      type: 'richText',
      admin: {
        description: 'Detailed case study description with rich formatting',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show this project in the featured section',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'display_order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
    {
      name: 'published_at',
      type: 'date',
      admin: {
        description: 'Date when the project was/will be published',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main project image',
      },
    },
    {
      name: 'image_url',
      type: 'text',
      admin: {
        description: 'Direct image URL (alternative to upload)',
      },
    },
    {
      name: 'images',
      type: 'group',
      admin: {
        description: 'Screenshots for different display contexts',
      },
      fields: [
        {
          name: 'detail',
          type: 'text',
          admin: {
            description: 'Screenshot for portfolio detail page hero',
          },
        },
        {
          name: 'featured',
          type: 'text',
          admin: {
            description: 'Screenshot for featured portfolio cards',
          },
        },
        {
          name: 'listing',
          type: 'text',
          admin: {
            description: 'Screenshot for portfolio grid listing',
          },
        },
      ],
    },
    {
      name: 'imageSettings',
      type: 'group',
      admin: {
        description: 'Screenshot positioning and scale settings',
      },
      fields: [
        {
          name: 'detail',
          type: 'group',
          fields: [
            { name: 'x', type: 'number', defaultValue: 0 },
            { name: 'y', type: 'number', defaultValue: 0 },
            { name: 'scale', type: 'number', defaultValue: 1 },
          ],
        },
        {
          name: 'featured',
          type: 'group',
          fields: [
            { name: 'x', type: 'number', defaultValue: 0 },
            { name: 'y', type: 'number', defaultValue: 0 },
            { name: 'scale', type: 'number', defaultValue: 1 },
          ],
        },
        {
          name: 'listing',
          type: 'group',
          fields: [
            { name: 'x', type: 'number', defaultValue: 0 },
            { name: 'y', type: 'number', defaultValue: 0 },
            { name: 'scale', type: 'number', defaultValue: 1 },
          ],
        },
      ],
    },
    {
      name: 'year',
      type: 'text',
      required: true,
      admin: {
        description: 'Project year (e.g., 2024)',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        description: 'Technology tags',
      },
    },
    {
      name: 'achievements',
      type: 'array',
      fields: [
        {
          name: 'achievement',
          type: 'text',
        },
      ],
      admin: {
        description: 'Key project achievements',
      },
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [
        {
          name: 'technology',
          type: 'text',
        },
      ],
      admin: {
        description: 'Technologies used in the project',
      },
    },
    {
      name: 'challenge',
      type: 'textarea',
      admin: {
        description: 'The challenge or problem this project solved',
      },
    },
    {
      name: 'solution',
      type: 'textarea',
      admin: {
        description: 'How the project solved the challenge',
      },
    },
  ],
}
