const TYPE_COLORS: Record<string, string> = {
  article: '#3B6FE0',
  video: '#DC4C4C',
  book: '#DC5405',
  tool: '#7C3AED',
  course: '#0F9D71',
  template: '#64748B',
  podcast: '#D6408F',
}

export function ResourceTypeBadge({ type }: { type?: string }) {
  const color = (type && TYPE_COLORS[type]) || '#6B7280'

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
      {type ?? 'untyped'}
    </span>
  )
}
