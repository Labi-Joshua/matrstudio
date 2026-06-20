import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ image: null }, { status: 400 })

  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (yt) {
    return NextResponse.json(
      { image: `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg` },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  }

  // OG scraping
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Matrstudio/1.0; +https://matrstudio.com)' },
      signal: AbortSignal.timeout(5000),
    })
    const html = await res.text()
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    return NextResponse.json(
      { image: match?.[1] ?? null },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  } catch {
    return NextResponse.json({ image: null }, { headers: { 'Access-Control-Allow-Origin': '*' } })
  }
}
