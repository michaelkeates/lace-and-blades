import dynamic from 'next/dynamic'
import { Box, useBreakpointValue } from '@chakra-ui/react'
import { useEffect } from 'react'

// Load dynamically to prevent SSR issues with the Twitter library
const TwitterTweetEmbed = dynamic(
  () => import('react-twitter-embed').then(mod => mod.TwitterTweetEmbed),
  { ssr: false }
)

export const WPTwitter = ({ node, idx, findTwitterUrl }) => {
  const tweetWidth = useBreakpointValue({ base: 300, md: 550 })
  
  // Extract URL using the helper passed from the main parser
  const tweetUrl = findTwitterUrl([node])
  if (!tweetUrl) return null

  // Clean the URL and extract the ID
  const cleanUrl = tweetUrl.split('?')[0].trim()
  const match = cleanUrl.match(/status\/(\d+)/)
  const tweetId = match ? match[1] : null

  useEffect(() => {
    if (!window.twttr) {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  if (!tweetId) return null

  return (
    <Box
      key={idx}
      my={6}
      display="flex"
      justifyContent="center"
      w="100%"
      sx={{
        '& .twitter-tweet': {
          margin: '0 auto !important',
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