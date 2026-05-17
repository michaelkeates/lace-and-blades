import { Box, Heading, List, ListItem, Flex, Badge, Divider, chakra, Text, useColorModeValue } from '@chakra-ui/react'
import NextLink from 'next/link'

const PopularContent = ({ mostViewed, chartFill }) => {
  const cardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

  return (
    <Box
      p={6}
      bg={cardBg}
      backdropFilter="blur(10px)"
      css={{ backdropFilter: 'blur(10px)' }}
      borderRadius="25px"
      mb={10}
    >
      <Heading as="h3" variant="section-title">
        Popular Content
      </Heading>
      <List spacing={4} mt={4}>
        {mostViewed.map((item, index) => (
          <ListItem key={index}>
            <NextLink href={item.href} passHref>
              <Flex
                justify="space-between"
                align="center"
                p={3}
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{
                  bg: 'whiteAlpha.300',
                  transform: 'translateX(5px)'
                }}
                borderRadius="xl"
              >
                <Box>
                  <Badge colorScheme="purple" mr={3} borderRadius="full">
                    {index + 1}
                  </Badge>
                  <Badge
                    variant="outline"
                    fontSize="0.6em"
                    mr={2}
                    colorScheme={item.type === 'Page' ? 'orange' : 'blue'}
                  >
                    {item.type}
                  </Badge>
                  <chakra.span fontWeight="300" fontSize="lg">
                    {item.title}
                  </chakra.span>
                </Box>
                <Text fontWeight="bold" color={chartFill}>
                  {item.views}
                </Text>
              </Flex>
            </NextLink>
            <Divider opacity={0.1} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default PopularContent