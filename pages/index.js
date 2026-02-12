import {
  Container,
  Heading,
  Box,
  useColorModeValue,
  chakra,
  Divider
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Image from 'next/image'
import Bubble from '../components/bubbleheader'
import TikTokButton from '../components/buttons/tiktok-button'
import LinkedinButton from '../components/buttons/linkedin-button'
import LinktrButton from '../components/buttons/linktr-button'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const Home = () => (
  <Layout>
    <Container>
      <Box display="flex" justifyContent="center" mt={10} mb={4}>
        <Box
          borderColor={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
          borderWidth={2}
          borderStyle="solid"
          boxShadow="0px 0px 12px 3px rgba(0,0,0,0.05)"
          w="120px"
          h="120px"
          borderRadius="full"
          overflow="hidden"
        >
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
        as="h2"
        textAlign="center"
        variant="page-title"
        fontFamily="Roboto"
        mb={4}
      >
        Lace and Blades
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
