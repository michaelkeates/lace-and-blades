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
  //bgImage="url('/images/pink-leopard-animal-print-flat-by-Vexels.png')"
  bgRepeat="repeat-y"
  bgPosition="top center"
  bgSize="1000px"
  //bgBlendMode="overlay"
  //bg="rgba(255, 255, 255, 0.8)"
  bgOpacity={0.8}
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