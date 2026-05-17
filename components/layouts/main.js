// components/layouts/main.js
import Head from 'next/head'
import NavBar from '../navbar'
import Footer from '../footer'
import { Box, Container, useColorModeValue, Flex } from '@chakra-ui/react'
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
  const isAnalytics = router?.pathname === '/analytics' || router?.pathname === '/statistics'

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
        {(isHome || isAnalytics) && (
          <Box key="global-bg-wrapper">
            <motion.div
              key="bgImage"
              initial={{ opacity: 0 }}
              animate={{ opacity: isAnalytics ? 0.25 : 0.25 }} // 🚀 Synced perfectly to match home page depth
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
                background: overlayBg,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                zIndex: -1,
                pointerEvents: 'none',
              }}
            />
          </Box>
        )}
      </AnimatePresence>

      {/* 
        🚀 GLOBAL VERTICAL DISPLAY FLEX STACK
        Ensures structural sizing matches between short static and long scrolling views
      */}
      <Flex 
        direction="column" 
        minH="100vh"
        style={{ 
          backgroundAttachment: (isHome || isAnalytics) ? 'fixed' : 'scroll' 
        }}
      >
        <NavBar path={router.asPath} />

        {/* Dynamic Page Renderer */}
        <Box
          as={motion.div}
          key={router.route}
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={bgVariants}
          transition={{ duration: 0.5, type: 'easeInOut' }}
          pt="100px" 
          flex="1" 
          display="block"
        >
          <Container maxW="1200px">
            {children}
          </Container>
        </Box>

        {/* Global Footer Layout */}
        <Box w="full" mt="auto" pb={5} zIndex={1}>
          <Container maxW="1200px">
            <Footer isConnected={isConnected} />
          </Container>
        </Box>
      </Flex>
    </Box>
  )
}

export default Main