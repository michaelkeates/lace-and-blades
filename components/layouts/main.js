// components/layouts/main.js
import Head from 'next/head'
import NavBar from '../navbar'
import Footer from '../footer'
import { Box, Container, useColorModeValue } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

// Added isConnected to the destructuring here
const Main = ({ children, router, isConnected }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const overlayBg = useColorModeValue('#e988ec40', '#26192980')
  const bgVariants = {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const isHome = router.pathname === '/'

  if (!mounted) {
    return (
      <Box position="relative" minH="100vh">
        <NavBar path={router.asPath} />
        <Container maxW="1200px">
          {children}
          {/* Pass status to Footer here */}
          <Footer isConnected={isConnected} />
        </Container>
      </Box>
    )
  }

  return (
    <Box position="relative" minH="100vh">
      <AnimatePresence mode="wait">
        {isHome && (
          <>
            <motion.div
              key="bgImage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              transition={{ enter: { duration: 1 }, exit: { duration: 4, ease: 'easeInOut' } }}
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
              transition={{ enter: { duration: 1 }, exit: { duration: 4, ease: 'easeInOut' } }}
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
          </>
        )}
      </AnimatePresence>

      <Head>
        {/* Meta tags */}
      </Head>

      <NavBar path={router.asPath} />

      <Box
        as={motion.div}
        key={router.route}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={bgVariants}
        transition={{ duration: 1.2, type: 'easeInOut' }}
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        pt="100px"
      >
        <Container maxW="1200px">
          {children}
          {/* Pass status to Footer here too */}
          <Footer isConnected={isConnected} />
        </Container>
      </Box>
    </Box>
  )
}

export default Main