import { AnimatePresence, motion } from 'framer-motion'
import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { IoLogoDocker } from 'react-icons/io5'
import nextLink from 'next/link'

const LinktrButton = () => {
  const toggleColorMode = () => {
    const linktrUrl = 'https://linktr.ee/laceandblades/'

    //use window.location to navigate to the GitHub URL
    window.open(linktrUrl, '_blank');
  }

  return (
<IconButton
  aria-label="Linktr Button"
  bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
  css={{ backdropFilter: 'blur(10px)' }}
  padding="10px"
  boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
  color={useColorModeValue('blackAlpha.900', 'whiteAlpha.600')}
  icon={
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      width="24"
      height="24"
      fill="currentColor"  // <-- inherits IconButton color
      style={{ opacity: 1 }}
    >
      <path d="M128 237.4h125.8L164.4 152l49.5-51l85.2 87.8V64H373v124.8l85.2-87.6l49.4 50.8l-89.4 85.2h125.7v70.5H417.5l90 87.6l-49.3 49.8l-122.2-123l-122.2 123l-49.5-49.6l90-87.6H127.9v-70.5zm170.9 171.4h73.9V576h-73.9z"/>
    </svg>
  }
  onClick={() => window.open('https://linktr.ee/laceandblades/', '_blank')}
/>

  )
}

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="24" height="24" fill="#000000" style="opacity:1;"><path  d="M128 237.4h125.8L164.4 152l49.5-51l85.2 87.8V64H373v124.8l85.2-87.6l49.4 50.8l-89.4 85.2h125.7v70.5H417.5l90 87.6l-49.3 49.8l-122.2-123l-122.2 123l-49.5-49.6l90-87.6H127.9v-70.5zm170.9 171.4h73.9V576h-73.9z"/></svg>
export default LinktrButton
