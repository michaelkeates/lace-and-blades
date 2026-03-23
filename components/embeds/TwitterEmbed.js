import dynamic from 'next/dynamic'
import { Box, useBreakpointValue } from '@chakra-ui/react'
import { useEffect } from 'react'

// Load dynamically so Next.js SSR doesn't break
const TwitterTweetEmbed = dynamic(
  () => import('react-twitter-embed').then(mod => mod.TwitterTweetEmbed),
  { ssr: false }
)

export default function TwitterEmbed({ url }) {
  // Use Chakra's breakpoint system to define the width
  // Base (mobile): 300px, md (tablet/desktop): 550px
  const tweetWidth = useBreakpointValue({ base: 300, md: 550 })

  if (!url) return null

  // Extract the Tweet ID from URL
  const match = url.match(/status\/(\d+)/)
  const tweetId = match ? match[1] : null
  if (!tweetId) return null

  // Load Twitter widgets.js if not already loaded
  useEffect(() => {
    if (!window.twttr) {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <Box
      my={6}
      display="flex"
      justifyContent="center"
      w="100%" // Parent container takes full width
      sx={{
        '& .twitter-tweet': {
          margin: '0 auto !important',
          // Force the injected iframe to respect the dynamic width
          width: `${tweetWidth}px !important` 
        }
      }}
    >
      <TwitterTweetEmbed
        tweetId={tweetId}
        options={{
          width: tweetWidth,
          align: 'center'
        }}
      />
    </Box>
  )
}