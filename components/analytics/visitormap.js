import { useState, useRef } from 'react'
import { Box, Heading, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'

// TopoJSON world map data URL
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// BULLETPROOF: Map Country Names directly to 2-letter Alpha-2 ISO codes (All Lowercase Keys)
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
  const tooltipBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 32, 44, 0.95)')
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
  const emptyCountryColor = useColorModeValue('#5a5a5a', '#393939b1')
  
  const containerRef = useRef(null)
  
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  // 🚀 Dynamic offsets state to track which direction the card should render
  const [offsets, setOffsets] = useState({ x: 12, y: 12 })

  const maxViews = Math.max(...countryData.map(c => c.views), 10)
  
  const mapFillScale = scaleLinear()
    .domain([1, maxViews])
    .range(['#ebd3f8', '#b537f2'])

  const mapOpacityScale = scaleLinear()
    .domain([1, maxViews])
    .range([1.0, 0.35])

  const handleMouseMove = (event) => {
    if (!containerRef.current) return
    const bounds = containerRef.current.getBoundingClientRect()
    
    const localX = event.clientX - bounds.left
    const localY = event.clientY - bounds.top
    
    // 🚀 EDGE DETECTION MATH
    // Estimated maximum tooltip width is 150px, height is 80px
    const tooltipWidth = 150
    const tooltipHeight = 80
    
    const offsetX = localX + tooltipWidth > bounds.width ? -(tooltipWidth + 12) : 12
    const offsetY = localY + tooltipHeight > bounds.height ? -(tooltipHeight + 12) : 12

    setOffsets({ x: offsetX, y: offsetY })
    setMousePos({ x: localX, y: localY })
  }

  return (
    <Box
      p={6}
      bg={cardBg}
      backdropFilter="blur(15px)"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="25px"
      mb={10}
      position="relative"
    >
      <Heading as="h3" variant="section-title" mb={2}>
        Geographic Distribution
      </Heading>
      
      <Box ref={containerRef} position="relative" w="100%" h={{ base: '220px', md: '380px' }} overflow="hidden">
        
        {/* ABSOLUTE BOUNDED FLOATING TOOLTIP BOX CONTAINER */}
        <Box 
          position="absolute" 
          zIndex={50} 
          pointerEvents="none" 
          top={0}
          left={0}
          style={{
            // 🚀 Uses dynamic offsets variable to switch translation direction on edge collisions
            transform: `translate3d(${mousePos.x + offsets.x}px, ${mousePos.y + offsets.y}px, 0)`,
            visibility: hoveredCountry ? 'visible' : 'hidden',
            opacity: hoveredCountry ? 1 : 0,
            transition: 'opacity 100ms ease-out, visibility 100ms ease-out'
          }}
          minW="140px"
        >
          {hoveredCountry && (
            <Flex
              p={3}
              bg={tooltipBg} 
              backdropFilter="blur(12px)"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="15px"
              boxShadow="2xl"
              direction="column"
            >
              {/* FLAG & COUNTRY NAME ROW */}
              <Flex align="center" gap={2} mb={1}>
                <Text fontSize="md" lineHeight="1">
                  {getFlagEmoji(hoveredCountry.code)}
                </Text>
                <Text fontSize="12px" fontWeight="bold" noOfLines={1}>
                  {hoveredCountry.name}
                </Text>
              </Flex>

              <Text fontSize="14px" fontWeight="extrabold" color="#b537f2">
                {hoveredCountry.views.toLocaleString()} <Text as="span" fontSize="10px" fontWeight="normal" color="gray.500">visits</Text>
              </Text>
            </Flex>
          )}
        </Box>

        {isMounted && countryData.length > 0 ? (
          <ComposableMap 
            projectionConfig={{ 
              rotate: [-11, 0, 0], 
              center: [0, 10], 
              scale: 115 
            }}
            width={800}
            height={400}
            style={{ width: "100%", height: "100%" }}
          >
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
                          opacity: match ? mapOpacityScale(match.views) : 1 
                        },
                        hover: {
                          fill: match ? '#b537f2' : 'rgba(74, 85, 104, 0.3)',
                          opacity: 1, 
                          outline: 'none',
                          cursor: 'pointer'
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