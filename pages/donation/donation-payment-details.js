// pages/donation/donation-payment-details.js
import { useEffect, useState, useRef } from 'react'
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  Checkbox,
  Button,
  useToast,
  useColorModeValue
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { loadPaypalScript } from '../../utils/loadPaypal.js'
import NextLink from 'next/link'

export default function DonationPaymentDetails() {
  const [donation, setDonation] = useState(null)
  const [agreed, setAgreed] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const paypalRef = useRef()
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  // 1️⃣ Load donation data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('donationData')
    if (!stored) {
      router.push('/donation-form')
      return
    }
    setDonation(JSON.parse(stored))
  }, [router])

  // 2️⃣ Load PayPal SDK and render buttons
  useEffect(() => {
    if (!donation || !agreed || !paypalRef.current) return

    // Clear previous buttons
    paypalRef.current.innerHTML = ''

    loadPaypalScript(PAYPAL_CLIENT_ID)
      .then(paypal => {
        setPaypalLoaded(true)

        paypal.Buttons({
          style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'paypal' },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: parseFloat(donation.amount).toFixed(2) },
                  description: `Donation by ${donation.anonymous ? 'Anonymous' : donation.firstName}`
                }
              ],
              payer: {
                email_address: donation.email,
                name: donation.anonymous
                  ? { given_name: 'Anonymous' }
                  : { given_name: donation.firstName, surname: donation.lastName }
              },
              application_context: {
                shipping_preference: 'NO_SHIPPING',
                locale: 'en-GB'
              }
            })
          },
          onApprove: async (data, actions) => {
            try {
              const details = await actions.order.capture()
              toast({
                title: 'Payment successful!',
                description: `Thank you, ${donation.anonymous ? 'Anonymous' : donation.firstName}!`,
                status: 'success',
                duration: 5000,
                isClosable: true
              })
              localStorage.removeItem('donationData')
              router.push('/')
            } catch (err) {
              console.error('Capture error:', err)
              toast({
                title: 'Payment error',
                description: 'The payment was authorized but not captured. Contact support.',
                status: 'error',
                duration: 5000
              })
            }
          },
          onError: err => {
            console.error('PayPal Buttons error:', err)
            toast({
              title: 'PayPal error',
              description: 'The transaction was declined or an error occurred.',
              status: 'error',
              duration: 5000
            })
          }
        }).render(paypalRef.current)
      })
      .catch(err => {
        console.error('PayPal SDK failed to load', err)
        toast({
          title: 'System error',
          description: 'Unable to load PayPal buttons.',
          status: 'error'
        })
      })

    return () => {
      if (paypalRef.current) paypalRef.current.innerHTML = ''
    }
  }, [donation, agreed, PAYPAL_CLIENT_ID, router, toast])

  if (!donation) return null

  // Optional manual fallback link for safety
  const paypalLink = donation
    ? `https://www.sandbox.paypal.com/donate/?hosted_button_id=LFJU7QWQ57DR8` +
      `&amount=${encodeURIComponent(donation.amount)}` +
      `&first_name=${donation.anonymous ? '' : encodeURIComponent(donation.firstName)}` +
      `&last_name=${donation.anonymous ? '' : encodeURIComponent(donation.lastName)}` +
      `&email=${encodeURIComponent(donation.email)}`
    : ''

  return (
    <Container maxW="800px" py={12}>
      <VStack spacing={8} align="stretch">
        <Heading>Confirm Your Donation</Heading>

        <Box
          p={6}
          borderRadius="xl"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
        >
          <VStack align="start" spacing={3}>
            <Text><strong>Amount:</strong> £{parseFloat(donation.amount).toFixed(2)}</Text>
            <Text><strong>Name:</strong> {donation.anonymous ? 'Anonymous' : `${donation.firstName} ${donation.lastName}`}</Text>
            <Text><strong>Email:</strong> {donation.email}</Text>
          </VStack>
        </Box>

        <Checkbox isChecked={agreed} onChange={e => setAgreed(e.target.checked)}>
          I agree to the Terms & Conditions and Privacy Policy
        </Checkbox>

        {/* PayPal SDK buttons */}
        <Box
          ref={paypalRef}
          p={2}
          borderRadius="xl"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
          minH={agreed ? '150px' : '0px'}
        />

        {/* Manual fallback button */}
        {paypalLink && (
          <NextLink href={paypalLink} passHref>
            <Button
              as="a"
              bg={useColorModeValue('yellow.300', 'yellow.300')}
              color="black"
              opacity={0.8}
            >
              Donate via PayPal (fallback)
            </Button>
          </NextLink>
        )}
      </VStack>
    </Container>
  )
}