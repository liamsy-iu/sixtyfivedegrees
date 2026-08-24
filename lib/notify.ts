import { formatKES } from '@/lib/utils/pricing'

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

async function sendEmail(payload: {
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
}) {
  const apiKey = process.env.BREVO_API_KEY
  const from   = process.env.BREVO_FROM ?? 'hello@sixtyfivedegrees.com'

  if (!apiKey) {
    console.log('[Email] BREVO_API_KEY not set — skipping')
    return
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key':     apiKey,
        'Content-Type': 'application/json',
        'Accept':       'application/json',
      },
      body: JSON.stringify({
        sender:      { name: '65 Degrees Coffee', email: from },
        to:          payload.to,
        subject:     payload.subject,
        htmlContent: payload.htmlContent,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[Email] Brevo error:', res.status, err)
    } else {
      console.log('[Email] Sent:', payload.subject)
    }
  } catch (err) {
    console.error('[Email] Failed:', err)
  }
}

/* ── New order notification (to you) ───────────────────────────── */

interface OrderItem {
  product_name: string
  size: string
  grind: string
  quantity: number
  subtotal: number
}

export async function notifyNewOrder(params: {
  orderRef: string
  customerName: string
  customerPhone: string
  items: OrderItem[]
  deliveryAddress: { line1: string; area: string; city: string }
  total: number
  paymentMethod: 'mpesa' | 'cod'
  mpesaReceipt?: string
}) {
  const from = process.env.BREVO_FROM ?? 'hello@sixtyfivedegrees.com'

  const itemRows = params.items.map(i => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e8e0d0;font-size:14px;color:#1A1410;">
        ${i.product_name}<br/>
        <span style="color:#8B6F4E;font-size:12px;">${i.size} · ${i.grind === 'whole_bean' ? 'Whole bean' : 'Ground'} · ×${i.quantity}</span>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #e8e0d0;text-align:right;font-size:14px;font-family:monospace;color:#1A1410;">
        ${formatKES(i.subtotal)}
      </td>
    </tr>
  `).join('')

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;">
      <div style="background:#1A1410;padding:24px 32px;">
        <p style="margin:0;font-family:monospace;font-size:11px;letter-spacing:0.2em;color:#C8922A;text-transform:uppercase;">
          🛒 New order — 65 Degrees Coffee
        </p>
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #e8e0d0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;width:120px;">Order ref</td><td style="padding:6px 0;font-size:14px;font-family:monospace;font-weight:bold;">${params.orderRef}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Customer</td><td style="padding:6px 0;font-size:14px;">${params.customerName}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Phone</td><td style="padding:6px 0;font-size:14px;">${params.customerPhone}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Delivery</td><td style="padding:6px 0;font-size:14px;">${params.deliveryAddress.line1}, ${params.deliveryAddress.area}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Payment</td><td style="padding:6px 0;font-size:14px;">${params.paymentMethod === 'mpesa' ? `M-Pesa${params.mpesaReceipt ? ` · ${params.mpesaReceipt}` : ''}` : 'Cash on delivery'}</td></tr>
        </table>

        <div style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e8e0d0;">
          <p style="margin:0 0 12px;font-size:11px;font-family:monospace;letter-spacing:0.14em;text-transform:uppercase;color:#8B6F4E;">Items</p>
          <table style="width:100%;border-collapse:collapse;">
            ${itemRows}
            <tr>
              <td style="padding:12px 0 0;font-size:15px;font-weight:bold;color:#1A1410;">Total</td>
              <td style="padding:12px 0 0;text-align:right;font-size:15px;font-weight:bold;font-family:monospace;color:#1A1410;">${formatKES(params.total)}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top:24px;padding:12px 16px;background:#f0fdf4;border-left:3px solid #2D5A3D;">
          <a href="https://www.sixtyfivedegrees.com/admin" style="font-size:13px;color:#2D5A3D;text-decoration:none;font-weight:bold;">
            → View in admin panel
          </a>
        </div>
      </div>
    </div>
  `

  await sendEmail({
    to: [{ email: from, name: '65 Degrees Coffee' }],
    subject: `New order ${params.orderRef} — ${formatKES(params.total)} · ${params.paymentMethod === 'mpesa' ? 'M-Pesa' : 'COD'}`,
    htmlContent: html,
  })
}

/* ── New trade enquiry notification (to you) ───────────────────── */

export async function notifyNewEnquiry(params: {
  name: string
  business?: string
  email: string
  phone: string
  grade?: string
  volume?: string
  message?: string
}) {
  const from = process.env.BREVO_FROM ?? 'hello@sixtyfivedegrees.com'

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;">
      <div style="background:#1A1410;padding:24px 32px;">
        <p style="margin:0;font-family:monospace;font-size:11px;letter-spacing:0.2em;color:#C8922A;text-transform:uppercase;">
          📋 New trade enquiry — 65 Degrees Coffee
        </p>
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #e8e0d0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;width:120px;">Name</td><td style="padding:6px 0;font-size:14px;">${params.name}</td></tr>
          ${params.business ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Business</td><td style="padding:6px 0;font-size:14px;">${params.business}</td></tr>` : ''}
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Email</td><td style="padding:6px 0;font-size:14px;"><a href="mailto:${params.email}" style="color:#C8922A;">${params.email}</a></td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Phone</td><td style="padding:6px 0;font-size:14px;"><a href="tel:${params.phone}" style="color:#C8922A;">${params.phone}</a></td></tr>
          ${params.grade ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Grade</td><td style="padding:6px 0;font-size:14px;">${params.grade}</td></tr>` : ''}
          ${params.volume ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Volume</td><td style="padding:6px 0;font-size:14px;">${params.volume}</td></tr>` : ''}
          ${params.message ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;vertical-align:top;">Message</td><td style="padding:6px 0;font-size:14px;line-height:1.6;">${params.message}</td></tr>` : ''}
        </table>

        <div style="margin-top:24px;padding:12px 16px;background:#f0fdf4;border-left:3px solid #2D5A3D;">
          <a href="https://www.sixtyfivedegrees.com/admin" style="font-size:13px;color:#2D5A3D;text-decoration:none;font-weight:bold;">
            → View in admin panel
          </a>
        </div>
      </div>
    </div>
  `

  await sendEmail({
    to: [{ email: from, name: '65 Degrees Coffee' }],
    subject: `New trade enquiry from ${params.name}${params.business ? ` · ${params.business}` : ''}`,
    htmlContent: html,
  })
}

/* ── New merch order notification (to you) ─────────────────────────── */

export async function notifyMerchOrder(params: {
  name: string
  email: string
  phone: string
  colour: string
  size: string
  quantity: string
  address?: string
  message?: string
  total_kes?: number
  orderRef?: string
  mpesaReceipt?: string
}) {
  const from = process.env.BREVO_FROM ?? 'hello@sixtyfivedegrees.com'

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;">
      <div style="background:#1A1410;padding:24px 32px;">
        <p style="margin:0;font-family:monospace;font-size:11px;letter-spacing:0.2em;color:#C8922A;text-transform:uppercase;">
          🧥 New merch order — 65 Degrees Coffee
        </p>
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #e8e0d0;">
        <table style="width:100%;border-collapse:collapse;">
          ${params.orderRef ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;width:120px;">Order ref</td><td style="padding:6px 0;font-size:14px;font-weight:bold;">${params.orderRef}</td></tr>` : ''}
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;width:120px;">Name</td><td style="padding:6px 0;font-size:14px;">${params.name}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Email</td><td style="padding:6px 0;font-size:14px;"><a href="mailto:${params.email}" style="color:#C8922A;">${params.email}</a></td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Phone</td><td style="padding:6px 0;font-size:14px;"><a href="tel:${params.phone}" style="color:#C8922A;">${params.phone}</a></td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Colour</td><td style="padding:6px 0;font-size:14px;">${params.colour}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Size</td><td style="padding:6px 0;font-size:14px;">${params.size}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Quantity</td><td style="padding:6px 0;font-size:14px;">${params.quantity}</td></tr>
          ${params.total_kes ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Total</td><td style="padding:6px 0;font-size:14px;font-weight:bold;">KES ${params.total_kes.toLocaleString('en-KE')}</td></tr>` : ''}
          ${params.mpesaReceipt ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">M-Pesa receipt</td><td style="padding:6px 0;font-size:14px;font-weight:bold;color:#2D5A3D;">${params.mpesaReceipt} — PAID</td></tr>` : `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Payment</td><td style="padding:6px 0;font-size:14px;">Pay on delivery</td></tr>`}
          ${params.address ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;vertical-align:top;">Delivery to</td><td style="padding:6px 0;font-size:14px;line-height:1.6;">${params.address}</td></tr>` : ''}
          ${params.message ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;vertical-align:top;">Message</td><td style="padding:6px 0;font-size:14px;line-height:1.6;">${params.message}</td></tr>` : ''}
        </table>

        <div style="margin-top:24px;padding:12px 16px;background:#f0fdf4;border-left:3px solid #2D5A3D;">
          <a href="https://www.sixtyfivedegrees.com/admin" style="font-size:13px;color:#2D5A3D;text-decoration:none;font-weight:bold;">
            → View in admin panel
          </a>
        </div>
      </div>
    </div>
  `

  await sendEmail({
    to: [{ email: from, name: '65 Degrees Coffee' }],
    subject: `New merch order${params.orderRef ? ` ${params.orderRef}` : ''} from ${params.name} — ${params.colour}, ${params.size}${params.total_kes ? ` — KES ${params.total_kes.toLocaleString('en-KE')}` : ''}`,
    htmlContent: html,
  })
}

/* ── New green coffee export enquiry notification (to you) ────────── */

export async function notifyExportEnquiry(params: {
  name: string
  company: string
  country: string
  email: string
  phone?: string
  product?: string
  volume?: string
  message?: string
}) {
  const from = process.env.BREVO_FROM ?? 'hello@sixtyfivedegrees.com'

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;">
      <div style="background:#1A1410;padding:24px 32px;">
        <p style="margin:0;font-family:monospace;font-size:11px;letter-spacing:0.2em;color:#C8922A;text-transform:uppercase;">
          🌍 New green coffee export enquiry — 65 Degrees Coffee
        </p>
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #e8e0d0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;width:120px;">Name</td><td style="padding:6px 0;font-size:14px;">${params.name}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Company</td><td style="padding:6px 0;font-size:14px;">${params.company}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Country</td><td style="padding:6px 0;font-size:14px;">${params.country}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Email</td><td style="padding:6px 0;font-size:14px;"><a href="mailto:${params.email}" style="color:#C8922A;">${params.email}</a></td></tr>
          ${params.phone ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Phone</td><td style="padding:6px 0;font-size:14px;"><a href="tel:${params.phone}" style="color:#C8922A;">${params.phone}</a></td></tr>` : ''}
          ${params.product ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Product interest</td><td style="padding:6px 0;font-size:14px;">${params.product}</td></tr>` : ''}
          ${params.volume ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;">Volume</td><td style="padding:6px 0;font-size:14px;">${params.volume}</td></tr>` : ''}
          ${params.message ? `<tr><td style="padding:6px 0;font-size:13px;color:#8B6F4E;vertical-align:top;">Message</td><td style="padding:6px 0;font-size:14px;line-height:1.6;">${params.message}</td></tr>` : ''}
        </table>

        <div style="margin-top:24px;padding:12px 16px;background:#f0fdf4;border-left:3px solid #2D5A3D;">
          <a href="https://www.sixtyfivedegrees.com/admin" style="font-size:13px;color:#2D5A3D;text-decoration:none;font-weight:bold;">
            → View in admin panel
          </a>
        </div>
      </div>
    </div>
  `

  await sendEmail({
    to: [{ email: from, name: '65 Degrees Coffee' }],
    subject: `New export enquiry from ${params.company} (${params.country})`,
    htmlContent: html,
  })
}
