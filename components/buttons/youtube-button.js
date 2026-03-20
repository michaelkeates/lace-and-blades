// components/buttons/tiktok-button.js
import { IconButton, useColorModeValue } from '@chakra-ui/react'
import { IoLogoYoutube } from 'react-icons/io5'

const YoutubeButton = () => {
  const bg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const color = useColorModeValue('blackAlpha.900', 'whiteAlpha.600')

  return (
    <IconButton
      as="a" // render as a real <a> tag
      href="https://www.youtube.com/@Lace-BladesGrace"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Youtube Button"
      bg={bg}
      css={{ backdropFilter: 'blur(10px)' }}
      padding="10px"
      boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
      color={color}
      icon={<IoLogoYoutube />}
    />
  )
}

export default YoutubeButton