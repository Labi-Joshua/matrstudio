export type CategorySlug =
  | 'design-execution'
  | 'strategic-thinking'
  | 'business-growth'
  | 'career-craft'

export interface SubtopicDef {
  value: string
  label: string
  category: CategorySlug
}

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  'design-execution': 'Design Execution',
  'strategic-thinking': 'Strategic Thinking',
  'business-growth': 'Business & Growth',
  'career-craft': 'Career & Craft',
}

export const SUBTOPICS: SubtopicDef[] = [
  // Design Execution
  { value: 'design-systems', label: 'Design Systems', category: 'design-execution' },
  { value: 'design-handoff', label: 'Design Handoff', category: 'design-execution' },
  { value: 'prototyping', label: 'Prototyping', category: 'design-execution' },
  { value: 'documentation', label: 'Documentation', category: 'design-execution' },
  { value: 'visual-architecture', label: 'Visual Architecture', category: 'design-execution' },
  // Strategic Thinking
  { value: 'design-rationale', label: 'Design Rationale', category: 'strategic-thinking' },
  { value: 'stakeholder-management', label: 'Stakeholder Management', category: 'strategic-thinking' },
  { value: 'product-thinking', label: 'Product Thinking', category: 'strategic-thinking' },
  { value: 'user-research', label: 'User Research', category: 'strategic-thinking' },
  { value: 'design-ethics', label: 'Design Ethics', category: 'strategic-thinking' },
  // Business & Growth
  { value: 'product-analytics', label: 'Product Analytics', category: 'business-growth' },
  { value: 'conversion-optimization', label: 'Conversion Optimization', category: 'business-growth' },
  { value: 'seo-optimization', label: 'SEO Optimization', category: 'business-growth' },
  { value: 'growth-design', label: 'Growth Design', category: 'business-growth' },
  { value: 'marketing-strategy', label: 'Marketing & Strategy', category: 'business-growth' },
  // Career & Craft
  { value: 'career-strategy', label: 'Career Strategy', category: 'career-craft' },
  { value: 'portfolio-case-studies', label: 'Portfolio & Case Studies', category: 'career-craft' },
  { value: 'ai-assisted-workflow', label: 'AI-Assisted Workflow', category: 'career-craft' },
  { value: 'accessibility', label: 'Accessibility', category: 'career-craft' },
  { value: 'workflow-optimization', label: 'Workflow Optimization', category: 'career-craft' },
]

export const SUBTOPIC_TO_CATEGORY: Record<string, CategorySlug> = Object.fromEntries(
  SUBTOPICS.map((s) => [s.value, s.category])
) as Record<string, CategorySlug>

export function deriveCategory(subtopic: string | undefined): CategorySlug | undefined {
  if (!subtopic) return undefined
  return SUBTOPIC_TO_CATEGORY[subtopic]
}
