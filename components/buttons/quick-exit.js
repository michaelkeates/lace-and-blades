// components/buttons/quick-exit-button.js
import { Button, useColorModeValue, Icon } from '@chakra-ui/react'
import { MdClose } from 'react-icons/md'

const QuickExitButton = () => {
  const bg = useColorModeValue('rgba(229, 62, 62, 0.85)', 'rgba(224, 49, 49, 0.75)')
  const hoverBg = useColorModeValue('red.600', 'red.700')
  
  const handleQuickExit = () => {
    window.location.replace('https://www.google.com')
  }

  return (
    <Button
      onClick={handleQuickExit}
      leftIcon={<Icon as={MdClose} boxSize="16px" />}
      bg={bg}
      color="white"
      px={4}
      fontSize="xs"
      borderRadius="md"
      _hover={{
        bg: hoverBg,
        opacity: 1,
      }}
      _active={{
        bg: hoverBg,
      }}
      css={{ 
        backdropFilter: 'blur(8px)',
        letterSpacing: '1px'
      }}
      transition="all 0.2s"
    >
      Quick Exit
    </Button>
  )
}

export default QuickExitButton