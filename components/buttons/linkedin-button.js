// components/buttons/linkedin-button.js
import { IconButton, useColorModeValue } from '@chakra-ui/react'
import { IoLogoLinkedin } from 'react-icons/io5'

const LinkedinButton = () => {
  const bg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const color = useColorModeValue('blackAlpha.900', 'whiteAlpha.600')

  return (
    <IconButton
      as="a" // render as a real <a> tag
      href="https://www.linkedin.com/in/lace-and-blades/" // your LinkedIn URL
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn Button"
      bg={bg}
      css={{ backdropFilter: 'blur(10px)' }}
      padding="10px"
      boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
      color={color}
      icon={<IoLogoLinkedin />}
    />
  )
}

export default LinkedinButton