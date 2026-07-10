const DARAJA_BASE = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke'

async function getToken(): Promise<string> {
  const key    = process.env.MPESA_CONSUMER_KEY!
  const secret = process.env.MPESA_CONSUMER_SECRET!
  const res = await fetch(`${DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}` },
  })
  if (!res.ok) throw new Error(`Daraja token error: ${await res.text()}`)
  const { access_token } = await res.json()
  return access_token
}

export async function initiateSTKPush({
  phone,
  amountCents,
  orderRef,
  callbackUrl,
}: {
  phone: string
  amountCents: number
  orderRef: string
  callbackUrl: string
}) {
  const token     = await getToken()
  const shortcode = process.env.MPESA_SHORTCODE!
  const partyB    = process.env.MPESA_TILL_NUMBER ?? shortcode
  const passkey   = process.env.MPESA_PASSKEY!
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
  const password  = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
  const amountKES = Math.ceil(amountCents / 100)

  const res = await fetch(`${DARAJA_BASE}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password:          password,
      Timestamp:         timestamp,
      TransactionType:   process.env.MPESA_TRANSACTION_TYPE ?? 'CustomerPayBillOnline',
      Amount:            amountKES,
      PartyA:            phone,
      PartyB:            partyB,
      PhoneNumber:       phone,
      CallBackURL:       callbackUrl,
      AccountReference:  orderRef,
      TransactionDesc:   `65D ${orderRef}`,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('[65D M-Pesa STK failed]', res.status, text)
    throw new Error(`STK push failed: ${text}`)
  }

  return res.json() as Promise<{ CheckoutRequestID: string; MerchantRequestID: string }>
}
