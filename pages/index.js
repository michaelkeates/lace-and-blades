import { useState, useEffect } from 'react'
import {
  Container,
  Heading,
  Box,
  chakra,
  Divider,
  Text,
  VStack,
  HStack,
  useColorModeValue
} from '@chakra-ui/react'
import Layout from '../components/layouts/main'
import Image from 'next/image'
import Bubble from '../components/emoji/default'
import TikTokButton from '../components/buttons/tiktok-button'
import LinkedinButton from '../components/buttons/instagram-button'
import LinktrButton from '../components/buttons/linktr-button'
import YoutubeButton from '../components/buttons/youtube-button'
import Section from '../components/section'
import Head from 'next/head'
import { getApolloClient } from '../lib/apollo'
import { gql } from '@apollo/client'
import { useRouter } from 'next/router'

// --- SINGLE SOURCE OF TRUTH ---
// Production Date: April 10, 2026 at 5:00 PM BST
const FINAL_TARGET = new Date('2026-04-10T17:00:00+01:00').getTime()

// Testing Date: (Toggle this to test specific times)
//const FINAL_TARGET = new Date('2026-04-01T23:00:00+01:00').getTime()

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const Home = () => {
  const router = useRouter()
  const [targetDate] = useState(FINAL_TARGET)

  // Immediate check to prevent the "flicker" when navigating back to Home
  const [isLive, setIsLive] = useState(() => {
    if (typeof window !== 'undefined') {
      return new Date().getTime() >= FINAL_TARGET
    }
    return false
  })

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const overlayBg = useColorModeValue(
    '#e988ec40',
    '#26192980'
  )

  useEffect(() => {
    // If we are already past the date, don't run the interval
    if (isLive) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance <= 0) {
        setIsLive(true)
        clearInterval(timer)
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.max(0, Math.floor((distance % (1000 * 60)) / 1000))
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, isLive])

  // --- 1. COUNTDOWN VIEW ---
  if (!isLive) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="fixed" // Set to fixed to cover the whole screen including Navbar
        inset={0}
        zIndex={2000} // High z-index so it sits ABOVE the navbar provided by _app.js
      >
        <Head>
          <title>Lace & Blades | Coming Soon</title>
        </Head>

        <Box
          position="fixed"
          inset={0}
          backgroundImage="url('/images/IMG-20260220-WA0017_2.jpg')"
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          zIndex={-2}
          opacity={0.2}
        />

        <Box
          position="fixed"
          inset={0}
          backdropFilter="blur(15px)"
          WebkitBackdropFilter="blur(15px)"
          background={overlayBg}
          zIndex={-1}
        />

        <Container maxWidth="2xl" textAlign="center" zIndex={1}>
          <VStack spacing={6}>
            <Heading
              as="h1"
              fontSize={{ base: '6xl', md: '9xl' }}
              fontFamily="CartaMarina"
              color="white"
              lineHeight="1"
            >
              Lace & Blades
            </Heading>
            <Divider />
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={4}
              mt={4}
            >
              <YoutubeButton />
              <TikTokButton />
              <LinkedinButton />
              <LinktrButton />
            </Box>
            <Divider paddingTop={4} />
            <Text
              fontSize="sm"
              letterSpacing="0.4em"
              textTransform="uppercase"
              fontWeight="bold"
              color="white"
              opacity={0.8}
              pb={4}
            >
              Live April 10, 2026 • 5:00 PM
            </Text>
            <HStack spacing={{ base: 6, md: 12 }}>
              <CountdownItem label="Days" value={timeLeft.days} />
              <CountdownItem label="Hours" value={timeLeft.hours} />
              <CountdownItem label="Mins" value={timeLeft.minutes} />
              <CountdownItem label="Secs" value={timeLeft.seconds} />
            </HStack>
          </VStack>
        </Container>
      </Box>
    )
  }

  // --- 2. ACTUAL HOME PAGE ---
  // FIX: We removed the <Layout> wrapper here because _app.js now provides it globally.
  // This prevents the navbar from "unmounting and remounting," which causes the drop.
  return (
    <Container maxWidth="2xl">
      <Section delay={0.2}>
        <Box display="flex" justifyContent="center" mt={10} mb={4}>
          <Box>
            <ProfileImage
              src="/images/IMG-20260220-WA0017_2.jpg"
              alt="Profile image"
              width="120"
              height="120"
              borderRadius="full"
            />
          </Box>
        </Box>

        <Heading
          as="h1"
          fontSize={{ base: '6xl', md: '7xl' }}
          fontFamily="CartaMarina"
          textAlign="center"
          paddingBottom={4}
        >
          Lace &Blades
        </Heading>

        <Box>
          <Bubble
            text={`Lace & Blades is about turning my lived experience into action and support. From survival to justice, this space shares support from multiple organisations, the impact of coercive control, and the fight to rebuild life after sexual assault and trauma. But this is more than storytelling. It is a call for change. Lace & Blades has taken on the challenges on the housing and safeguarding failures with the Government systems. Pushing for change. Because survival should never depend on employment status, location, or silence.`}
          />
        </Box>

        <Divider />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={4}
          mt={4}
        >
          <YoutubeButton />
          <TikTokButton />
          <LinkedinButton />
          <LinktrButton />
        </Box>
        <Divider paddingTop={4} />
        <Box
          position="relative"
          width={{ base: '90%', md: '650px' }}
          height={{ base: '200px', md: '260px' }}
          borderRadius="md"
          overflow="hidden"
          marginTop={5}
          marginBottom={5}
          mx="auto"
        >
          <Image
            src="/images/IMG-20260320-WA0004.jpg"
            alt="Lace and Blades book cover"
            fill
            style={{ objectFit: 'cover' }}
          />
        </Box>
        <Divider />
      </Section>
    </Container>
  )
}

const CountdownItem = ({ label, value }) => (
  <VStack spacing={0}>
    <Text
      fontSize={{ base: '4xl', md: '6xl' }}
      fontWeight="normal"
      fontFamily="Roboto Mono"
      color="white"
      lineHeight="1"
    >
      {String(value).padStart(2, '0')}
    </Text>
    <Text
      fontSize="xs"
      color="gray.300"
      textTransform="uppercase"
      letterSpacing="0.2em"
      mt={2}
    >
      {label}
    </Text>
  </VStack>
)

export default Home

export async function getServerSideProps({ req }) {
  const client = getApolloClient()
  try {
    await client.query({
      query: gql`
        query GetHealthCheck {
          generalSettings {
            title
          }
        }
      `
    })
    return { props: { isConnected: true, cookies: req.headers.cookie ?? '' } }
  } catch (error) {
    return { props: { isConnected: false, cookies: req.headers.cookie ?? '' } }
  }
}
