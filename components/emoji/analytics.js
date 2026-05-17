import { Box, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const AnalyticsHeaderBubble = ({ text }) => {
  const textColor = useColorModeValue('gray.800', 'white')
  const chartLineColor = '#c966ff' // Matches your chart's accent purple

  return (
    <Box
      flex="1"
      borderRadius="20px"
      textAlign="center"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
      css={{ backdropFilter: 'blur(15px)' }}
      px={[4, 6, 10]}
      py={4}
      height="100%"
    >
      <Box
        as="a"
        display="flex"
        alignItems="center"
        fontSize={["sm", "md", "lg"]}
        fontWeight="bold"
        color={textColor}
        letterSpacing="wide"
      >
        {text}

        {/* 🚀 NATIVE ANIMATED SVG TELEMETRY CHART ICON */}
        <Box as="svg" viewBox="0 0 24 24" width="24px" height="24px" ml="12px" display="inline-block">
          {/* Static Chart Background Axes */}
          <path
            d="M3 20h18M3 20V4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.25"
          />

          {/* Dynamic Graph Line: Automatically draws itself upward from left to right */}
          <motion.path
            d="M4 17l5-5 4 3 7-8"
            fill="none"
            stroke={chartLineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: 40, strokeDashoffset: 40 }}
            animate={{ strokeDashoffset: [40, 0, 0, 40] }} // Draws up, holds, then wipes back cleanly
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 1 // Pauses for a second before restarting the cycle
            }}
          />

          {/* Arrow Tip: Appears right as the graph line reaches its peak */}
          <motion.path
            d="M17 7h3v3"
            fill="none"
            stroke={chartLineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 0, 1, 1, 0], 
              scale: [0.5, 0.5, 1, 1, 0.5] 
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.4, 0.5, 0.8, 1], // Timing matched to the line drawing sequence
              repeatDelay: 1
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default AnalyticsHeaderBubble