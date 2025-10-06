import { CollectionConfig } from 'payload/types'

export const PortfolioCategories: CollectionConfig = {
  slug: 'portfolio-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'icon', 'color'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Category name (e.g., Education, Web Development)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the name',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
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
      name: 'icon',
      type: 'text',
      required: true,
      admin: {
        description: 'Emoji or icon for this category (e.g., 🎓, 💻, 🛒)',
      },
    },
    {
      name: 'color',
      type: 'select',
      defaultValue: 'blue',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Purple', value: 'purple' },
        { label: 'Red', value: 'red' },
        { label: 'Orange', value: 'orange' },
        { label: 'Pink', value: 'pink' },
        { label: 'Indigo', value: 'indigo' },
        { label: 'Teal', value: 'teal' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Gray', value: 'gray' },
      ],
      admin: {
        description: 'Color theme for this category',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description of this category',
      },
    },
  ],
}