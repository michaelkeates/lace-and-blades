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

  // Base arrow style — left side (mobile default and right-side desktop cards).
  const arrowBase = {
    content: '""',
    position: 'absolute',
    top: '26px',
    width: '22px',
    height: '22px',
    background: cardBg,
    borderRight: `2px solid ${cardBorder}`,
    borderBottom: `2px solid ${cardBorder}`,
    left: '-13px',
    transform: 'rotate(135deg)',
  }

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

          const h3Node  = cardNode.children?.find(n => isTag(n, 'h3'))
          const h4Node  = cardNode.children?.find(n => isTag(n, 'h4'))
          const pNodes  = cardNode.children?.filter(n => isTag(n, 'p')) || []
          const btnNode = findDeep(cardNode.children, n => isTag(n, 'a') && hasClass(n, 'lb-timeline-button'))

          // CSS :nth-child(odd) = 1,3,5… → 0-indexed 0,2,4… → isLeft when idx % 2 === 0
          const isLeft = idx % 2 === 0

          // Left-side cards flip their arrow to the right at desktop breakpoint.
          const cardSx = isLeft ? {
            '&::after': arrowBase,
            '@media (min-width: 769px)': {
              '&::after': { ...arrowBase, left: 'auto', right: '-13px', transform: 'rotate(-45deg)' }
            }
          } : {
            '&::after': arrowBase
          }

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
                border="8px solid #4b0082"
                borderRadius="full"
                zIndex={2}
              />

              {/* Card — no lb-* class name, so the WordPress <style> selectors cannot bleed in */}
              <Box
                position="relative"
                bg={cardBg}
                border="2px solid"
                borderColor={cardBorder}
                borderRadius="16px"
                p={{ base: '22px', md: '26px 30px' }}
                boxShadow="0 10px 28px rgba(75,0,130,0.08)"
                sx={cardSx}
              >
                {h3Node && (
                  <Heading
                    as="h3"
                    fontSize={{ base: '23px', md: '28px' }}
                    fontWeight={800}
                    color={dateColor}
                    fontFamily="Georgia, serif"
                    lineHeight={1.1}
                    mb={1}
                  >
                    {getTextContent(h3Node)}
                  </Heading>
                )}

                {h4Node && (
                  <Heading
                    as="h4"
                    fontSize={{ base: '18px', md: '20px' }}
                    fontWeight={700}
                    color={titleColor}
                    fontFamily="Georgia, serif"
                    lineHeight={1.25}
                    mb={4}
                  >
                    {getTextContent(h4Node)}
                  </Heading>
                )}

                {pNodes.map((p, pIdx) => (
                  <Text
                    key={pIdx}
                    fontSize={{ base: '15px', md: '16px' }}
                    lineHeight={1.7}
                    color={textColor}
                    fontFamily="Georgia, serif"
                    mb={pIdx < pNodes.length - 1 ? 3 : 0}
                  >
                    {renderNodes(p.children)}
                  </Text>
                ))}

                {btnNode && (
                  <Box mt={3}>
                    <Link
                      href={btnNode.attribs?.href}
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
                      {getTextContent(btnNode)}
                    </Link>
                  </Box>
                )}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
