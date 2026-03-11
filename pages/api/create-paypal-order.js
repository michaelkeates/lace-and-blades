export default async function handler(req, res) {
  // 1. Safety check for request method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { amount } = req.body

  // 2. Validate amount before calling PayPal
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid amount provided' })
  }

  try {
    // 3. Get Access Token from PayPal
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

    if (!tokenData.access_token) {
      console.error('Failed to obtain PayPal access token:', tokenData)
      return res.status(500).json({ error: 'Authentication with PayPal failed' })
    }

    const accessToken = tokenData.access_token

    // 4. Create the Order
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
                value: amount // Should be a string like "10.00"
              }
            }
          ],
          application_context: {
            // CRITICAL: This bypasses physical shipping regulations for donations
            shipping_preference: 'NO_SHIPPING', 
            user_action: 'PAY_NOW',
            brand_name: 'Lace and Blades'
          }
        })
      }
    )

    const orderData = await orderRes.json()

    // 5. Handle PayPal API errors
    if (!orderRes.ok) {
      console.error('PayPal Order Creation Error:', orderData)
      return res.status(orderRes.status).json({
        error: 'PayPal refused to create the order',
        details: orderData
      })
    }

    // 6. Return only the ID to the frontend
    // The Frontend SDK expects just this ID to initiate the popup
    return res.status(200).json({
      id: orderData.id
    })

  } catch (error) {
    console.error('Internal Server Error in PayPal API:', error)
    return res.status(500).json({ error: 'Something went wrong on the server' })
  }
}