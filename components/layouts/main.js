// components/layouts/main.js
import Head from 'next/head'
import NavBar from '../navbar'
import Footer from '../footer'
import { Box, Container, useColorModeValue } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const Main = ({ children, router, isConnected }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const overlayBg = useColorModeValue('#e988ec40', '#26192980')
  
  const bgVariants = {
    hidden: { opacity: 0, y: 0 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 0 },
  }

  const isHome = router?.pathname === '/'

  // Pre-hydration fallback to prevent layout shift
  if (!mounted) {
    return (
      <Box minH="100vh" pt="100px">
        <NavBar path={router?.asPath || '/'} />
        <Container maxW="1200px">
          {children}
          <Footer isConnected={isConnected} />
        </Container>
      </Box>
    )
  }

  return (
    <Box position="relative" minH="100vh">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Lace & Blades</title>
      </Head>

      <AnimatePresence mode="wait">
        {isHome && (
          <Box key="home-bg-wrapper">
            <motion.div
              key="bgImage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: "url('/images/IMG-20260220-WA0017_2.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: -2,
                pointerEvents: 'none',
              }}
            />

            <motion.div
              key="bgOverlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                position: 'fixed',
                inset: 0,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                background: overlayBg,
                zIndex: -1,
                pointerEvents: 'none',
              }}
            />
          </Box>
        )}
      </AnimatePresence>

      {/* Navbar is kept outside the motion div to prevent it from jumping during transitions */}
      <NavBar path={router.asPath} />

      <Box
        as={motion.div}
        key={router.route}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={bgVariants}
        transition={{ duration: 0.5, type: 'easeInOut' }}
        pt="100px" 
        minH="100vh"
        display="block" 
      >
        <Container maxW="1200px">
          {children}
          <Footer isConnected={isConnected} />
        </Container>
      </Box>
    </Box>
  )
}

export default Main