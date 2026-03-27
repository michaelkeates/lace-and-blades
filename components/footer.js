import NextLink from 'next/link'
import { Box, Link, Flex } from '@chakra-ui/react'
import { keyframes as emotionKeyframes } from '@emotion/react'

const pulse = emotionKeyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`

// Add 'isConnected' as a prop (defaulting to true)
const Footer = ({ isConnected = true }) => {
  return (
    <Box as="footer" textAlign="center" fontSize="11px" py="30px" fontFamily="footer">
      <Flex display="inline-flex" alignItems="center" justifyContent="center" lineHeight="1" opacity={0.4}>
        <Box as="span">&copy; {new Date().getFullYear()} Michael Keates.</Box>
        <NextLink href="/terms" passHref><Link ml={1}>Terms & Conditions.</Link></NextLink>
        <Box as="span" ml={1}>All Rights Reserved.</Box>
        
        <Box
          animation={`${pulse} 2s infinite`}
          w="5px"
          h="5px"
          // If isConnected is true, green. If false, red.
          bg={isConnected ? "green.400" : "red.500"}
          borderRadius="full"
          ml={2}
          transform="translateY(0.5px)" 
          boxShadow={isConnected 
            ? "0 0 6px rgba(72, 187, 120, 0.8)" 
            : "0 0 6px rgba(229, 62, 62, 0.8)"
          }
          flexShrink={0}
        />
      </Flex>
    </Box>
  )
}

export default Footer