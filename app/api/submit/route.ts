import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const NOTIFY_EMAIL = 'dashcoalition@gmail.com'
const LOGO_URL = 'https://resources.matrstudio.com/matr-logo.png'
const ICON_URL = 'https://resources.matrstudio.com/matr-icon.png'
const BASE_URL = 'https://resources.matrstudio.com'

const emailHeader = `
  <div style="text-align: center; padding: 32px 24px 24px; border-bottom: 1px solid #f0f0f0; margin-bottom: 32px;">
    <a href="${BASE_URL}" style="display: inline-block;">
      <img src="${LOGO_URL}" alt="Matr Studio" width="160" style="display: block; margin: 0 auto;" />
    </a>
  </div>
`

const emailFooter = `
  <div style="text-align: center; padding-top: 32px; border-top: 1px solid #f0f0f0; margin-top: 32px;">
    <img src="${ICON_URL}" alt="Matr Studio" width="28" height="28" style="display: block; margin: 0 auto 10px; border-radius: 6px; opacity: 0.5;" />
    <p style="font-size: 12px; color: #bbb; margin: 0;">
      <a href="${BASE_URL}" style="color: #bbb; text-decoration: none;">resources.matrstudio.com</a>
    </p>
  </div>
`

export async function POST(req: Request) {
  const { title, url, topic, creator, email, rationale } = await req.json()

  if (!title || !url || !topic || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    await Promise.all([
      // Confirmation to submitter
      resend.emails.send({
        from: 'Matr Studio <noreply@matrstudio.com>',
        to: email,
        subject: `We received your submission — ${title}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a; background: #ffffff;">
            ${emailHeader}
            <p style="font-size: 26px; font-weight: 400; line-height: 1.3; margin: 0 0 16px;">
              Thanks for submitting to Matr Studio.
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 0 0 32px;">
              We've received your submission for <strong style="color: #1a1a1a;">${title}</strong> and
              we'll review it shortly. If it makes the cut, we'll credit you and add it to the index.
            </p>
            <div style="border: 1px solid #e5e5e5; border-radius: 10px; padding: 20px 24px; margin-bottom: 32px;">
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #999; margin: 0 0 12px;">Submission details</p>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 6px 0; color: #999; width: 120px;">Resource</td><td style="padding: 6px 0; color: #1a1a1a;">${title}</td></tr>
                <tr><td style="padding: 6px 0; color: #999;">URL</td><td style="padding: 6px 0;"><a href="${url}" style="color: #DC5405; text-decoration: none;">${url}</a></td></tr>
                <tr><td style="padding: 6px 0; color: #999;">Topic</td><td style="padding: 6px 0; color: #1a1a1a;">${topic}</td></tr>
                ${creator ? `<tr><td style="padding: 6px 0; color: #999;">Creator</td><td style="padding: 6px 0; color: #1a1a1a;">${creator}</td></tr>` : ''}
                ${rationale ? `<tr><td style="padding: 6px 0; color: #999; vertical-align: top;">Rationale</td><td style="padding: 6px 0; color: #1a1a1a;">${rationale}</td></tr>` : ''}
              </table>
            </div>
            ${emailFooter}
          </div>
        `,
      }),

      // Notification to admin
      resend.emails.send({
        from: 'Matr Studio <noreply@matrstudio.com>',
        to: NOTIFY_EMAIL,
        subject: `New submission: ${title}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a; background: #ffffff;">
            ${emailHeader}
            <p style="font-size: 22px; font-weight: 400; margin: 0 0 24px;">New resource submitted for review.</p>
            <div style="border: 1px solid #e5e5e5; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 6px 0; color: #999; width: 120px;">Title</td><td style="padding: 6px 0; color: #1a1a1a;"><strong>${title}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #999;">URL</td><td style="padding: 6px 0;"><a href="${url}" style="color: #DC5405; text-decoration: none;">${url}</a></td></tr>
                <tr><td style="padding: 6px 0; color: #999;">Topic</td><td style="padding: 6px 0; color: #1a1a1a;">${topic}</td></tr>
                ${creator ? `<tr><td style="padding: 6px 0; color: #999;">Creator</td><td style="padding: 6px 0; color: #1a1a1a;">${creator}</td></tr>` : ''}
                <tr><td style="padding: 6px 0; color: #999;">Submitted by</td><td style="padding: 6px 0; color: #1a1a1a;">${email}</td></tr>
                ${rationale ? `<tr><td style="padding: 6px 0; color: #999; vertical-align: top;">Rationale</td><td style="padding: 6px 0; color: #1a1a1a;">${rationale}</td></tr>` : ''}
              </table>
            </div>
            ${emailFooter}
          </div>
        `,
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
