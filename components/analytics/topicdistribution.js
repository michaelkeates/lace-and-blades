import { Box, Heading, Flex, Text, useColorModeValue } from '@chakra-ui/react'

const TopicDistribution = ({ categories, totalPosts, chartFill }) => {
  const cardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
  const barBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count)

  return (
    <Box
      p={6}
      bg={cardBg}
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="25px"
    >
      <Heading as="h3" variant="section-title">
        Topic Distribution
      </Heading>
      <Box mt={6}>
        {sortedCategories.map(cat => {
          const percentage = totalPosts > 0 ? (cat.count / totalPosts) * 100 : 0
          return (
            <Box key={cat.name} mb={6}>
              <Flex justify="space-between" fontSize="sm" mb={2} opacity={0.8}>
                <Text fontWeight="300">{cat.name}</Text>
                <Text>{cat.count} items</Text>
              </Flex>
              <Box w="100%" h="6px" bg={barBg} borderRadius="full">
                <Box
                  w={`${percentage}%`}
                  h="100%"
                  bg={chartFill}
                  borderRadius="full"
                  transition="width 1s ease-in-out"
                />
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default TopicDistribution