import { AnimatePresence, motion } from 'framer-motion'
import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { IoLogoInstagram } from 'react-icons/io5'
import nextLink from 'next/link'

const LinkedinButton = () => {
  const toggleColorMode = () => {
    const linkedinUrl = 'https://www.instagram.com/lace_blades/'

    //use window.location to navigate to the GitHub URL
    window.open(linkedinUrl, '_blank');
  }

  return (
    <IconButton
      aria-label="Toggle theme"
      bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
      css={{ backdropFilter: 'blur(10px)' }}
      padding="10px"
      boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
      color={useColorModeValue('blackAlpha.900', 'whiteAlpha.600')}
      icon={<IoLogoInstagram />}
      onClick={toggleColorMode}
    />
  )
}

export default LinkedinButton
