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
import { loadPaypalScript } from '../utils/loadPaypal'

export default function DonationPaymentDetails() {
  const [donation, setDonation] = useState(null)
  const [agreed, setAgreed] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const paypalRef = useRef()

  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  // Load donation data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('donationData')
    if (!stored) {
      router.push('/donation-form')
      return
    }
    setDonation(JSON.parse(stored))
  }, [])

  // Load PayPal script and render buttons
  useEffect(() => {
    if (!donation || !agreed) return

    loadPaypalScript(PAYPAL_CLIENT_ID)
      .then(paypal => {
        setPaypalLoaded(true)

        paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: donation.amount.toString() }
                }
              ],
              payer: {
                email_address: donation.email,
                name: donation.anonymous
                  ? { given_name: 'Anonymous' }
                  : { given_name: donation.firstName, surname: donation.lastName },
                address: {
                  country_code: 'GB' // Default to UK
                }
              },
              application_context: {
                shipping_preference: 'NO_SHIPPING', // Optional
                locale: 'en-GB' // UK locale
              }
            })
          },
          onApprove: async (data, actions) => {
            const details = await actions.order.capture()
            console.log('Payment Success:', details)

            toast({
              title: 'Payment successful!',
              description: `Thank you, ${donation.anonymous ? 'Anonymous' : donation.firstName}!`,
              status: 'success',
              duration: 5000,
              isClosable: true
            })

            localStorage.removeItem('donationData')
            router.push('/')
          },
          onError: err => {
            console.error(err)
            toast({
              title: 'Payment error',
              description: 'Something went wrong with PayPal.',
              status: 'error',
              duration: 5000,
              isClosable: true
            })
          }
        }).render(paypalRef.current)

        // Curve the PayPal iframe corners
        const interval = setInterval(() => {
          const iframe = paypalRef.current.querySelector('iframe')
          if (iframe) {
            iframe.style.borderRadius = '16px' // Chakra xl rounding
            iframe.style.overflow = 'hidden'
            clearInterval(interval)
          }
        }, 100)
      })
      .catch(err => {
        console.error('PayPal SDK failed to load', err)
        toast({
          title: 'PayPal error',
          description: 'Unable to load PayPal buttons',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      })
  }, [donation, agreed])

  if (!donation) return null

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
            <Text><strong>Amount:</strong> £{donation.amount}</Text>
            <Text>
              <strong>Name:</strong>{' '}
              {donation.anonymous
                ? 'Anonymous'
                : `${donation.firstName} ${donation.lastName}`}
            </Text>
            <Text><strong>Email:</strong> {donation.email}</Text>
          </VStack>
        </Box>

        <Checkbox
          isChecked={agreed}
          onChange={e => setAgreed(e.target.checked)}
        >
          I agree to the Terms & Conditions and Privacy Policy
        </Checkbox>

        {!paypalLoaded && (
          <Button
            size="lg"
            isDisabled={!agreed}
            onClick={() => toast({ title: 'Agree to terms first' })}
            bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
          >
            Proceed to Payment
          </Button>
        )}

        {/* PayPal container */}
        <Box
          ref={paypalRef}
          p={2}
          borderRadius="xl"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
          overflow="hidden"
        />
      </VStack>
    </Container>
  )
}