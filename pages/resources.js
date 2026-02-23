import {
  Container,
  Heading,
  Button,
  Box,
  SimpleGrid,
  useColorModeValue,
  chakra,
  Divider,
  Badge,
  Link
} from '@chakra-ui/react'
import Paragraph from '../components/paragraph'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import Image from 'next/image'
import thumbsapiens from '../public/images/IMG_4631.jpg'
import Bubble from '../components/emoji/waving'
import NextLink from 'next/link'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const Home = () => {
  return (
    <Layout>
      <Container mt="-100px">
        <Box display={{ md: 'flex' }} paddingTop="25px">
          <Heading
            as="h1"
            textAlign="center"
            variant="page-title"
            mb={8}
            fontSize={58}
          >
            Support Agencies Information
          </Heading>
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
              Resources
            </Heading>
          </Section>

          <Divider />
          <Section delay={0.2}>
            <Heading as="h3" fontSize={20} mb={4} marginTop="1rem">
              Experience
            </Heading>
            <SimpleGrid columns={[1, 1, 1]} gap={2} justifyContent="center">
              <Box
                borderRadius="lg"
                mb={6}
                p={3}
                textAlign="center"
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                css={{ backdropFilter: 'blur(10px)' }}
                padding={4}
                boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
                paddingTop="1rem"
                flexDirection="column"
                alignItems="center"
              >
                <Box display="flex" alignItems="center">
                  <Box marginRight={4} marginTop="-2px" align="center">
                    <Image
                      src="https://laceandblades.michaelkeates.co.uk/wp-content/uploads/2026/02/Anyone-can-be-a-victim-of-rape-pdf.jpg"
                      width={100}
                      height={100}
                      alt="Thumbnail"
                    />
                  </Box>
                  <Box marginRight={4}>
                    <Heading
                      as="h2"
                      fontWeight="600"
                      fontSize={23}
                      textAlign="left"
                      marginBottom="2px"
                    >
                      Anyone can be a victim of rape
                    </Heading>
                    <Heading
                      as="h2"
                      fontWeight="400"
                      fontSize={21}
                      textAlign="left"
                    >
                      Guide for practioners
                    </Heading>
                  </Box>
                </Box>
                <Divider marginTop={3} marginBottom={1} />
                <Box marginTop={3}>
                  <Paragraph>
                    Sexual violence is any type of sexual behaviour that the
                    victim does not consent to. 1 in 5 women and approximately 1
                    in 20 men experience at least one form of sexual violence
                    during their lifetime. Rape and sexual assault can happen to
                    anyone at any age, from the very young to the very the very
                    old.
                  </Paragraph>
                  <Box marginTop={4} textAlign="center">
                    <Link
                      href="https://laceandblades.michaelkeates.co.uk/wp-content/uploads/2026/02/Anyone-can-be-a-victim-of-rape.pdf"
                      isExternal // Automatically adds target="_blank" and rel="noopener noreferrer"
                    >
                      <Button
                        boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05);"
                        fontSize="14px"
                        marginTop="10px"
                        marginBottom="10px"
                        bg={useColorModeValue(
                          'whiteAlpha.500',
                          'whiteAlpha.200'
                        )}
                      >
                        Read PDF
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </SimpleGrid>
          </Section>
          <Divider />
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
