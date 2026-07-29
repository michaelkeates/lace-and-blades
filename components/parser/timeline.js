import { Box, Heading, Text, Link, useColorModeValue } from '@chakra-ui/react'

function isTag(node, name) {
  return node?.type === 'tag' && node.name === name
}

function hasClass(node, cls) {
  return node?.type === 'tag' && (node.attribs?.class || '').includes(cls)
}

function findDeep(nodes, test) {
  for (const n of nodes || []) {
    if (test(n)) return n
    const found = findDeep(n.children, test)
    if (found) return found
  }
  return null
}

function getTextContent(node) {
  if (!node) return ''
  if (node.type === 'text') return node.data || ''
  return (node.children || []).map(getTextContent).join('')
}

export function WPTimeline({ node, renderNodes }) {
  const cardBg    = useColorModeValue('rgba(255,255,255,0.55)', 'rgba(255,255,255,0.06)')
  const cardBorder = useColorModeValue('#9f7aea', '#6b46c1')
  const dateColor  = useColorModeValue('purple.700', 'purple.300')
  const titleColor = useColorModeValue('gray.800',   'gray.100')
  const textColor  = useColorModeValue('gray.700',   'gray.300')
  const dotBg      = useColorModeValue('white',      'gray.800')
  const battleItemBg = useColorModeValue('rgba(255,255,255,0.78)', 'rgba(255,255,255,0.08)')

  const children = node.children || []

  // Collect intro-level paragraphs that appear before lb-vertical-timeline.
  // WordPress can wrap them in lb-journey-intro or place them as bare <p> tags.
  const introParagraphs = []
  let timelineNode = null

  for (const child of children) {
    if (hasClass(child, 'lb-vertical-timeline')) {
      timelineNode = child
      break
    }
    if (hasClass(child, 'lb-journey-inner')) {
      for (const inner of child.children || []) {
        if (hasClass(inner, 'lb-vertical-timeline')) timelineNode = inner
        else if (inner.type === 'tag') introParagraphs.push(inner)
      }
      break
    }
    if ((isTag(child, 'p') || hasClass(child, 'lb-journey-intro')) && getTextContent(child).trim()) {
      introParagraphs.push(child)
    }
  }

  const items = (timelineNode?.children || []).filter(n => hasClass(n, 'lb-timeline-item'))

  // Arrow style factory — accent color varies per card (latest / crisis variants).
  const makeArrow = (color) => ({
    content: '""',
    position: 'absolute',
    top: '26px',
    width: '22px',
    height: '22px',
    background: cardBg,
    borderRight: `2px solid ${color}`,
    borderBottom: `2px solid ${color}`,
    left: '-13px',
    transform: 'rotate(135deg)',
  })

  return (
    <Box width="100%" py={8}>

      {/* Intro paragraphs rendered through the standard parser for correct typography */}
      {introParagraphs.length > 0 && (
        <Box maxW="900px" mx="auto" mb={10} textAlign={{ base: 'left', md: 'center' }}>
          {renderNodes(introParagraphs)}
        </Box>
      )}

      <Box position="relative" maxW="1100px" mx="auto" py={5}>

        {/* Central vertical line */}
        <Box
          position="absolute"
          top={0}
          bottom={0}
          left={{ base: '14px', md: '50%' }}
          transform={{ base: 'none', md: 'translateX(-50%)' }}
          width="6px"
          bg="#4b0082"
          borderRadius="full"
        />

        {items.map((item, idx) => {
          const cardNode = item.children?.find(n => hasClass(n, 'lb-timeline-card'))
          if (!cardNode) return null

          // Variant accents (WordPress: .lb-latest = rose, .lb-court-crisis = crimson)
          const isLatestItem = hasClass(item, 'lb-latest-item')
          const isCrisis     = hasClass(cardNode, 'lb-court-crisis')
          const isLatest     = hasClass(cardNode, 'lb-latest')
          const accent       = isCrisis ? '#8b1e3f' : isLatest ? '#731d3f' : cardBorder
          const dotColor     = isLatestItem || isCrisis || isLatest ? accent : '#4b0082'
          const headingColor = isLatestItem || isCrisis || isLatest ? accent : dateColor
          const arrow        = makeArrow(accent)

          // CSS :nth-child(odd) = 1,3,5… → 0-indexed 0,2,4… → isLeft when idx % 2 === 0
          const isLeft = idx % 2 === 0

          // Left-side cards flip their arrow to the right at desktop breakpoint.
          const cardSx = isLeft ? {
            '&::after': arrow,
            '@media (min-width: 769px)': {
              '&::after': { ...arrow, left: 'auto', right: '-13px', transform: 'rotate(-45deg)' }
            }
          } : {
            '&::after': arrow
          }

          // Render the card body in document order so <ol class="lb-battles-list">
          // keeps its place between paragraphs (the old code only picked h3/h4/p
          // and dropped the list entirely).
          const renderCardBody = () =>
            (cardNode.children || []).map((child, cIdx) => {
              if (child.type !== 'tag') return null

              if (isTag(child, 'h3')) {
                return (
                  <Heading
                    key={cIdx}
                    as="h3"
                    fontSize={{ base: '23px', md: '28px' }}
                    fontWeight={800}
                    color={headingColor}
                    fontFamily="Georgia, serif"
                    lineHeight={1.1}
                    mb={1}
                  >
                    {getTextContent(child)}
                  </Heading>
                )
              }

              if (isTag(child, 'h4')) {
                return (
                  <Heading
                    key={cIdx}
                    as="h4"
                    fontSize={{ base: '18px', md: '20px' }}
                    fontWeight={700}
                    color={titleColor}
                    fontFamily="Georgia, serif"
                    lineHeight={1.25}
                    mb={4}
                  >
                    {renderNodes(child.children)}
                  </Heading>
                )
              }

              // The five battlegrounds — numbered list with counter badges
              if (isTag(child, 'ol') && hasClass(child, 'lb-battles-list')) {
                const lis = (child.children || []).filter(n => isTag(n, 'li'))
                return (
                  <Box
                    key={cIdx}
                    as="ol"
                    listStyleType="none"
                    m={0}
                    mt={5}
                    mb={2}
                    p={0}
                    textAlign="left"
                  >
                    {lis.map((li, liIdx) => (
                      <Box
                        key={liIdx}
                        as="li"
                        position="relative"
                        mb={3}
                        pl="54px"
                        pr="15px"
                        py="13px"
                        bg={battleItemBg}
                        borderLeft="4px solid"
                        borderLeftColor={accent}
                        borderRadius="8px"
                        color={textColor}
                        fontSize={{ base: '14px', md: '15px' }}
                        lineHeight={1.55}
                        fontFamily="Georgia, serif"
                        _before={{
                          content: `"${liIdx + 1}"`,
                          position: 'absolute',
                          top: '12px',
                          left: '13px',
                          display: 'flex',
                          width: '28px',
                          height: '28px',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: accent,
                          color: '#fff',
                          borderRadius: '50%',
                          fontSize: '13px',
                          fontWeight: 800,
                          lineHeight: 1,
                        }}
                      >
                        {renderNodes(li.children)}
                      </Box>
                    ))}
                  </Box>
                )
              }

              if (isTag(child, 'p')) {
                // A paragraph that only wraps the pill CTA
                const btn = findDeep([child], n => isTag(n, 'a') && hasClass(n, 'lb-timeline-button'))
                if (btn) {
                  return (
                    <Box key={cIdx} mt={3}>
                      <Link
                        href={btn.attribs?.href}
                        isExternal
                        display="inline-block"
                        px={4}
                        py={2}
                        bg="#4b0082"
                        color="white"
                        borderRadius="full"
                        fontWeight={800}
                        fontSize="15px"
                        textDecoration="none"
                        _hover={{ bg: '#6a0dad', textDecoration: 'none' }}
                      >
                        {getTextContent(btn)}
                      </Link>
                    </Box>
                  )
                }

                const isIntro = hasClass(child, 'lb-battles-intro')
                return (
                  <Text
                    key={cIdx}
                    fontSize={{ base: '15px', md: '16px' }}
                    lineHeight={1.7}
                    color={textColor}
                    fontFamily="Georgia, serif"
                    fontWeight={isIntro ? 700 : 'normal'}
                    mb={3}
                  >
                    {renderNodes(child.children)}
                  </Text>
                )
              }

              return null
            })

          return (
            <Box
              key={idx}
              position="relative"
              width={{ base: '100%', md: '50%' }}
              ml={{ base: 0, md: isLeft ? 0 : '50%' }}
              pl={{ base: '45px', md: isLeft ? 0 : '45px' }}
              pr={{ base: 0, md: isLeft ? '45px' : 0 }}
              pb="55px"
              textAlign={{ base: 'left', md: isLeft ? 'right' : 'left' }}
            >
              {/* Timeline dot */}
              <Box
                position="absolute"
                top="28px"
                left={{ base: 0,      md: isLeft ? 'auto' : '-14px' }}
                right={{ base: 'auto', md: isLeft ? '-14px' : 'auto' }}
                width="28px"
                height="28px"
                bg={dotBg}
                border="8px solid"
                borderColor={dotColor}
                borderRadius="full"
                zIndex={2}
              />

              {/* Card — no lb-* class name, so the WordPress <style> selectors cannot bleed in */}
              <Box
                position="relative"
                bg={cardBg}
                border="2px solid"
                borderColor={accent}
                borderRadius="16px"
                p={{ base: '22px', md: '26px 30px' }}
                boxShadow="0 10px 28px rgba(75,0,130,0.08)"
                sx={cardSx}
              >
                {renderCardBody()}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
