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
        <motion.span
          className={styles.emojiTitle}
          style={{ marginLeft: '8px' }}
          animate={{
            rotate: [0, 14, -8, 14, -4, 10, 0, 0], // Rotate animation values
            transition: {
              duration: 1.5, // Duration of animation loop
              repeat: Infinity, // Repeat the animation indefinitely
              ease: 'easeInOut', // Easing function
            },
          }}
        >
          {emoji}
        </motion.span>
      </a>
    </Box>
  );
};

export default CustomBox;
