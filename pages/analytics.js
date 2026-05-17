import { useState, useEffect } from 'react'
import { Container, Heading, Box, SimpleGrid, Text, useColorModeValue, Flex, Divider } from '@chakra-ui/react'
import Bubble from '../components/emoji/analytics'
import { keyframes } from '@emotion/react'

import Layout from '../components/layouts/article'
import Section from '../components/section'

// 🚀 CLEAN ABSOLUTE ALIAS IMPORTS
import StatCard from '@/components/analytics/statcard'
import AnalyticsChart from '@/components/analytics/analyticschart'
import PopularContent from '@/components/analytics/popularcontent'
import TopicDistribution from '@/components/analytics/topicdistribution'
import VisitorMap from '@/components/analytics/visitormap'

import { getApolloClient, getCloudflareClient } from '@/lib/apollo'
import { GET_GLOBAL_STATS, GET_CLOUDFLARE_STATS } from '@/lib/queries'

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
`

const Statistics = ({
  totalPosts = 0,
  totalViews = 0,
  cfPageViews = 0,
  cfChartData = [],
  cfCountryData = [],
  categories = [],
  mostViewed = [],
  chartData = [],
  lastUpdated = ''
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const chartFill = useColorModeValue('#d980fa', '#b537f2')

  return (
    <Layout title="Analytics">
      <Container maxWidth="3xl">
        <Section delay={0.1}>
          <Heading as="h1" size="2xl" textAlign="center" mb={4} fontFamily="CartaMarina">
            Site Analytics
          </Heading>

          <Flex justify="center" align="center" direction="column" mb={10}>
            <Flex align="center" mb={1}>
              <Box animation={`${pulse} 2s infinite`} w="8px" h="8px" bg="green.400" borderRadius="full" mr={2} />
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">
                Live Data Sync Active
              </Text>
            </Flex>
            {lastUpdated && <Text fontSize="10px" opacity={0.6}>Last sync: {lastUpdated}</Text>}
          </Flex>

          <Box flex="1" height="100%" minW="0">
            <Bubble
              text="Wordpress Analytics"
              emoji="📈"
            />
          </Box>

          <Divider marginBottom={4} marginTop={2} />

          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={10}>
            <StatCard label="Total Views" value={totalViews.toLocaleString()} valueColor={chartFill} />
            {/*<StatCard label="Cloudflare Pageviews" value={cfPageViews.toLocaleString()} valueColor="teal.400" />*/}
            <StatCard label="Posts" value={totalPosts} />
            <StatCard label="Categories" value={categories.length} />
          </SimpleGrid>


          <AnalyticsChart
            title="Weekly Views"
            data={chartData}
            dataKey="views"
            chartFill={chartFill}
            isMounted={isMounted}
          />

          <PopularContent mostViewed={mostViewed} chartFill={chartFill} />

          <TopicDistribution categories={categories} totalPosts={totalPosts} chartFill={chartFill} />



          <Divider marginBottom={6} marginTop={2} />

          <Box flex="1" height="100%" minW="0">
            <Bubble
              text="Cloudflare Analytics"
              emoji="📈"
            />
          </Box>

          <Divider marginBottom={4} marginTop={2} />

          <AnalyticsChart
            title="30-Day Network Traffic"
            data={cfChartData}
            dataKey="requests"
            chartFill={chartFill}
            isMounted={isMounted}
            fallbackText="No Cloudflare history data loaded."
          />

          <VisitorMap countryData={cfCountryData} isMounted={isMounted} />

        </Section>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const client = getApolloClient()
  const cfClient = getCloudflareClient()

  let cfPageViews = 0
  let cfChartData = []
  let cfCountryData = []

  const endObj = new Date()
  const startObj = new Date()
  startObj.setDate(endObj.getDate() - 30)

  const startDateString = startObj.toISOString().split('T')[0]
  const endDateString = endObj.toISOString().split('T')[0]

  if (cfClient) {
    try {
      const cfRes = await cfClient.query({
        query: GET_CLOUDFLARE_STATS,
        variables: {
          zoneTag: process.env.NEXT_PUBLIC_CLOUDFLARE_ZONE_ID || '',
          start: startDateString,
          end: endDateString
        },
        fetchPolicy: 'no-cache'
      })

      const zoneDataNode = cfRes?.data?.viewer?.zones?.[0]
      const dailyViewsArray = zoneDataNode?.dailyViews || []
      const countryMapArray = zoneDataNode?.countryViews?.[0]?.sum?.countryMap || []

      // 1. Restore your main dashboard total counters loop
      cfPageViews = dailyViewsArray.reduce((acc, currentDay) => acc + (currentDay?.sum?.pageViews || 0), 0)

      // 2. Restore your main views history chart data mapping
      cfChartData = dailyViewsArray.map(dayNode => {
        const rawDate = new Date(dayNode?.dimensions?.date)
        return {
          name: rawDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          pageViews: dayNode?.sum?.pageViews || 0,
          requests: dayNode?.sum?.requests || 0
        }
      })

      // 🚀 3. Initialize the built-in JavaScript Internationalization Country Name Lookup engine
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

      cfCountryData = countryMapArray.map(item => {
        const countryCode = (item.clientCountryName || 'Unknown').toUpperCase()

        let officialName = countryCode;
        try {
          // Automatically get "China" from "CN", "Russia" from "RU", etc.
          officialName = regionNames.of(countryCode) || countryCode;
        } catch (e) {
          officialName = countryCode;
        }

        // Handle specific map dataset quirks where the map file names are custom
        if (countryCode === 'US') officialName = 'United States of America';

        return {
          code: countryCode,
          views: item.requests || 0,
          name: officialName
        }
      }).sort((a, b) => b.views - a.views)

      console.log('🎉 CLOUDFLARE CONNECTION SUCCESSFUL & COMPILED FOR 30 DAYS')
    } catch (err) {
      console.error('❌ CLOUDFLARE DATA PARSING ERROR:', err.message)
    }
  }

  try {
    const { data } = await client.query({
      query: GET_GLOBAL_STATS,
      fetchPolicy: 'no-cache'
    })

    const postNodes = data?.popularPosts?.nodes || []
    const pageNodes = data?.popularPages?.nodes || []
    const categories = data?.categories?.nodes || []
    const allContent = [...postNodes, ...pageNodes]

    const totalPosts = categories.reduce((acc, cat) => acc + (cat.count || 0), 0)
    const totalViews = allContent.reduce((acc, item) => acc + (parseInt(item.viewCount) || 0), 0)

    console.log(`Debug: Total Views Calculated: ${totalViews} across ${allContent.length} items`)

    const mostViewed = allContent
      .filter(item => item.title && (parseInt(item.viewCount) || 0) > 0)
      .sort((a, b) => (parseInt(b.viewCount) || 0) - (parseInt(a.viewCount) || 0))
      .map(item => ({
        title: item.title,
        views: parseInt(item.viewCount) || 0,
        type: item.__typename === 'Page' ? 'Page' : 'Post',
        href: item.__typename === 'Page' ? `/${item.slug}` : `/posts/${item.slug}`
      }))

    const rawHistory = data?.weeklyHistory || []
    let chartData = rawHistory.map(item => {
      const [day, count] = item.split(':')
      return { name: day, views: parseInt(count) || 0 }
    })

    const totalWeeklyViews = chartData.reduce((acc, d) => acc + d.views, 0)

    if (totalWeeklyViews === 0) {
      chartData = mostViewed
        .slice(0, 7)
        .map(item => ({
          name: item.title.length > 10 ? item.title.substring(0, 8) + '..' : item.title,
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
        cfPageViews,
        cfChartData,
        cfCountryData,
        categories,
        mostViewed: mostViewed.slice(0, 6),
        chartData,
        lastUpdated,
        cookies: req.headers.cookie ?? ''
      }
    }
  } catch (e) {
    console.error('Stats Error:', e)
    return {
      props: {
        totalPosts: 0,
        totalViews: 0,
        cfPageViews: 0,
        cfChartData: [],
        cfCountryData: [],
        categories: [],
        mostViewed: [],
        chartData: [],
        lastUpdated: 'Error',
        cookies: req.headers.cookie ?? ''
      }
    }
  }
}

export default Statistics