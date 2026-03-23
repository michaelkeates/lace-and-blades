import { parseDocument } from 'htmlparser2'
import { Box, Button, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import TwitterEmbed from '../components/embeds/TwitterEmbed'

/**
 * Helper to recursively find a Twitter URL inside a node's children.
 */
const findTwitterUrl = nodes => {
  for (let n of nodes || []) {
    if (n.name === 'a' && n.attribs?.href?.includes('twitter.com/')) {
      return n.attribs.href
    }
    if (n.children) {
      const deep = findTwitterUrl(n.children)
      if (deep) return deep
    }
  }
  return null
}

export function parseHtmlContent(html, isMobile = false) {
  if (!html) return null

  const renderedPDFs = new Set()
  const dom = parseDocument(html)

  const renderNodes = nodes => {
    return nodes.map((node, idx) => {
      if (!node) return null

      // --- 1. Text Nodes ---
      if (node.type === 'text') {
        if (node.data.includes('twitter.com/status/')) return null
        return node.data
      }

      if (node.type === 'tag') {
        const { name, attribs, children } = node

        // --- 2. PRIORITY: Check for WP Buttons FIRST ---
        if (name === 'a' && attribs?.class?.includes('wp-block-button__link')) {
          return (
            <Box
              key={idx}
              display="flex"
              justifyContent="center"
              w="100%"
              my={4}
            >
              <Button
                as="a"
                href={attribs.href}
                target="_blank"
                rel="noopener noreferrer"
                fontSize="14px"
                boxShadow="0px 0px 12px rgba(0,0,0,0.05)"
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                // Removed margins here since the Box wrapper handles spacing
              >
                {renderNodes(children)}
              </Button>
            </Box>
          )
        }

        // --- WordPress File Block (Download Buttons) ---
        if (attribs?.class?.includes('wp-block-file')) {
          // We find the primary link to get the URL and the filename
          const downloadLink = children?.find(
            c => c.name === 'a' && c.attribs?.href
          )
          const fileUrl = downloadLink?.attribs?.href || '#'
          const fileName = downloadLink?.children?.[0]?.data || 'Download File'

          return (
            <Box key={idx} my={6} display="flex" justifyContent="center">
              <Button
                as="a"
                href={fileUrl}
                download
                target="_blank"
                leftIcon={<span>💾</span>}
                bg={useColorModeValue('whiteAlpha.800', 'whiteAlpha.200')}
                boxShadow="0px 4px 12px rgba(0,0,0,0.08)"
                _hover={{
                  bg: useColorModeValue('white', 'whiteAlpha.300'),
                  transform: 'translateY(-2px)'
                }}
                transition="all 0.2s"
                px={10}
                py={6}
                height="auto"
                fontSize="16px"
                fontFamily="Georgia, serif"
              >
                {fileName}
              </Button>
            </Box>
          )
        }

        // --- 3. Twitter Detection (Only if NOT a button) ---
        const isTwitterContainer =
          attribs?.class?.includes('twitter-tweet') ||
          attribs?.class?.includes('wp-block-embed-twitter')

        const tweetUrl = findTwitterUrl([node])

        if (tweetUrl && (isTwitterContainer || name === 'p')) {
          const cleanUrl = tweetUrl.split('?')[0].trim()
          return <TwitterEmbed key={idx} url={cleanUrl} />
        }

        // --- 4. Standard Tag Rendering ---

        // Paragraphs
        if (name === 'p') {
          let textAlign = 'left'
          if (attribs?.class?.includes('has-text-align-center'))
            textAlign = 'center'
          else if (attribs?.class?.includes('has-text-align-right'))
            textAlign = 'right'

          return (
            <Box
              as="p"
              key={idx}
              textAlign={textAlign}
              mb={3}
              fontSize="20px"
              lineHeight="1.8"
              fontFamily="Georgia, serif"
            >
              {renderNodes(children)}
            </Box>
          )
        }

        // Headings
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(name)) {
          const sizes = {
            h1: '2.8em',
            h2: '2.2em',
            h3: '1.8em',
            h4: '1.5em',
            h5: '1.2em',
            h6: '1em'
          }
          return React.createElement(
            name,
            {
              key: idx,
              style: {
                fontSize: sizes[name] || '20px',
                lineHeight: 1.3,
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
                margin: '1.2em 0 0.5em 0'
              }
            },
            renderNodes(children)
          )
        }

        // Figures (Captions support)
        if (name === 'figure') {
          const imgNode = children?.find(c => c.name === 'img')
          const captionNode = children?.find(c => c.name === 'figcaption')
          const caption = captionNode ? renderNodes(captionNode.children) : null

          if (imgNode) {
            return (
              <Box textAlign="center" my={4} key={imgNode.attribs.src}>
                <img
                  src={imgNode.attribs.src}
                  alt={imgNode.attribs.alt || ''}
                  style={{
                    width: '100%',
                    maxWidth: '800px',
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
                {caption && (
                  <Box fontSize="sm" mt={1} color="gray.500">
                    <em>{caption}</em>
                  </Box>
                )}
              </Box>
            )
          }
        }

        // Links / PDFs
        if (name === 'a') {
          const href = attribs.href
          const title = children?.[0]?.data || 'Link'

          // PDF handling
          if (
            attribs?.class?.includes('wp-block-file__button') ||
            href?.toLowerCase().endsWith('.pdf')
          ) {
            if (renderedPDFs.has(href)) return null
            renderedPDFs.add(href)

            // Generate the thumbnail URL
            // Example: file.pdf -> file-pdf.jpg
            const thumbnailUrl = href.replace(/\.pdf$/i, '-pdf.jpg')

            return (
              <Box my={4} width="100%" key={href} textAlign="center">
                {/* MOBILE: Show Image Thumbnail */}
                {isMobile ? (
                  <Box
                    mb={2}
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow="md"
                  >
                    <img
                      src={thumbnailUrl}
                      alt={title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                      onError={e => {
                        // Fallback: If the -pdf.jpg doesn't exist, try just .jpg
                        if (!e.target.src.endsWith('.pdf.jpg')) {
                          e.target.src = href.replace(/\.pdf$/i, '.jpg')
                        } else {
                          e.target.style.display = 'none' // Hide if both fail
                        }
                      }}
                    />
                  </Box>
                ) : (
                  /* DESKTOP: Show PDF Embed */
                  <object
                    data={href}
                    type="application/pdf"
                    width="100%"
                    height="600px"
                    style={{ border: 'none' }}
                  >
                    <span>Your browser does not support inline PDFs.</span>
                  </object>
                )}

                {/* Always show the Download/View Button */}
                <Button
                  as="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  mt={2}
                  width="100%"
                  boxShadow="0px 0px 12px rgba(0,0,0,0.05)"
                  fontSize="14px"
                  bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                >
                  📄 {title}
                </Button>
              </Box>
            )
          }

          // Regular Link (If it's a twitter link that escaped the container logic)
          if (href?.includes('twitter.com/status/')) {
            return <TwitterEmbed key={idx} url={href.split('?')[0]} />
          }

          return (
            <Box
              as="a"
              href={href}
              key={idx}
              color="blue.500"
              textDecoration="underline"
            >
              {renderNodes(children)}
            </Box>
          )
        }

        // Lists
        if (name === 'ul' || name === 'ol')
          return (
            <Box as={name} pl={6} my={3} key={idx}>
              {renderNodes(children)}
            </Box>
          )
        if (name === 'li')
          return (
            <Box as="li" mb={1} key={idx}>
              {renderNodes(children)}
            </Box>
          )

        // --- 5. Layout / Columns ---

        // The Outer Container (Flexbox)
        if (attribs?.class?.includes('wp-block-columns')) {
          return (
            <Box
              key={idx}
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }} // Stack on mobile, side-by-side on desktop
              gap={6}
              my={8}
              alignItems="flex-start"
            >
              {renderNodes(children)}
            </Box>
          )
        }

        // Individual Column
        if (attribs?.class?.includes('wp-block-column')) {
          return (
            <Box
              key={idx}
              flex="1" // Share space equally
              minW="250px" // Don't let columns get too squished
              w="100%"
            >
              {renderNodes(children)}
            </Box>
          )
        }

        // Fallback
        return (
          <React.Fragment key={idx}>{renderNodes(children)}</React.Fragment>
        )
      }
      return null
    })
  }

  return renderNodes(dom.children)
}
