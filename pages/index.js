import {
  Container,
  Heading,
  Box,
  useColorModeValue,
  chakra,
  Divider,
  Button
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Image from 'next/image'
import Bubble from '../components/emoji/default'
import TikTokButton from '../components/buttons/tiktok-button'
import LinkedinButton from '../components/buttons/instagram-button'
import LinktrButton from '../components/buttons/linktr-button'
import YoutubeButton from '../components/buttons/youtube-button'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const Home = () => (
  <Layout>
    <Container maxWidth="2xl">
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
        fontSize={{ base: '5xl', md: '6xl' }}
        fontFamily="CartaMarina"
        textAlign="center"
      >
        Lace &Blades
      </Heading>

      <Box>
        <Bubble
          text={`Lace & Blades is about turning my lived experience into action and support. From survival to justice, this space shares support from multiple organisations, the impact of coercive control, and the fight to rebuild life after sexual assault and trauma. But this is more than storytelling. It is a call for change. Lace & Blades has taken on the challenges on the housing and safeguarding failures with the Government systems. Pushing for change. Because survival should never depend on employment status, location, or silence.

Real Stories | Domestic Abuse | System Change`}
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
        display="flex"
        justifyContent="center"
        alignItems="center"
        paddingTop={4}
        paddingBottom={12}
      >
        <Image
          src="/images/IMG-20260320-WA0004.jpg"
          alt="Lace and Blades book cover"
          width={650}
          height={350}
          objectFit="cover"
          borderRadius="md"
        />
      </Box>
      <Divider />
    </Container>
  </Layout>
)

export default Home

export async function getServerSideProps({ req }) {
  return {
    props: {
      cookies: req.headers.cookie ?? ''
    }
  }
}
