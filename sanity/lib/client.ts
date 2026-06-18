import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'mx9td2to',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})
