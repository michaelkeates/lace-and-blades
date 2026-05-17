import { useState, useRef } from 'react'
import { Box, Heading, Flex, Text, Portal, useColorModeValue } from '@chakra-ui/react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const nameToAlpha2 = {
  "afghanistan": "AF", "angola": "AO", "albania": "AL", "united arab emirates": "AE", "argentina": "AR", "armenia": "AM", "antarctica": "AQ", "australia": "AU", "austria": "AO", "azerbaijan": "AZ",
  "burundi": "BI", "belgium": "BE", "benin": "BJ", "burkina faso": "BF", "bangladesh": "BD", "bulgaria": "BG", "bahrain": "BH", "bahamas": "BS", "bosnia and herz.": "BA", "belarus": "BY",
  "belize": "BZ", "bermuda": "BM", "bolivia": "BO", "brazil": "BR", "brunei": "BN", "bhutan": "BT", "botswana": "BW", "central african rep.": "CF", "canada": "CA", "switzerland": "CH",
  "chile": "CL", "china": "CN", "côte d'ivoire": "CI", "ivory coast": "CI", "cameroon": "CM", "dem. rep. congo": "CD", "congo": "CG", "colombia": "CO", "cape verde": "CV", "costa rica": "CR", "cuba": "CU",
  "cyprus": "CY", "czechia": "CZ", "germany": "DE", "djibouti": "DJ", "denmark": "DK", "dominican rep.": "DO", "algeria": "DZ", "ecuador": "EC", "egypt": "EG", "eritrea": "ER",
  "spain": "ES", "estonia": "EE", "ethiopia": "ET", "finland": "FI", "fiji": "FJ", "france": "FR", "gabon": "GA", "united kingdom": "GB", "georgia": "GE", "ghana": "GH",
  "guinea": "GN", "eq. guinea": "GQ", "greece": "GR", "guatemala": "GT", "guyana": "GY", "hong kong": "HK", "honduras": "HN", "croatia": "HR", "haiti": "HT", "hungary": "HU",
  "indonesia": "ID", "india": "IN", "ireland": "IE", "iran": "IR", "iraq": "IQ", "iceland": "IS", "israel": "IL", "italy": "IT", "jamaica": "JM", "jordan": "JO",
  "japan": "JP", "kazakhstan": "KZ", "kenya": "KE", "kyrgyzstan": "KG", "cambodia": "KH", "south korea": "KR", "kuwait": "KW", "laos": "LA", "lebanon": "LB", "liberia": "LR",
  "libya": "LY", "sri lanka": "LK", "lesotho": "LS", "lithuania": "LT", "luxembourg": "LU", "latvia": "LV", "macao": "MO", "morocco": "MA", "moldova": "MD", "madagascar": "MG",
  "mexico": "MX", "mali": "ML", "malta": "MT", "myanmar": "MM", "montenegro": "ME", "mongolia": "MN", "mozambique": "MZ", "mauritania": "MR", "namibia": "NA", "new caledonia": "NC",
  "niger": "NE", "nigeria": "NG", "nicaragua": "NI", "netherlands": "NL", "norway": "NO", "nepal": "NE", "new zealand": "NZ", "oman": "OM", "pakistan": "PK", "panama": "PA",
  "peru": "PE", "philippines": "PH", "papua new guinea": "PG", "poland": "PL", "dem. rep. korea": "KP", "portugal": "PT", "paraguay": "PY", "qatar": "QA", "romania": "RO", "russia": "RU",
  "rwanda": "RW", "saudi arabia": "SA", "sudan": "SD", "senegal": "SN", "singapore": "SG", "solomon is.": "SB", "sierra leone": "SL", "el salvador": "SV", "slovakia": "SK", "slovenia": "SI",
  "sweden": "SE", "swaziland": "SZ", "syria": "SY", "tajikistan": "TJ", "thailand": "TH", "turkmenistan": "TM", "timor-leste": "TL", "trinidad and tobago": "TT", "tunisia": "TN", "turkey": "TR",
  "taiwan": "TW", "tanzania": "TZ", "uganda": "UG", "ukraine": "UA", "uruguay": "UY", "united states of america": "US", "uzbekistan": "UZ", "venezuela": "VE", "vietnam": "VN", "vanuatu": "VU",
  "yemen": "YE", "south africa": "ZA", "zambia": "ZM", "zimbabwe": "ZW", "somaliland": "SO", "somalia": "SO", "kosovo": "XK", "w. sahara": "EH", "falkland is.": "FK", "puerto rico": "PR"
}

const getFlagEmoji = (alpha2Code) => {
  if (!alpha2Code || alpha2Code === 'N/A') return '🌐'
  try {
    const codePoints = alpha2Code
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  } catch (e) {
    return '🌐'
  }
}

const VisitorMap = ({ countryData = [], isMounted }) => {
  const cardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const emptyCountryColor = useColorModeValue('rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0.04)')

  const isLightMode = useColorModeValue(true, false)
  const tooltipTextColor = useColorModeValue('gray.800', 'white')
  const tooltipBorder = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
  const labelSubColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600')
  
  const containerRef = useRef(null)
  
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [offsets, setOffsets] = useState({ x: 12, y: 12 })

  const maxViews = Math.max(...countryData.map(c => c.views), 10)
  
  const mapFillScale = scaleLinear()
    .domain([1, maxViews])
    .range(['#e7baff', '#a21ae7'])

  const mapOpacityScale = scaleLinear()
    .domain([1, maxViews])
    .range([0.45, 0.95]) // Tweak alpha directly in the SVG mapping matrix layer

  const tooltipAlphaScale = scaleLinear()
    .domain([1, maxViews])
    .range([0.25, 0.85])

  const handleMouseMove = (event) => {
    if (!containerRef.current) return
    const bounds = containerRef.current.getBoundingClientRect()
    
    const screenX = event.pageX
    const screenY = event.pageY
    
    const localX = event.clientX - bounds.left
    const localY = event.clientY - bounds.top
    
    const isMobileDevice = window.innerWidth < 768
    const tooltipWidth = isMobileDevice ? 110 : 150
    const tooltipHeight = isMobileDevice ? 65 : 80
    
    const offsetX = localX + tooltipWidth > bounds.width ? -(tooltipWidth + 12) : 12
    const offsetY = localY + tooltipHeight > bounds.height ? -(tooltipHeight + 12) : 12

    setOffsets({ x: offsetX, y: offsetY })
    setMousePos({ x: screenX, y: screenY })
  }

  const currentAlpha = hoveredCountry?.views && hoveredCountry.views > 0
    ? tooltipAlphaScale(hoveredCountry.views)
    : 0.40

  const computedTooltipBg = isLightMode 
    ? `rgba(255, 255, 255, ${currentAlpha})`
    : `rgba(25, 25, 30, ${currentAlpha})`

  return (
    <Box
      p={{ base: 3, md: 6 }}
      bg={cardBg}
      backdropFilter="blur(15px)"
      borderRadius="25px"
      mb={10}
      position="relative"
    >
      <Heading as="h3" variant="section-title" mb={2} px={{ base: 3, md: 0 }}>
        Web Traffic Requests by Country
      </Heading>
      
      <Box ref={containerRef} position="relative" w="100%" h={{ base: '240px', md: '400px' }} overflow="hidden">
        
        <Portal>
          <Box 
            position="absolute" 
            zIndex={2000} 
            pointerEvents="none" 
            top={0}
            left={0}
            style={{
              transform: `translate3d(${mousePos.x + offsets.x}px, ${mousePos.y + offsets.y}px, 0)`,
              visibility: hoveredCountry ? 'visible' : 'hidden',
              opacity: hoveredCountry ? 1 : 0,
              transition: 'opacity 100ms ease-out, visibility 100ms ease-out'
            }}
            minW={{ base: "110px", md: "140px" }}
          >
            {hoveredCountry && (
              <Flex
                p={{ base: 2, md: 3 }}
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
                <Flex align="center" gap={{ base: 1, md: 2 }} mb={0.5}>
                  <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1">
                    {getFlagEmoji(hoveredCountry.code)}
                  </Text>
                  <Text fontSize={{ base: "10px", md: "12px" }} fontWeight="bold" color={tooltipTextColor} noOfLines={1}>
                    {hoveredCountry.name}
                  </Text>
                </Flex>

                <Text fontSize={{ base: "12px", md: "14px" }} fontWeight="extrabold" color="#c966ff">
                  {hoveredCountry.views.toLocaleString()}{' '}
                  <Text as="span" fontSize={{ base: "8px", md: "10px" }} fontWeight="normal" color={labelSubColor}>
                    visits
                  </Text>
                </Text>
              </Flex>
            )}
          </Box>
        </Portal>

        {isMounted && countryData.length > 0 ? (
          <ComposableMap 
            projectionConfig={{ 
              rotate: [-11, 0, 0], 
              center: [0, 0], 
              scale: 155 
            }}
            width={800}
            height={400}
            style={{ width: "100%", height: "100%", transform: "scale(1.05)" }}
          >
            {/* 🚀 INJECT NATIVE SVG FILTER FOR DETACHED GLASS BLURRING */}
            <defs>
              <filter id="svg-glass-blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const countryName = geo.properties.name
                  const fallbackAlpha2 = nameToAlpha2[countryName.toLowerCase()] || 'N/A'
                  
                  const match = countryData.find(c => 
                    (c.code && c.code.toUpperCase() === fallbackAlpha2) ||
                    (c.name && c.name.toLowerCase() === countryName.toLowerCase())
                  )

                  const activeCountryCode = match?.code || fallbackAlpha2

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={match ? mapFillScale(match.views) : emptyCountryColor}
                      stroke={cardBg}
                      strokeWidth={0.5}
                      
                      onMouseEnter={(e) => {
                        handleMouseMove(e)
                        if (match) {
                          setHoveredCountry({
                            ...match,
                            code: activeCountryCode
                          })
                        } else {
                          setHoveredCountry({ 
                            name: countryName, 
                            views: 0, 
                            code: activeCountryCode 
                          })
                        }
                      }}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={() => setHoveredCountry(null)}
                      
                      style={{
                        default: { 
                          outline: 'none', 
                          transition: 'opacity 200ms, fill 200ms',
                          // Apply our dynamic range opacity to standard states
                          opacity: match ? mapOpacityScale(match.views) : 1,
                          filter: match ? 'url(#svg-glass-blur)' : 'none' // Apply glass filter safely to vectors
                        },
                        hover: {
                          fill: match ? '#b537f2' : 'rgba(74, 85, 104, 0.15)',
                          opacity: 1, 
                          outline: 'none',
                          cursor: 'pointer',
                          filter: 'none' // Remove blur on focus hover to reveal crisp lines
                        },
                        pressed: { 
                          outline: 'none',
                          opacity: match ? mapOpacityScale(match.views) : 1 
                        }
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>
        ) : (
          <Flex h="100%" align="center" justify="center">
            <Text fontSize="sm" opacity={0.5}>Loading telemetry maps...</Text>
          </Flex>
        )}
      </Box>
    </Box>
  )
}

export default VisitorMap