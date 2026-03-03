export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { amount } = req.body

  try {
    // 1️⃣ Get Access Token
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64')

    const tokenRes = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      }
    )

    const tokenData = await tokenRes.json()
    const accessToken = tokenData.access_token

    // 2️⃣ Create Order
    const orderRes = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'GBP',
                value: amount
              }
            }
          ],
          application_context: {
            return_url: `${req.headers.origin}/donation-success`,
            cancel_url: `${req.headers.origin}/donation-cancel`
          }
        })
      }
    )

    const orderData = await orderRes.json()

    const approvalLink = orderData.links.find(
      link => link.rel === 'approve'
    )

    return res.status(200).json({
      approvalUrl: approvalLink.href
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}