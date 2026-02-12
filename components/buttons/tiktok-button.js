import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { IoLogoTiktok } from 'react-icons/io5'

const TikTokButton = () => {
  const toggleColorMode = () => {
    const tiktokUrl = 'https://www.tiktok.com/@lace_blades?_r=1&_t=zn-92jym5mhogm/'

    //use window.location to navigate to the TikTok URL
    window.open(tiktokUrl, '_blank');
  }

  return (
    <IconButton
      aria-label="Toggle theme"
      bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
      css={{ backdropFilter: 'blur(10px)' }}
      padding="10px"
      boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
      color={useColorModeValue('blackAlpha.900', 'whiteAlpha.600')}
      icon={<IoLogoTiktok />}
      onClick={toggleColorMode}
    />
  )
}

export default TikTokButton
