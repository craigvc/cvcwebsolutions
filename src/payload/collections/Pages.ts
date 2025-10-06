import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Page title displayed in the browser tab and as the main heading',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path for the page (e.g., "about" for /about)',
      },
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'headline',
          type: 'text',
          admin: {
            description: 'Main headline for the hero section',
          },
        },
        {
          name: 'subheadline',
          type: 'textarea',
          admin: {
            description: 'Supporting text below the headline',
          },
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'CTA Button Text',
          admin: {
            description: 'Text for the call-to-action button',
          },
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'CTA Button Link',
          admin: {
            description: 'URL for the call-to-action button',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: false,
      admin: {
        description: 'Main content of the page',
      },
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Page Sections',
      admin: {
        description: 'Add various content sections to build your page',
      },
      fields: [
        {
          name: 'sectionType',
          type: 'select',
          options: [
            { label: 'Text Block', value: 'textBlock' },
            { label: 'Image & Text', value: 'imageText' },
            { label: 'Feature Cards', value: 'featureCards' },
            { label: 'Call to Action', value: 'cta' },
            { label: 'FAQ', value: 'faq' },
            { label: 'Contact Form', value: 'contactForm' },
            { label: 'Stats', value: 'stats' },
            { label: 'Testimonials', value: 'testimonials' },
          ],
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            condition: (_data: any, _siblingData: any) => true,
          },
        },
        {
          name: 'content',
          type: 'richText',
          admin: {
            condition: (_data: any, siblingData: any) => 
              ['textBlock', 'imageText', 'cta'].includes(siblingData?.sectionType),
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_data: any, siblingData: any) => 
              siblingData?.sectionType === 'imageText',
          },
        },
        {
          name: 'imagePosition',
          type: 'select',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          defaultValue: 'left',
          admin: {
            condition: (_data: any, siblingData: any) => 
              siblingData?.sectionType === 'imageText',
          },
        },
        {
          name: 'features',
          type: 'array',
          admin: {
            condition: (_data: any, siblingData: any) => 
              siblingData?.sectionType === 'featureCards',
          },
          fields: [
            {
              name: 'icon',
              type: 'text',
              admin: {
                description: 'Icon name or emoji',
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
        {
          name: 'buttonText',
          type: 'text',
          admin: {
            condition: (_data: any, siblingData: any) => 
              siblingData?.sectionType === 'cta',
          },
        },
        {
          name: 'buttonLink',
          type: 'text',
          admin: {
            condition: (_data: any, siblingData: any) => 
              siblingData?.sectionType === 'cta',
          },
        },
        {
          name: 'faqs',
          type: 'array',
          admin: {
            condition: (_data: any, siblingData: any) => 
              siblingData?.sectionType === 'faq',
          },
          fields: [
            {
              name: 'question',
              type: 'text',
              required: true,
            },
            {
              name: 'answer',
              type: 'richText',
              required: true,
            },
          ],
        },
        {
          name: 'stats',
          type: 'array',
          admin: {
            condition: (_data: any, siblingData: any) => 
              siblingData?.sectionType === 'stats',
          },
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
            },
          ],
        },
        {
          name: 'testimonials',
          type: 'array',
          admin: {
            condition: (_data: any, siblingData: any) => 
              siblingData?.sectionType === 'testimonials',
          },
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              required: true,
            },
            {
              name: 'author',
              type: 'text',
              required: true,
            },
            {
              name: 'role',
              type: 'text',
            },
            {
              name: 'company',
              type: 'text',
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Title for search engines (max 60 characters)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Description for search engines (max 160 characters)',
          },
        },
        {
          name: 'metaKeywords',
          type: 'text',
          admin: {
            description: 'Comma-separated keywords for SEO',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Image for social media sharing',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }: any) => {
        // Auto-generate slug from title if not provided
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }
        return data
      },
    ],
  },
}
