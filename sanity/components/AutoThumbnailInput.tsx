import { useEffect, useState } from 'react'
import { set, unset } from 'sanity'
import type { StringInputProps } from 'sanity'
import { useFormValue } from 'sanity'

const SITE_URL = 'https://matrstudio.vercel.app'

export function AutoThumbnailInput(props: StringInputProps) {
  const externalUrl = useFormValue(['externalUrl']) as string | undefined
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  useEffect(() => {
    if (!externalUrl) return
    setStatus('loading')
    fetch(`${SITE_URL}/api/og-image?url=${encodeURIComponent(externalUrl)}`)
      .then((r) => r.json())
      .then(({ image }) => {
        if (image) {
          props.onChange(set(image))
          setStatus('done')
        } else {
          setStatus('error')
        }
      })
      .catch(() => setStatus('error'))
  }, [externalUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        padding: '10px 14px',
        background: '#f3f3f3',
        borderRadius: 6,
        fontSize: 13,
        color: status === 'done' ? '#333' : status === 'error' ? '#c00' : '#999',
        border: '1px solid #e5e5e5',
      }}>
        {status === 'idle' && 'Auto-fetched when External URL is set'}
        {status === 'loading' && 'Fetching thumbnail…'}
        {status === 'done' && `✓ ${props.value}`}
        {status === 'error' && 'Could not fetch thumbnail — add manually if needed'}
      </div>
      {props.value && (
        <img
          src={props.value}
          alt="Thumbnail preview"
          style={{ maxWidth: 240, borderRadius: 6, border: '1px solid #e5e5e5' }}
        />
      )}
      {props.value && (
        <button
          type="button"
          onClick={() => { props.onChange(unset()); setStatus('idle') }}
          style={{ alignSelf: 'flex-start', fontSize: 12, color: '#c00', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          Clear
        </button>
      )}
    </div>
  )
}
