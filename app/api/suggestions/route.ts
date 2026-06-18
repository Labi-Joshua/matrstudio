import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
const suggestionsQuery = groq`*[_type == "resource"] | order(title asc) { _id, title, "slug": slug.current, externalUrl }`

export async function GET() {
  try {
    const data = await client.fetch(suggestionsQuery)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
