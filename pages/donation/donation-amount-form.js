// pages/donation-form.js
import { useState } from 'react'
import { getApolloClient } from '../../lib/wordpress'
import {
  Container,
  Box,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Stack,
  useToast,
  useColorModeValue
} from '@chakra-ui/react'
import styles from '../../styles/Home.module.css'
import Section from '../../components/section'
import { GET_DONATION_FORM_PAGE } from '../../lib/queries'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export default function DonationForm({ page }) {
  const toast = useToast()
  const router = useRouter()
  const [amount, setAmount] = useState('10')
  const [customAmount, setCustomAmount] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [anonymous, setAnonymous] = useState(false)

  if (!page) return <p>Page not found</p>

  const finalAmount = amount === 'custom' ? customAmount : amount

const handleSubmit = async () => {
  if (!finalAmount || !email) {
    toast({
      title: 'Please complete required fields',
      status: 'error',
      duration: 3000,
      isClosable: true
    })
    return
  }

  const donationData = {
    amount: finalAmount,
    firstName,
    lastName,
    email,
    anonymous
  }

  localStorage.setItem('donationData', JSON.stringify(donationData))

  router.push('/donation/donation-payment-details')
}

  return (
    <layout>
      <Container>
        <Section delay={0.1}>
          <main className={styles.main}>
            <VStack spacing={8} align="stretch">
              <Box textAlign="center">
                <Heading mb={4}>{page.title}</Heading>
                {page.featuredImage && (
                  <Image
                    src={page.featuredImage.node.sourceUrl}
                    alt={page.title}
                    mx="auto"
                    borderRadius="lg"
                  />
                )}
              </Box>

              {/* Donation Amount */}
              <Box
                p={6}
                borderRadius="xl"
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              >
                <Heading size="md" mb={4}>
                  Select Donation Amount
                </Heading>

                <RadioGroup value={amount} onChange={setAmount}>
                  <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                    {['10', '25', '50', '100'].map(value => (
                      <Radio key={value} value={value}>
                        £{value}
                      </Radio>
                    ))}
                    <Radio value="custom">Custom</Radio>
                  </Stack>
                </RadioGroup>

                {amount === 'custom' && (
                  <Input
                    mt={4}
                    placeholder="Enter custom amount"
                    type="number"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                  />
                )}
              </Box>

              {/* Personal Details */}
              <Box
                p={6}
                borderRadius="xl"
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              >
                <Heading size="md" mb={4}>
                  Your Details
                </Heading>

                <VStack spacing={4}>
                  <HStack w="100%">
                    <FormControl>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        borderColor={useColorModeValue(
                          'whiteAlpha.500',
                          'whiteAlpha.200'
                        )}
                        _hover={{
                          borderColor: useColorModeValue(
                            'whiteAlpha.500',
                            'whiteAlpha.200'
                          )
                        }}
                        _focus={{
                          borderColor: useColorModeValue(
                            'whiteAlpha.500',
                            'whiteAlpha.200'
                          )
                        }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        borderColor={useColorModeValue(
                          'whiteAlpha.500',
                          'whiteAlpha.200'
                        )}
                        _hover={{
                          borderColor: useColorModeValue(
                            'whiteAlpha.500',
                            'whiteAlpha.200'
                          )
                        }}
                        _focus={{
                          borderColor: useColorModeValue(
                            'whiteAlpha.500',
                            'whiteAlpha.200'
                          )
                        }}
                      />
                    </FormControl>
                  </HStack>

                  <FormControl isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      borderColor={useColorModeValue(
                        'whiteAlpha.500',
                        'whiteAlpha.200'
                      )}
                      _hover={{
                        borderColor: useColorModeValue(
                          'whiteAlpha.500',
                          'whiteAlpha.200'
                        )
                      }}
                      _focus={{
                        borderColor: useColorModeValue(
                          'whiteAlpha.500',
                          'whiteAlpha.200'
                        )
                      }}
                    />
                  </FormControl>

                  <Checkbox
                    isChecked={anonymous}
                    onChange={e => setAnonymous(e.target.checked)}
                    borderColor={useColorModeValue(
                      'whiteAlpha.500',
                      'whiteAlpha.200'
                    )}
                  >
                    I would like my donation to be anonymous
                  </Checkbox>
                </VStack>
              </Box>

              {/* Submit */}
<Button
  size="lg"
  onClick={handleSubmit}
>
  Donate £{finalAmount || '0'}
</Button>
            </VStack>
          </main>
        </Section>
      </Container>
    </layout>
  )
}

export async function getServerSideProps() {
  const apolloClient = getApolloClient()
  const { data } = await apolloClient.query({
    query: GET_DONATION_FORM_PAGE,
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      page: data?.pageBy ?? null
    }
  }
}
