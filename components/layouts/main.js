import Head from 'next/head'
import dynamic from 'next/dynamic'
import NavBar from '../navbar'
import { Box, Container } from '@chakra-ui/react'
import Footer from '../footer'

const Main = ({ children, router }) => {
  return (
<Box
  as="main"
  minH="100vh"
  display="flex"
  flexDirection="column"
  bgImage="url('/images/background2.svg')"
  bgRepeat="repeat-y"        // repeat vertically
  bgPosition="top center"    // start at the top
  bgSize="1000px"           // or "auto", adjust as needed
>
  <Head>{/* meta stuff */}</Head>

  {/* NavBar stays at the top */}
  <NavBar path={router.asPath} />

  {/* Content wrapper */}
  <Box
    flex="1"
    display="flex"
    alignItems="flex-start"   // content aligned to top
    justifyContent="center"
    pt="150px"                // pushes content down without moving NavBar
  >
    <Container maxW="container.md">
      {children}
      <Footer />
    </Container>
  </Box>
</Box>

  )
}

export default Main