import { useEffect } from 'react'
import { set } from 'sanity'
import type { StringInputProps } from 'sanity'
import { useFormValue } from 'sanity'

const SUBTOPIC_TO_CATEGORY: Record<string, string> = {
  // Design Execution
  'design-systems':      'design-execution',
  'design-handoff':      'design-execution',
  'prototyping':         'design-execution',
  'documentation':       'design-execution',
  'visual-architecture': 'design-execution',
  // Strategic Thinking
  'design-rationale':       'strategic-thinking',
  'stakeholder-management': 'strategic-thinking',
  'product-thinking':       'strategic-thinking',
  'user-research':          'strategic-thinking',
  'design-ethics':          'strategic-thinking',
  // Business & Growth
  'product-analytics':       'business-growth',
  'conversion-optimization': 'business-growth',
  'seo-optimization':        'business-growth',
  'growth-design':           'business-growth',
  'marketing-strategy':      'business-growth',
  // Career & Craft
  'career-strategy':        'career-craft',
  'portfolio-case-studies': 'career-craft',
  'ai-assisted-workflow':   'career-craft',
  'accessibility':          'career-craft',
  'workflow-optimization':  'career-craft',
}

const CATEGORY_LABELS: Record<string, string> = {
  'design-execution':  'Design Execution',
  'strategic-thinking': 'Strategic Thinking',
  'business-growth':   'Business & Growth',
  'career-craft':      'Career & Craft',
}

export function DerivedCategoryInput(props: StringInputProps) {
  const subtopic = useFormValue(['subtopic']) as string | undefined
  const derived = subtopic ? SUBTOPIC_TO_CATEGORY[subtopic] : undefined

  useEffect(() => {
    if (derived && derived !== props.value) {
      props.onChange(set(derived))
    }
  }, [derived]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      padding: '10px 14px',
      background: '#f3f3f3',
      borderRadius: '6px',
      fontSize: '13px',
      color: derived ? '#333' : '#999',
      border: '1px solid #e5e5e5',
    }}>
      {derived ? `✓ ${CATEGORY_LABELS[derived]}` : 'Auto-assigned when a subtopic is selected'}
    </div>
  )
}
