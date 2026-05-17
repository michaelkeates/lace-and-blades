// components/analytics/topcountries.js
import { Box, Heading, List, ListItem, Flex, Badge, Divider, chakra, Text, useColorModeValue } from '@chakra-ui/react'

// Helper function to turn ISO 3166-1 alpha-2 country codes (like "GB", "US") into actual native Emoji Flags
const getFlagEmoji = (countryCode) => {
  if (!countryCode || countryCode === 'UNKNOWN') return '🌐'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) =>  127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const TopCountries = ({ countryData = [], chartFill }) => {
  const cardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const badgeColor = useColorModeValue('purple.500', 'purple.200')

  // Prevent crashing if cloudflare data fails to load or returns empty
  const displayData = countryData.slice(0, 6)

  return (
    <Box
      p={6}
      bg={cardBg}
      backdropFilter="blur(10px)"
      css={{ backdropFilter: 'blur(10px)' }}
      borderRadius="25px"
      mb={10}
    >
      <Heading as="h3" size="md" mb={4} fontWeight="bold" letterSpacing="wide">
        Top Traffic Locations
      </Heading>

      {displayData.length === 0 ? (
        <Text fontSize="sm" opacity={0.6} textAlign="center" py={4}>
          No regional traffic records available.
        </Text>
      ) : (
        <List spacing={4}>
          {displayData.map((item, index) => (
            <ListItem key={item.code || index}>
              <Flex
                justify="space-between"
                align="center"
                p={3}
                transition="all 0.3s ease"
                _hover={{
                  bg: 'whiteAlpha.300',
                  transform: 'translateX(5px)'
                }}
                borderRadius="xl"
              >
                <Flex align="center">
                  {/* Position Index Ranking Badge */}
                  <Badge colorScheme="purple" mr={3} borderRadius="full" px={2}>
                    {index + 1}
                  </Badge>

                  {/* Dynamic Emoji Flag Graphic */}
                  <chakra.span fontSize="xl" mr={3} style={{ userSelect: 'none' }}>
                    {getFlagEmoji(item.code)}
                  </chakra.span>

                  {/* Human-readable Country Name */}
                  <chakra.span fontWeight="300" fontSize="md" noOfLines={1}>
                    {item.name}
                  </chakra.span>
                </Flex>

                {/* Network Request/View Volume Count */}
                <Text fontWeight="bold" color={chartFill}>
                  {item.views.toLocaleString()}
                </Text>
              </Flex>
              <Divider opacity={0.1} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default TopCountries