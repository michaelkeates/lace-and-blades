import { useState } from 'react'
import { Box, Heading, Flex, Text, Portal, useColorModeValue } from '@chakra-ui/react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { scaleLinear } from 'd3-scale'

// 🚀 NATIVE MOUSE-TRACKED PORTAL TOOLTIP (FULLY SYNCED STYLING)
const CustomChartTooltip = ({ 
  active, 
  payload, 
  label, 
  isLightMode, 
  tooltipTextColor, 
  tooltipBorder,
  labelSubColor,
  mousePos,
  maxMetricValue
}) => {
  if (!active || !payload || !payload.length) return null

  // 🚀 SYNCED OPACITY SCALE: Calculates background opacity dynamically matching the Map scale
  const tooltipAlphaScale = scaleLinear()
    .domain([1, maxMetricValue || 10])
    .range([0.25, 0.85])

  const currentMetricValue = payload[0].value || 0
  const currentAlpha = currentMetricValue > 0 ? tooltipAlphaScale(currentMetricValue) : 0.40

  const computedTooltipBg = isLightMode 
    ? `rgba(255, 255, 255, ${currentAlpha})`
    : `rgba(25, 25, 30, ${currentAlpha})`

  return (
    <Portal>
      <Box
        position="absolute"
        zIndex={2000}
        pointerEvents="none"
        top={0}
        left={0}
        // Utilizing the exact same translate3d engine format from VisitorMap
        style={{
          transform: `translate3d(${mousePos.x + 15}px, ${mousePos.y - 85}px, 0)`,
          transition: 'transform 40ms ease-out'
        }}
        minW="140px"
      >
        <Flex
          p={3}
          direction="column"
          border="1px solid"
          borderColor={tooltipBorder}
          borderRadius="12px"
          boxShadow="2xl"
          sx={{
            backdropFilter: 'blur(20px) !important',
            backgroundColor: computedTooltipBg,
            transition: 'background-color 150ms ease-in-out'
          }}
        >
          {/* Label / Date Header */}
          <Text fontSize="10px" fontWeight="bold" color={tooltipTextColor} opacity={0.6} mb={0.5} textTransform="uppercase">
            {label}
          </Text>

          {/* Metric Value */}
          <Text fontSize="14px" fontWeight="extrabold" color="#c966ff">
            {currentMetricValue.toLocaleString()}{' '}
            <Text as="span" fontSize="10px" fontWeight="normal" color={labelSubColor}>
              {payload[0].name}
            </Text>
          </Text>
        </Flex>
      </Box>
    </Portal>
  )
}

const AnalyticsChart = ({ title, data, dataKey, chartFill, isMounted, fallbackText }) => {
  const cardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
  const gradientId = `color_${dataKey}`

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const isLightMode = useColorModeValue(true, false)
  const tooltipTextColor = useColorModeValue('gray.800', 'white')
  const tooltipBorder = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
  const labelSubColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600')

  // Derive dynamic boundaries from array metrics to supply our color/opacity weights
  const maxMetricValue = data && data.length > 0 
    ? Math.max(...data.map(item => item[dataKey] || 0), 10) 
    : 10

  const handleContainerMouseMove = (e) => {
    setMousePos({
      x: e.pageX,
      y: e.pageY
    })
  }

  return (
    <Box
      p={6}
      bg={cardBg}
      backdropFilter="blur(15px)"
      css={{ backdropFilter: 'blur(10px)' }}
      borderRadius="25px"
      mb={10}
      onMouseMove={handleContainerMouseMove} 
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
                cursor={{ stroke: chartFill, strokeWidth: 1, strokeDasharray: '4 4' }}
                wrapperStyle={{ display: 'none' }} 
                content={
                  <CustomChartTooltip 
                    isLightMode={isLightMode}
                    tooltipTextColor={tooltipTextColor}
                    tooltipBorder={tooltipBorder}
                    labelSubColor={labelSubColor}
                    mousePos={mousePos}
                    maxMetricValue={maxMetricValue}
                  />
                }
              />

              <Area
                type="monotone"
                dataKey={dataKey}
                name={dataKey}
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