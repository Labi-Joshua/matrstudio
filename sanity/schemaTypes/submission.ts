import { defineField, defineType } from 'sanity'

export const submission = defineType({
  name: 'submission',
  title: 'Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      description: 'The subtopic value submitted with the resource. May be free text if the submitter suggested a topic not in the list.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'creator',
      title: 'Creator / Source',
      type: 'string',
    }),
    defineField({
      name: 'rationale',
      title: "Curator's Rationale",
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'submitterEmail',
      title: 'Submitter Email',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
    }),
    defineField({
      name: 'resolvedResourceId',
      title: 'Resolved Resource ID',
      type: 'string',
      readOnly: true,
      description: 'Set automatically when this submission is approved and turned into a resource.',
    }),
    defineField({
      name: 'reviewedAt',
      title: 'Reviewed At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Reviewed By',
      type: 'object',
      readOnly: true,
      description: 'Snapshot of the admin who approved/rejected this — admin accounts live in a separate dataset, so this can’t be a live reference.',
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status' },
  },
})
