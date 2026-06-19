import { defineField, defineType } from 'sanity'
import { DerivedCategoryInput } from '../components/DerivedCategoryInput'

export const resource = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'resourceType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Article', value: 'article' },
          { title: 'Video', value: 'video' },
          { title: 'Book', value: 'book' },
          { title: 'Tool', value: 'tool' },
          { title: 'Course', value: 'course' },
          { title: 'Template', value: 'template' },
          { title: 'Podcast', value: 'podcast' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtopic',
      title: 'Subtopic',
      type: 'string',
      description: 'Selecting a subtopic will automatically assign the category.',
      options: {
        list: [
          // Design Execution
          { title: 'Design Systems',          value: 'design-systems' },
          { title: 'Design Handoff',          value: 'design-handoff' },
          { title: 'Prototyping',             value: 'prototyping' },
          { title: 'Documentation',           value: 'documentation' },
          { title: 'Visual Architecture',     value: 'visual-architecture' },
          // Strategic Thinking
          { title: 'Design Rationale',        value: 'design-rationale' },
          { title: 'Stakeholder Management',  value: 'stakeholder-management' },
          { title: 'Product Thinking',        value: 'product-thinking' },
          { title: 'User Research',           value: 'user-research' },
          { title: 'Design Ethics',           value: 'design-ethics' },
          // Business & Growth
          { title: 'Product Analytics',       value: 'product-analytics' },
          { title: 'Conversion Optimization', value: 'conversion-optimization' },
          { title: 'SEO Optimization',        value: 'seo-optimization' },
          { title: 'Growth Design',           value: 'growth-design' },
          { title: 'Marketing & Strategy',    value: 'marketing-strategy' },
          // Career & Craft
          { title: 'Career Strategy',         value: 'career-strategy' },
          { title: 'Portfolio & Case Studies', value: 'portfolio-case-studies' },
          { title: 'AI-Assisted Workflow',    value: 'ai-assisted-workflow' },
          { title: 'Accessibility',           value: 'accessibility' },
          { title: 'Workflow Optimization',   value: 'workflow-optimization' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      readOnly: true,
      description: 'Auto-assigned based on the subtopic selected above.',
      components: { input: DerivedCategoryInput },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'resourceType', media: 'coverImage' },
  },
})
