import { Box, Heading, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AnalyticsChart = ({ title, data, dataKey, chartFill, isMounted, fallbackText }) => {
  const cardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
  const gradientId = `color_${dataKey}`

  return (
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
        {title}
      </Heading>
      <Box h="250px" w="100%" mt={4}>
        {isMounted && data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartFill} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartFill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={borderColor} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'gray', fontSize: dataKey === 'requests' ? 10 : 12 }}
                dy={10}
                padding={dataKey === 'views' ? { left: 20, right: 20 } : undefined}
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
                dataKey={dataKey}
                stroke={chartFill}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Flex h="100%" align="center" justify="center">
            <Text fontSize="sm" opacity={0.5}>
              {fallbackText || 'No data loaded.'}
            </Text>
          </Flex>
        )}
      </Box>
    </Box>
  )
}

export default AnalyticsChart