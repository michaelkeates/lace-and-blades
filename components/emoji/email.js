import { Box, useColorModeValue, Text } from '@chakra-ui/react'
import styles from '../../styles/emoji.module.css'

const CustomBox = ({ text, emoji, email = "lace.blades2026@gmail.com" }) => {
  return (
    <Box
      borderRadius="lg"
      mb={6}
      mx="auto" 
      pt={5}    
      px={6}    
      pb={4}    
      width="fit-content" 
      textAlign="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg={useColorModeValue('rgba(254, 242, 242, 0.4)', 'rgba(127, 29, 29, 0.2)')}
      css={{ backdropFilter: 'blur(10px)' }}
      boxShadow="0px 0px 12px 0px rgba(220, 38, 38, 0.05)" 
    >
      {/* Line 1: Emergency Warning */}
      <Text 
        mb={2} 
        fontWeight="bold" 
        fontSize="md"     
        color={useColorModeValue('red.800', 'red.200')}
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="8px" // Spacing between the text and the bigger siren
      >
        {text}
        
        {/* The siren is now hardcoded right here and set to a bigger size (xl) */}
        <Box as="span" fontSize="xl" display="inline-block" transform="translateY(-1px)">
          🚨
        </Box>
      </Text>

      {/* Line 2: Clickable Email Invitation */}
      <a
        href={`mailto:${email}`}
        className={styles.emailTitleLink}
        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <Text 
          as="span" 
          fontWeight="bold" 
          fontSize="md"     
          _hover={{ textDecoration: 'underline' }}
        >
          Message Lace & Blades here for any General Information
        </Text>
        <span className={styles.emojiTitle}>
          {emoji || '🎀'}
        </span>
      </a>
    </Box>
  )
}

export default CustomBox