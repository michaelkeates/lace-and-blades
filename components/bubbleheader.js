import { Box, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import styles from '../styles/emoji.module.css'

const CustomBox = ({ text, emoji }) => {
  return (
    <Box
      borderRadius="lg"
      mb={6}
      p={3}
      textAlign="center"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
      css={{ backdropFilter: 'blur(10px)' }}
      padding="10px"
      boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
    >
      <a className={styles.emailTitleLink}>
        {text}
        <span className={styles.emojiTitle} style={{ marginLeft: '8px' }}>
          {emoji}
        </span>
      </a>
    </Box>
  )
}

export default CustomBox
