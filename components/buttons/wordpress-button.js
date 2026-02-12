import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { IoLogoWordpress } from 'react-icons/io5'

const WordpressButton = () => {
  const toggleColorMode = () => {
    const wordpressUrl = 'https://laceandblades.michaelkeates.co.uk/wp-login.php/'

    //use window.location to navigate to the WordPress URL
    window.open(wordpressUrl, '_blank');
  }

  return (
    <IconButton
      aria-label="Toggle theme"
      bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
      css={{ backdropFilter: 'blur(10px)' }}
      padding="10px"
      boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
      color={useColorModeValue('blackAlpha.900', 'whiteAlpha.600')}
      icon={<IoLogoWordpress />}
      onClick={toggleColorMode}
    />
  )
}

export default WordpressButton