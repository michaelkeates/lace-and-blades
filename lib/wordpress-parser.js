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

export function parseHtmlContent(html, isMobile = false, excludePdfs = false) {
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

        // --- 2. WordPress File Block ---
        if (attribs?.class?.includes('wp-block-file')) {
          const objectNode = children?.find(c => c.name === 'object')
          const linkNode = children?.find(
            c => c.name === 'a' && c.attribs?.href
          )

          const fileUrl =
            objectNode?.attribs?.data || linkNode?.attribs?.href || ''
          const fileTitle = linkNode?.children?.[0]?.data || 'Download File'

          if (fileUrl.toLowerCase().endsWith('.pdf')) {
            if (excludePdfs) return null
            if (renderedPDFs.has(fileUrl)) return null
            renderedPDFs.add(fileUrl)

            const thumbnailUrl = fileUrl.replace(/\.pdf$/i, '-pdf.jpg')

            return (
              <Box key={idx} my={8} width="100%" textAlign="center">
                <Box
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="xl"
                  bg="blackAlpha.50"
                  mb={4}
                >
                  {isMobile ? (
                    <Box
                      width="100%"
                      maxW="100%"
                      overflow="hidden"
                      borderRadius="md"
                    >
                      <img
                        src={thumbnailUrl}
                        alt={fileTitle}
                        style={{
                          width: '100%',
                          maxWidth: '100%',
                          height: 'auto',
                          display: 'block'
                        }}
                      />
                    </Box>
                  ) : (
                    <object
                      data={fileUrl}
                      type="application/pdf"
                      width="100%"
                      height="600px"
                    >
                      <Box p={4}>Preview not supported.</Box>
                    </object>
                  )}
                </Box>
                <Button
                  as="a"
                  href={fileUrl}
                  target="_blank"
                  download
                  w="100%"
                  maxW="400px"
                  bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                >
                  View / Download PDF
                </Button>
              </Box>
            )
          }
        }

        // --- 3. Twitter Detection ---
        const isTwitterContainer =
          attribs?.class?.includes('twitter-tweet') ||
          attribs?.class?.includes('wp-block-embed-twitter')
        const tweetUrl = findTwitterUrl([node])
        if (tweetUrl && (isTwitterContainer || name === 'p')) {
          return <TwitterEmbed key={idx} url={tweetUrl.split('?')[0].trim()} />
        }

        // --- 4. Standard Tag Rendering (FIXED PLACEMENT) ---

        if (name === 'br') return <br key={idx} />

        // HANDLE SPANS (HIGHLIGHTS)
        if (name === 'span') {
          return (
            <Box
              as="span"
              key={idx}
              style={{
                backgroundColor: attribs?.style?.includes('background-color')
                  ? attribs.style
                      .split('background-color:')[1]
                      .split(';')[0]
                      .trim()
                  : 'transparent',
                color: attribs?.style?.includes('color')
                  ? attribs.style.split('color:')[1].split(';')[0].trim()
                  : 'inherit'
              }}
              // Specific WP Classes for highlights
              {...(attribs?.class?.includes(
                'has-luminous-vivid-amber-background-color'
              ) && { bg: '#fcb900' })}
              {...(attribs?.class?.includes(
                'has-vivid-cyan-blue-background-color'
              ) && { bg: '#0693e3' })}
            >
              {renderNodes(children)}
            </Box>
          )
        }

        // HANDLE MARK (WORDPRESS HIGHLIGHTS)
        if (name === 'mark') {
          return (
            <Box
              as="mark"
              key={idx}
              display="inline"
              // This covers the default yellow highlight
              bg="yellow.200"
              px="2px"
              borderRadius="sm"
              style={{
                // If WordPress sends a specific color in the style attribute, use it
                backgroundColor: attribs?.style?.includes('background-color')
                  ? attribs.style
                      .split('background-color:')[1]
                      .split(';')[0]
                      .trim()
                  : undefined,
                color: attribs?.style?.includes('color')
                  ? attribs.style.split('color:')[1].split(';')[0].trim()
                  : undefined
              }}
              // Map specific WordPress classes to actual colors if needed
              {...(attribs?.class?.includes('has-accent-3-color') && {
                color: '#yourAccentColor'
              })}
            >
              {renderNodes(children)}
            </Box>
          )
        }

        // HANDLE BOLD
        if (name === 'strong' || name === 'b') {
          return (
            <Box as="strong" key={idx} fontWeight="bold" display="inline">
              {renderNodes(children)}
            </Box>
          )
        }

        // Paragraphs
        if (name === 'p') {
          return (
            <Box
              as="p"
              key={idx}
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
          const sizes = { h1: '2.8em', h2: '2.2em', h3: '1.8em', h4: '1.5em' }
          return React.createElement(
            name,
            {
              key: idx,
              style: {
                fontSize: sizes[name] || '1.2em',
                fontWeight: 700,
                margin: '1.2em 0 0.5em 0'
              }
            },
            renderNodes(children)
          )
        }

        // Blockquotes
        if (
          name === 'blockquote' ||
          attribs?.class?.includes('wp-block-quote')
        ) {
          return (
            <Box
              key={idx}
              as="blockquote"
              my={10}
              pl={6}
              borderLeft="4px solid"
              borderColor="purple.300"
              fontStyle="italic"
              bg={useColorModeValue('blackAlpha.50', 'whiteAlpha.50')}
            >
              {renderNodes(children)}
            </Box>
          )
        }

        // Links / Buttons
        if (name === 'a') {
          if (attribs?.class?.includes('wp-block-button__link')) {
            return (
              <Box key={idx} display="flex" justifyContent="center" my={4}>
                <Button
                  as="a"
                  href={attribs.href}
                  target="_blank"
                  whiteSpace="normal"
                  height="auto"
                  py={3}
                >
                  {renderNodes(children)}
                </Button>
              </Box>
            )
          }
          return (
            <Box
              as="a"
              key={idx}
              href={attribs.href}
              color="blue.500"
              textDecoration="underline"
            >
              {renderNodes(children)}
            </Box>
          )
        }

        // Fallback for everything else
        return (
          <React.Fragment key={idx}>{renderNodes(children)}</React.Fragment>
        )
      }
      return null
    })
  }

  return renderNodes(dom.children)
}
