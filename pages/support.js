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
      <Container>
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
              Background
            </Heading>
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
            >
              <Paragraph>
                Lace & Blades didn't begin as a book. It was the first words and
                were never meant to be read. Fragments written in fear just to
                keep reality. I didn't know it was abuse. I thought I was
                failing at a relationship. The darkness arrived quietly -
                through affection and control disguised as care. As control and
                trauma bonding tightened, writing became my lifeline, real-time
                truth with no polish or hindsight.
              </Paragraph>
            </Box>
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
                    <Image src={thumbsapiens} width={100} />
                  </Box>
                  <Box marginRight={4}>
                    <Heading
                      as="h2"
                      fontFamily="Roboto"
                      fontWeight="600"
                      fontSize={13}
                      textAlign="left"
                      marginBottom="2px"
                    >
                      Database Assistant
                    </Heading>
                    <Heading
                      as="h2"
                      fontFamily="Roboto"
                      fontWeight="400"
                      fontSize={11}
                      textAlign="left"
                    >
                      City Hospice | Contract
                    </Heading>
                  </Box>
                  <Box display="flex" justifyContent="flex-end" flex="1">
                    <Badge
                      bg={useColorModeValue('whiteAlpha.100', 'whiteAlpha.000')}
                      color=""
                      fontSize={9}
                    >
                      Aug 2023 - MAR 2024
                    </Badge>
                  </Box>
                </Box>
                <Divider marginTop={3} marginBottom={1} />
                <Box marginTop={3}>
                  <Box textAlign="left" fontSize={12} padding={2}>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      <li>
                        Successfully completed a 6-month contract, demonstrating
                        strong performance and dedication, leading to an
                        extension to 8 months.
                      </li>
                      <li>
                        Analysing data to derive insights and support
                        decision-making processes.
                      </li>
                      <li>
                        Contributed significantly to thorough analysis and
                        meticulous data cleansing, leading to the successful
                        implementation of a new system.
                      </li>
                    </ul>
                  </Box>
                </Box>
              </Box>
            </SimpleGrid>
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
                    <Image src={thumbsapiens} width={100} />
                  </Box>
                  <Box marginRight={4}>
                    <Heading
                      as="h2"
                      fontFamily="Roboto"
                      fontWeight="600"
                      fontSize={13}
                      textAlign="left"
                      marginBottom="2px"
                    >
                      Remote Creative Strategist & Design Consultant
                    </Heading>
                    <Heading
                      as="h2"
                      fontFamily="Roboto"
                      fontWeight="400"
                      fontSize={11}
                      textAlign="left"
                    >
                      Heavy Lift Logistics East Africa Limited | Freelance
                    </Heading>
                  </Box>
                  <Box
                    marginTop="-5px"
                    display="flex"
                    justifyContent="flex-end"
                    flex="1"
                  >
                    <Badge
                      bg={useColorModeValue('whiteAlpha.100', 'whiteAlpha.000')}
                      color=""
                      fontSize={9}
                    >
                      Jun 2018 - Mar 2020
                    </Badge>
                  </Box>
                </Box>
                <Divider marginTop={3} marginBottom={1} />
                <Box marginTop={3}>
                  <Box textAlign="left" fontSize={12} padding={2}>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      <li>
                        Designed and produced company logo, capturing brand
                        identity and values.
                      </li>
                      <li>
                        Created compelling and engaging presentations for
                        clients, effectively conveying complex ideas and
                        proposals.
                      </li>
                      <li>
                        Produced comprehensive and efficient transport plans,
                        optimizing logisistics and ensuring smooth operations.
                      </li>
                    </ul>
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
