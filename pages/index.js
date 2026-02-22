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
import LinkedinButton from '../components/buttons/linkedin-button'
import LinktrButton from '../components/buttons/linktr-button'
import NextLink from 'next/link'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const Home = () => (
  <Layout>
    <Container>
      <Box display="flex" justifyContent="center" mt={10} mb={4}>
        <Box>
          <ProfileImage
            src="/images/Lace-Blades-small.jpeg"
            alt="Profile image"
            width="120"
            height="120"
            borderRadius="full"
          />
        </Box>
      </Box>

      <Heading
        as="h1"
        textAlign="center"
        variant="page-title"
        mb={8}
        fontSize={58}
      >
        Lace & Blades
      </Heading>

      <Box>
        <Bubble text="I wrote Lace and Blades to give voice to experiences that are often hidden behind closed doors - where love, fear, and control become dangerously intertwined." />
      </Box>

      <Divider />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={4}
        mt={4}
      >
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
          src="https://laceandblades.michaelkeates.co.uk/wp-content/uploads/2026/02/IMG-20260222-WA0005.jpg"
          alt="Lace and Blades book cover"
          width={300}
          height={450}
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
