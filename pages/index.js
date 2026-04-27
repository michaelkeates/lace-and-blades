import {
  Container,
  Heading,
  Box,
  chakra,
  Divider,
  VStack,
  useColorModeValue
} from '@chakra-ui/react'
import Image from 'next/image'
import Bubble from '../components/emoji/default'
import TikTokButton from '../components/buttons/tiktok-button'
import LinkedinButton from '../components/buttons/instagram-button'
import LinktrButton from '../components/buttons/linktr-button'
import YoutubeButton from '../components/buttons/youtube-button'
import Section from '../components/section'
import { getApolloClient } from '../lib/apollo'
import { gql } from '@apollo/client'
import Logo from '../components/heading'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const Home = () => {
  return (
    <Container maxWidth="2xl">
      <Section delay={0.2}>

        {/* Branding / Logo */}
        <Box display="flex" justifyContent="center" width="full" marginTop='5rem'>
          <Logo fontSize={{ base: '6xl', md: '7xl' }} />
        </Box>

        <Divider marginBottom={2} />

        {/* Profile Image Section */}
        {/* Featured Image / Book Cover */}
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

        {/* Headline */}
        <Box textAlign="center">
          <Heading
            as="h2"
            size="md"
            fontWeight="semibold"
            letterSpacing="tighter"
          >
            Domestic Abuse and Sexual Violence | Support, Awareness and Advocacy
          </Heading>
        </Box>

        <Divider marginBottom={4} marginTop={2} />

        {/* About / Mission Bubble */}
        <Box>
          <Bubble
            paddingTop={8}
            text={`Lace & Blades is about turning my lived experience into action and support. From survival to justice, this space shares support from multiple organisations, the impact of coercive control, and the fight to rebuild life after sexual assault and trauma. But this is more than storytelling. It is a call for change. Lace & Blades has taken on the challenges on the housing and safeguarding failures with the Government systems. Pushing for change. Because survival should never depend on employment status, location, or silence.`}
          />
        </Box>

        <Divider />

        {/* Social Buttons */}
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
      </Section>
    </Container>
  )
}

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