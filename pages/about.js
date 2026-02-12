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
import { BioSection } from '../components/bio'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import Image from 'next/image'
import thumbusw from '../public/images/works/usw_logo.png'
import thumbkenfreight from '../public/images/works/hllea.png'
import thumbcityhospice from '../public/images/works/city_hospice.png'
import thumbsapiens from '../public/images/works/sapiens.png'
import styles from '../styles/emoji.module.css'
import Bubble from '../components/bubbleheader2'
import NextLink from 'next/link'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const Home = () => {

  return (
    <Layout>
      <Container>
        <Bubble text="Hi there!" emoji="👋" />
        <Box display={{ md: 'flex' }} paddingTop="25px">
          <Box flexGrow={1}>
            <Heading
              as="h2"
              variant="page-title"
              fontFamily="Roboto"
              fontWeight=""
            >
              Lace & Blades
            </Heading>
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
        <Heading
          as="h3"
          fontFamily="Roboto"
          fontWeight="500"
          fontSize={20}
          mb={2}
          marginTop="1rem"
        >
          Contact
        </Heading>
        <div className={styles.hackymargin}>
          <Section delay={0.1}>
            <SimpleGrid columns={[1, 1, 2]} gap={2}>
              <Box
                borderRadius="lg"
                mb={1}
                p={1}
                textAlign="center"
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                css={{ backdropFilter: 'blur(10px)' }}
                padding="10px;"
                boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05);"
              >
                <BioSection>
                  <a
                    href="mailto:mail@michaelkeates.co.uk"
                    className={styles.emailLink}
                  >
                    <span className={styles.emoji}>✉️</span>{' '}
                    mail@michaelkeates.co.uk
                  </a>
                </BioSection>
              </Box>
              <Box
                borderRadius="lg"
                mb={1}
                p={1}
                textAlign="center"
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                css={{ backdropFilter: 'blur(10px)' }}
                padding="10px;"
                boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05);"
              >
                <BioSection>
                  <a href="tel:+447495137974" className={styles.emailLink}>
                    <span className={styles.emoji}>📱</span> +44 7495 137 974
                  </a>
                </BioSection>
              </Box>
              <Box
                borderRadius="lg"
                mb={1}
                p={1}
                textAlign="center"
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                css={{ backdropFilter: 'blur(10px)' }}
                padding="10px;"
                boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05);"
              >
                <BioSection>
                  <a
                    href="https://www.michaelkeates.co.uk"
                    className={styles.emailLink}
                  >
                    <span className={styles.emoji}>👉🏼</span>{' '}
                    www.michaelkeates.co.uk
                  </a>
                </BioSection>
              </Box>
              <Box
                borderRadius="lg"
                mb={1}
                p={1}
                textAlign="center"
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                css={{ backdropFilter: 'blur(10px)' }}
                padding="10px;"
                boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05);"
              >
                <BioSection>
                  <a
                    href="https://github.com/michaelkeates"
                    className={styles.emailLink}
                  >
                    <span className={styles.emoji}>🚀</span>{' '}
                    github.com/michaelkeates
                  </a>
                </BioSection>
              </Box>
            </SimpleGrid>
          </Section>
        </div>
        <Divider />
        <Section delay={0.2}>
          <Heading
            as="h3"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize={20}
            mb={4}
            marginTop="1rem"
          >
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
                    Junior Business Analyst
                  </Heading>
                  <Heading
                    as="h2"
                    fontFamily="Roboto"
                    fontWeight="400"
                    fontSize={11}
                    textAlign="left"
                  >
                    Sapiens | Full-Time
                  </Heading>
                </Box>
                <Box display="flex" justifyContent="flex-end" flex="1">
                  <Badge
                    bg={useColorModeValue('whiteAlpha.100', 'whiteAlpha.000')}
                    color=""
                    fontSize={9}
                  >
                    SEP 2025 - PRESENT
                  </Badge>
                </Box>
              </Box>
              <Divider marginTop={3} marginBottom={1} />
              <Box marginTop={3}></Box>
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
                    Graduate Business Analyst
                  </Heading>
                  <Heading
                    as="h2"
                    fontFamily="Roboto"
                    fontWeight="400"
                    fontSize={11}
                    textAlign="left"
                  >
                    Sapiens | Full-Time
                  </Heading>
                </Box>
                <Box display="flex" justifyContent="flex-end" flex="1">
                  <Badge
                    bg={useColorModeValue('whiteAlpha.100', 'whiteAlpha.000')}
                    color=""
                    fontSize={9}
                  >
                    APR 2024 - AUG 2025
                  </Badge>
                </Box>
              </Box>
              <Divider marginTop={3} marginBottom={1} />
              <Box marginTop={3}>
                <Box textAlign="left" fontSize={12} padding={2}>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li>
                      Played a role in the successful go-live of the PPS Mutual
                      New Zealand project, configuring product, supporting
                      digital team & implementing the baseline for complex
                      Premium Calculations using SQL.
                    </li>
                    <li>
                      Created advanced spreadsheets for calculating premiums,
                      tax reinsurance, commissions among others.
                    </li>
                    <li>
                      Awarded a Certificate of Recognition for supporting new
                      joiners and consistently delivering high-quality
                      deliverables under tight deadlines.
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
                  <Image src={thumbcityhospice} width={100} />
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
                      strong performance and dedication, leading to an extension
                      to 8 months.
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
                  <Image src={thumbkenfreight} width={100} />
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
                      Created compelling and engaging presentations for clients,
                      effectively conveying complex ideas and proposals.
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
        <Heading
          as="h3"
          fontFamily="Roboto"
          fontWeight="500"
          fontSize={20}
          mb={4}
          marginTop="1rem"
        >
          Education
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
                <Image src={thumbusw} width={100} />
              </Box>
              <Box marginRight={4}>
                <NextLink
                  href="qualificatons/uswapplied"
                  passHref
                  scroll={false}
                >
                  <Heading
                    as="h2"
                    fontFamily="Roboto"
                    fontWeight="600"
                    fontSize={13}
                    textAlign="left"
                    marginBottom="2px"
                  >
                    BSc (Hons) Applied Computing - First Class Honours
                  </Heading>
                </NextLink>
                <Heading
                  as="h2"
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize={11}
                  textAlign="left"
                >
                  University of South Wales
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
                  Sep 2022 - May 2023
                </Badge>
              </Box>
            </Box>
            <Divider marginTop={3} marginBottom={1} />
            <Box marginTop={3}>

          </Box>
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
