import { Box, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import styles from '../../styles/emoji.module.css'

const CustomBox = ({ text, emoji }) => {
  return (
    <Box
      flex="1" // allow bubble to fill available height
      borderRadius="lg"
      textAlign="center"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
      css={{ backdropFilter: 'blur(10px)' }}
      px={10} // horizontal padding
      py={4} // vertical padding
      boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
      height="100%" // make height match parent
    >
      <a
        className={styles.emailTitleLink}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {text}
        <motion.span
          className={styles.emojiTitle}
          style={{ marginLeft: '8px', display: 'inline-block' }}
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
