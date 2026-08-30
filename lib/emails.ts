import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const LOGO_URL = 'https://resources.matrstudio.com/matr-logo.png'
const ICON_URL = 'https://resources.matrstudio.com/matr-icon.png'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://resources.matrstudio.com'

function shell(bodyHtml: string): string {
  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a; background: #ffffff;">
      <div style="text-align: center; padding: 32px 24px 24px; border-bottom: 1px solid #f0f0f0; margin-bottom: 32px;">
        <a href="${BASE_URL}" style="display: inline-block;">
          <img src="${LOGO_URL}" alt="Matr Studio" width="160" style="display: block; margin: 0 auto;" />
        </a>
      </div>
      ${bodyHtml}
      <div style="text-align: center; padding-top: 32px; border-top: 1px solid #f0f0f0; margin-top: 32px;">
        <img src="${ICON_URL}" alt="Matr Studio" width="28" height="28" style="display: block; margin: 0 auto 10px; border-radius: 6px; opacity: 0.5;" />
        <p style="font-size: 12px; color: #bbb; margin: 0;">
          <a href="${BASE_URL}" style="color: #bbb; text-decoration: none;">resources.matrstudio.com</a>
        </p>
      </div>
    </div>
  `
}

function button(href: string, label: string): string {
  return `
    <div style="text-align: center; margin-bottom: 8px;">
      <a href="${href}" style="display: inline-block; background: #DC5405; color: #ffffff; text-decoration: none; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 999px;">${label}</a>
    </div>
  `
}

export async function sendInviteEmail(email: string, token: string): Promise<void> {
  const link = `${BASE_URL}/admin/setup?token=${encodeURIComponent(token)}`
  await resend.emails.send({
    from: 'Matr Studio <noreply@matrstudio.com>',
    to: email,
    subject: "You've been invited to Matr Studio Admin",
    html: shell(`
      <p style="font-size: 26px; font-weight: 400; line-height: 1.3; margin: 0 0 16px;">You're invited.</p>
      <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 0 0 32px;">
        You've been added as an admin on Matr Studio's resource index. Set up your account to get started.
      </p>
      ${button(link, 'Set up your account')}
      <p style="font-size: 12px; color: #999; text-align: center; margin: 16px 0 0;">This link expires in 7 days.</p>
    `),
  })
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const link = `${BASE_URL}/admin/reset-password?token=${encodeURIComponent(token)}`
  await resend.emails.send({
    from: 'Matr Studio <noreply@matrstudio.com>',
    to: email,
    subject: 'Reset your Matr Studio Admin password',
    html: shell(`
      <p style="font-size: 26px; font-weight: 400; line-height: 1.3; margin: 0 0 16px;">Reset your password.</p>
      <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 0 0 32px;">
        We received a request to reset the password for this account. If this wasn't you, you can safely ignore this email.
      </p>
      ${button(link, 'Reset password')}
      <p style="font-size: 12px; color: #999; text-align: center; margin: 16px 0 0;">This link expires in 1 hour.</p>
    `),
  })
}
