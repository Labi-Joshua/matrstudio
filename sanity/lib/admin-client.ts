import { createClient } from '@sanity/client'

// Carries the admin-account token — only import this from server-side code
// (Server Actions, Route Handlers), never from a Client Component.
// Points at a *separate* dataset from resources/submissions — see the auth
// plan for why (and why field-level encryption, not dataset privacy, is what
// actually protects this data).
export const adminClient = createClient({
  projectId: 'mx9td2to',
  dataset: process.env.SANITY_ADMIN_DATASET,
  apiVersion: '2025-01-01',
  token: process.env.SANITY_ADMIN_TOKEN,
  useCdn: false,
})
