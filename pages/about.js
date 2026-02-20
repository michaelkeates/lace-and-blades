import {
  Container,
  Heading,
  Button,
  Box,
  SimpleGrid,
  useColorModeValue,
  chakra,
  Divider,
  Badge
} from '@chakra-ui/react'
import Paragraph from '../components/paragraph'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import Image from 'next/image'
import Bubble from '../components/emoji/waving'
import NextLink from 'next/link'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const Home = () => {

  return (
    <Layout>
      <Container>
        <Box display={{ md: 'flex' }} paddingTop="25px">
          <Box flexGrow={1}>
            <Heading
              as="h2"
            >
              Lace & Blades
            </Heading>
                    <Bubble text="Hi there!" emoji="👋" />
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            ml={{ md: 6 }}
            textAlign="center"
          >
            <Box
              borderColor={useColorModeValue(
                'whiteAlpha.500',
                'whiteAlpha.200'
              )}
              borderWidth={2}
              borderStyle="solid"
              boxShadow="0px 0px 12px 3px rgba(0,0,0,0.05);"
              w="100px"
              h="100px"
              display="inline-block"
              borderRadius="full"
              overflow="hidden"
            >
              <ProfileImage
                src="/images/Lace-Blades-small.jpeg"
                alt="Profile image"
                borderRadius="full"
                width="100"
                height="100"
              />
            </Box>
          </Box>
        </Box>
        <SimpleGrid colums={[1, 1, 2]} gap={2}>
          <Section delay={0.1}>
            <Heading
              as="h3"
              fontFamily="Roboto"
              fontWeight="500"
              fontSize={20}
              mb={2}
            >
              Background
            </Heading>
            <Box borderRadius="lg" mb={6} p={3} textAlign="center" bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} css={{ backdropFilter: 'blur(10px)' }} padding={4} boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)" paddingTop="1rem">
            <Paragraph>
              Lace & Blades didn't begin as a book. It was the first words and
              were never meant to be read. Fragments written in fear just to
              keep reality. I didn't know it was abuse. I thought I was failing
              at a relationship. The darkness arrived quietly - through
              affection and control disguised as care. As control and trauma
              bonding tightened, writing became my lifeline, real-time truth
              with no polish or hindsight.
            </Paragraph>
            </Box>
          </Section>
        </SimpleGrid>
        <Divider />
      </Container>
    </Layout>
  )
}

export default Home

export async function getServerSideProps({ req }) {
  return {
    props: {
      cookies: req.headers.cookie ?? ''
    }
  }
}
