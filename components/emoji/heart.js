import { Box, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import styles from '../../styles/emoji.module.css'

const CustomBox = ({ text, emoji }) => {
  return (
    <Box
      flex="1"
      borderRadius="lg"
      textAlign="center"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
      css={{ backdropFilter: 'blur(10px)' }}
      px={[4, 6, 10]} // responsive padding: mobile 4, tablet 6, desktop 10
      py={4}           // keep vertical padding
      boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
      height="100%"
    >
      <a
        className={styles.emailTitleLink}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {text}
        <motion.span
          className={styles.emojiTitle}
          style={{ marginLeft: '4px', display: 'inline-block' }} // smaller margin on mobile
          animate={{ scale: [1, 1.25, 1, 1.15, 1] }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.2, 0.4, 0.6, 1]
          }}
        >
          {emoji}
        </motion.span>
      </a>
    </Box>
  )
}

export default CustomBox