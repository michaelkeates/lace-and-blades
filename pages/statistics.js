import {
  Container,
  Heading,
  Box,
  SimpleGrid,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  chakra,
  Text,
  useColorModeValue,
  List,
  ListItem,
  Badge,
  Flex
} from '@chakra-ui/react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import Layout from '../components/layouts/article'
import NextLink from 'next/link'
import Section from '../components/section'
import { keyframes } from '@emotion/react'
import { getApolloClient } from '../lib/wordpress'
import { GET_GLOBAL_STATS } from '../lib/queries'

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
`

const Statistics = ({
  totalPosts = 0,
  totalViews = 0,
  categories = [],
  mostViewed = [],
  chartData = [],
  lastUpdated = ''
}) => {
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count)
  const cardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
  const chartFill = useColorModeValue('#d980fa', '#b537f2')

  return (
    <Layout title="Analytics">
      <Container maxWidth="3xl">
        <Section delay={0.1}>
          <Heading
            as="h1"
            size="2xl"
            textAlign="center"
            mb={4}
            fontFamily="CartaMarina"
          >
            Site Analytics
          </Heading>

          <Flex justify="center" align="center" direction="column" mb={10}>
            <Flex align="center" mb={1}>
              <Box
                animation={`${pulse} 2s infinite`}
                w="8px"
                h="8px"
                bg="green.400"
                borderRadius="full"
                mr={2}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="widest"
              >
                Live Data Sync Active
              </Text>
            </Flex>
            {lastUpdated && (
              <Text fontSize="10px" opacity={0.6}>
                Last sync: {lastUpdated}
              </Text>
            )}
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={10}>
            <Stat
              p={5}
              bg={cardBg}
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="20px"
            >
              <StatLabel fontSize="xs" opacity={0.7} textTransform="uppercase">
                Total Views
              </StatLabel>
              <StatNumber fontSize="3xl" fontWeight="300" color={chartFill}>
                {totalViews.toLocaleString()}
              </StatNumber>
            </Stat>
            <Stat
              p={5}
              bg={cardBg}
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="20px"
            >
              <StatLabel fontSize="xs" opacity={0.7} textTransform="uppercase">
                Posts
              </StatLabel>
              <StatNumber fontSize="3xl" fontWeight="300">
                {totalPosts}
              </StatNumber>
            </Stat>
            <Stat
              p={5}
              bg={cardBg}
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="20px"
            >
              <StatLabel fontSize="xs" opacity={0.7} textTransform="uppercase">
                Categories
              </StatLabel>
              <StatNumber fontSize="3xl" fontWeight="300">
                {categories.length}
              </StatNumber>
            </Stat>
          </SimpleGrid>

          <Box
            p={6}
            bg={cardBg}
            backdropFilter="blur(15px)"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="25px"
            mb={10}
          >
            <Heading as="h3" variant="section-title">
              Weekly Views
            </Heading>
            <Box h="250px" w="100%" mt={4}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chartFill}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartFill}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={borderColor}
                  />
                  <XAxis
                    dataKey="name" // This will now display Mon, Tue, Wed...
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'gray', fontSize: 12 }}
                    dy={10}
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: cardBg,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '15px',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke={chartFill}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box
            p={6}
            bg={cardBg}
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor={borderColor}
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
                const percentage =
                  totalPosts > 0 ? (cat.count / totalPosts) * 100 : 0
                return (
                  <Box key={cat.name} mb={6}>
                    <Flex
                      justify="space-between"
                      fontSize="sm"
                      mb={2}
                      opacity={0.8}
                    >
                      <Text fontWeight="300">{cat.name}</Text>
                      <Text>{cat.count} items</Text>
                    </Flex>
                    <Box
                      w="100%"
                      h="6px"
                      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
                      borderRadius="full"
                    >
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
        </Section>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const client = getApolloClient()
  try {
    const { data } = await client.query({
      query: GET_GLOBAL_STATS,
      fetchPolicy: 'no-cache'
    })

    // 1. Safely grab nodes
    const postNodes = data?.popularPosts?.nodes || []
    const pageNodes = data?.popularPages?.nodes || []
    const categories = data?.categories?.nodes || []

    // 2. Combine all content into one array
    const allContent = [...postNodes, ...pageNodes]

    // 3. Calculate Stats
    const totalPosts = categories.reduce(
      (acc, cat) => acc + (cat.count || 0),
      0
    )

    const totalViews = allContent.reduce((acc, item) => {
      const count = parseInt(item.viewCount) || 0
      return acc + count
    }, 0)

    // 4. Debugging log (visible in your terminal)
    console.log(
      `Debug: Total Views Calculated: ${totalViews} across ${allContent.length} items`
    )

    // 5. Map most viewed items for the list and chart
    const mostViewed = allContent
      .filter(item => item.title && (parseInt(item.viewCount) || 0) > 0)
      .sort(
        (a, b) => (parseInt(b.viewCount) || 0) - (parseInt(a.viewCount) || 0)
      )
      .map(item => ({
        title: item.title,
        views: parseInt(item.viewCount) || 0,
        type: item.__typename === 'Page' ? 'Page' : 'Post',
        href:
          item.__typename === 'Page' ? `/${item.slug}` : `/posts/${item.slug}`
      }))

    const rawHistory = data?.weeklyHistory || []
    let chartData = rawHistory.map(item => {
      const [day, count] = item.split(':')
      return { name: day, views: parseInt(count) || 0 }
    })

    // FALLBACK: If weekly history is all zeros, show Top Posts instead
    const totalWeeklyViews = chartData.reduce((acc, d) => acc + d.views, 0)

    if (totalWeeklyViews === 0) {
      chartData = mostViewed
        .slice(0, 7)
        .map(item => ({
          name:
            item.title.length > 10
              ? item.title.substring(0, 8) + '..'
              : item.title,
          views: item.views
        }))
        .reverse()
    }

    const lastUpdated = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
    return {
      props: {
        totalPosts,
        totalViews,
        categories,
        mostViewed: mostViewed.slice(0, 6),
        chartData,
        lastUpdated,
        // ADD THIS LINE HERE:
        cookies: req.headers.cookie ?? ''
      }
    }
  } catch (e) {
    console.error('Stats Error:', e)
    return {
      props: {
        totalPosts: 0,
        totalViews: 0,
        categories: [],
        mostViewed: [],
        chartData: [],
        lastUpdated: 'Error',
        // Note: 'data' isn't defined in catch, so I cleaned this up:
        cookies: req.headers.cookie ?? ''
      }
    }
  }
}

export default Statistics
