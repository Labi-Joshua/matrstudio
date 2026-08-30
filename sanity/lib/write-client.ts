import { createClient } from '@sanity/client'

// Carries a write token — only import this from server-side code
// (Server Actions, Route Handlers), never from a Client Component.
export const writeClient = createClient({
  projectId: 'mx9td2to',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})
