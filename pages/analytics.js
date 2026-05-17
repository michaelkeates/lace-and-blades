import { useState, useEffect } from 'react'
import { Container, Heading, Box, SimpleGrid, Text, useColorModeValue, Flex, Divider } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import Head from 'next/head'

import AnalyticsHeaderBubble from '../components/emoji/analytics'
import StatCard from '@/components/analytics/statcard'
import AnalyticsChart from '@/components/analytics/analyticschart'
import PopularContent from '@/components/analytics/popularcontent'
import TopicDistribution from '@/components/analytics/topicdistribution'
import VisitorMap from '@/components/analytics/visitormap'
import TopCountries from '@/components/analytics/topcountries'

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
  cfTotalUniques = 0,
  cfMaxUniques = 0,
  cfMinUniques = 0,
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
    <>
      <Head>
        <title>Analytics - Lace & Blades</title>
      </Head>

      <Box w="100%" pb={10} pt={4}>
        <Container maxWidth="3xl" px={4}>
          
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

          {/* WordPress Dashboard Header Section */}
          <Box flex="1" height="100%" minW="0" mb={4}>
            <AnalyticsHeaderBubble text="Wordpress Analytics" />
          </Box>

          <Divider marginBottom={4} marginTop={2} />

          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5} mb={10}>
            <StatCard label="Total Views" value={totalViews.toLocaleString()} valueColor={chartFill} />
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

          {/* Cloudflare Telemetry Section */}
          <Box flex="1" height="100%" minW="0" mb={4}>
            <AnalyticsHeaderBubble text="Cloudflare Analytics" />
          </Box>

          <Divider marginBottom={4} marginTop={2} />

          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5} mb={10}>
            <StatCard 
              label="Total Unique Visitors" 
              value={cfTotalUniques.toLocaleString()} 
              valueColor={chartFill} 
            />
            <StatCard 
              label="Max Daily Visitors" 
              value={cfMaxUniques.toLocaleString()} 
            />
            <StatCard 
              label="Min Daily Visitors" 
              value={cfMinUniques.toLocaleString()} 
            />
          </SimpleGrid>

          <AnalyticsChart
            title="30-Day Network Traffic"
            data={cfChartData}
            dataKey="requests"
            chartFill={chartFill}
            isMounted={isMounted}
            fallbackText="No Cloudflare history data loaded."
          />

          <VisitorMap countryData={cfCountryData} isMounted={isMounted} />

          <TopCountries countryData={cfCountryData} chartFill={chartFill} />

        </Container>
      </Box>
    </>
  )
}

export async function getServerSideProps({ req }) {
  const client = getApolloClient()
  const cfClient = getCloudflareClient()

  let cfPageViews = 0
  let cfChartData = []
  let cfCountryData = []
  let cfTotalUniques = 0
  let cfMaxUniques = 0
  let cfMinUniques = 0

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

      // Compute total cumulative page views
      cfPageViews = dailyViewsArray.reduce((acc, currentDay) => acc + (currentDay?.sum?.pageViews || 0), 0)

      // 🚀 1. RE-ADDED: Map the raw history nodes into cfChartData for the chart component
      cfChartData = dailyViewsArray.map(dayNode => {
        const rawDate = new Date(dayNode?.dimensions?.date)
        return {
          name: rawDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          pageViews: dayNode?.sum?.pageViews || 0,
          requests: dayNode?.sum?.requests || 0
        }
      })

      // 🚀 2. RE-ADDED: Map country traffic metrics into cfCountryData for the maps and flags list
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
      cfCountryData = countryMapArray.map(item => {
        const countryCode = (item.clientCountryName || 'Unknown').toUpperCase()
        let officialName = countryCode
        try {
          officialName = regionNames.of(countryCode) || countryCode
        } catch (e) {
          officialName = countryCode
        }
        if (countryCode === 'US') officialName = 'United States of America'

        return {
          code: countryCode,
          views: item.requests || 0,
          name: officialName
        }
      }).sort((a, b) => b.views - a.views)

      // 3. Keep Unique Visitor calculations intact
      const dailyUniquesArray = dailyViewsArray.map(dayNode => {
        const count = dayNode?.uniq?.uniques
        return typeof count === 'number' ? count : 0
      })

      cfTotalUniques = dailyUniquesArray.reduce((acc, val) => acc + val, 0)
      cfMaxUniques = dailyUniquesArray.length > 0 ? Math.max(...dailyUniquesArray) : 0
      cfMinUniques = dailyUniquesArray.length > 0 ? Math.min(...dailyUniquesArray) : 0

      console.log('🎉 CLOUDFLARE ARRAYS POPULATED & COMPILED SUCCESSFULLY')
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
        cfTotalUniques,
        cfMaxUniques,
        cfMinUniques,
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
        cfTotalUniques: 0,
        cfMaxUniques: 0,
        cfMinUniques: 0,
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