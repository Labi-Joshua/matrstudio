import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Matrstudio Operational Index'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          padding: '80px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '20px', fontWeight: 500, color: '#111111', letterSpacing: '-0.5px' }}>
            matrstudio
          </span>
          <span style={{ fontSize: '20px', color: '#DC5405' }}>.</span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 400,
              color: '#111111',
              lineHeight: 1.1,
              letterSpacing: '-2px',
            }}
          >
            A working manual for
            <br />
            the craft of design
            <span style={{ color: '#DC5405' }}>.</span>
          </div>
          <p style={{ fontSize: '20px', color: '#888888', margin: 0 }}>
            Curated tools, frameworks, and insights for designers who care about the craft.
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#AAAAAA', letterSpacing: '0.5px' }}>
            resources.matrstudio.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
