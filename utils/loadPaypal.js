// utils/loadPaypal.js
export const loadPaypalScript = (clientId, currency = 'GBP') => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('paypal-sdk')) {
      resolve(window.paypal)
      return
    }

    const script = document.createElement('script')
    script.id = 'paypal-sdk'
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`
    script.onload = () => resolve(window.paypal)
    script.onerror = reject
    document.body.appendChild(script)
  })
}