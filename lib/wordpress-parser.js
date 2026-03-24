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

        // --- 2. WordPress File Block (The Fix for PDFs & Downloads) ---
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
                          maxWidth: '100%', // Forces it to never exceed screen width
                          height: 'auto', // Keeps aspect ratio
                          display: 'block'
                        }}
                        onError={e => {
                          e.target.src = fileUrl.replace(/\.pdf$/i, '.jpg')
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
                  leftIcon={<span>📄</span>}
                  w="100%"
                  maxW="400px"
                  bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                >
                  View / Download PDF
                </Button>
              </Box>
            )
          }
          // Fallback for non-PDF files in a file block
          return (
            <Box key={idx} my={4} textAlign="center">
              <Button
                as="a"
                href={fileUrl}
                download
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              >
                Download {fileTitle}
              </Button>
            </Box>
          )
        }

        // --- 3. Twitter Detection ---
        const isTwitterContainer =
          attribs?.class?.includes('twitter-tweet') ||
          attribs?.class?.includes('wp-block-embed-twitter')
        const tweetUrl = findTwitterUrl([node])

        if (tweetUrl && (isTwitterContainer || name === 'p')) {
          const cleanUrl = tweetUrl.split('?')[0].trim()
          return <TwitterEmbed key={idx} url={cleanUrl} />
        }

        // --- 4. Standard Tag Rendering ---

        // Blockquotes (WordPress Style)
        if (
          name === 'blockquote' ||
          attribs?.class?.includes('wp-block-quote')
        ) {
          return (
            <Box
              key={idx}
              as="blockquote"
              display="block" // Ensures the box takes up space even with one line
              my={10}
              mx={{ base: 4, md: 10 }}
              pl={6}
              pr={4} // Added some right padding for short quotes
              py={4}
              borderLeft="4px solid"
              borderColor={useColorModeValue('purple.300', 'purple.500')}
              fontStyle="italic"
              bg={useColorModeValue('blackAlpha.50', 'whiteAlpha.50')}
              borderRadius="md"
              // Added this to ensure short quotes don't look "squashed"
              minH="50px"
              sx={{
                'p, span, li': {
                  fontSize: '17px !important',
                  lineHeight: '1.6',
                  mb: 4,
                  color: useColorModeValue('gray.700', 'gray.300'),
                  display: 'block' // Forces the internal P to behave
                },
                'p:last-child': {
                  mb: 0
                }
              }}
            >
              {renderNodes(children)}
            </Box>
          )
        }

        // NEW: Figure Handling (Videos AND Images)
        if (name === 'figure') {
          // Check for Video first
          if (attribs?.class?.includes('wp-block-video')) {
            const findVideo = nList => {
              for (let n of nList || []) {
                if (n.name === 'video') return n
                if (n.children) {
                  const deep = findVideo(n.children)
                  if (deep) return deep
                }
              }
              return null
            }

            const videoNode = findVideo(children)
            const captionNode = children?.find(c => c.name === 'figcaption')
            const videoSrc = videoNode?.attribs?.src

            if (videoSrc) {
              return (
                <Box key={idx} my={8} width="100%" textAlign="center">
                  <Box
                    as="video"
                    src={videoSrc}
                    controls
                    borderRadius="lg"
                    boxShadow="2xl"
                    width="100%"
                    maxW="800px"
                    mx="auto"
                    bg="black"
                  >
                    Your browser does not support the video tag.
                  </Box>
                  {captionNode && (
                    <Box
                      as="figcaption"
                      mt={2}
                      fontSize="sm"
                      fontStyle="italic"
                      opacity={0.8}
                      color={useColorModeValue('gray.600', 'gray.400')}
                    >
                      {renderNodes(captionNode.children)}
                    </Box>
                  )}
                </Box>
              )
            }
          }

          // FALLBACK: Image Handling (Existing Logic)
          const findImg = nList => {
            for (let n of nList || []) {
              if (n.name === 'img') return n
              if (n.children) {
                const deep = findImg(n.children)
                if (deep) return deep
              }
            }
            return null
          }
          const imgNode = findImg(children)
          const linkNode = children?.find(c => c.name === 'a')

          if (imgNode) {
            const imgEl = (
              <img
                src={imgNode.attribs.src}
                alt={imgNode.attribs.alt || ''}
                style={{
                  width: imgNode.attribs.style?.includes('width')
                    ? imgNode.attribs.style.split('width:')[1].split(';')[0]
                    : '100%',
                  maxWidth: '800px',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  borderRadius: '8px'
                }}
              />
            )
            return (
              <Box textAlign="center" my={6} key={idx}>
                {linkNode ? (
                  <Box
                    as="a"
                    href={linkNode.attribs.href}
                    target="_blank"
                    display="inline-block"
                  >
                    {imgEl}
                  </Box>
                ) : (
                  imgEl
                )}
              </Box>
            )
          }
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
              textAlign={
                attribs?.class?.includes('has-text-align-center')
                  ? 'center'
                  : 'left'
              }
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
                lineHeight: 1.3,
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
                margin: '1.2em 0 0.5em 0'
              }
            },
            renderNodes(children)
          )
        }

        // Figure (Images & Linked Images)
        if (name === 'figure') {
          const findImg = nList => {
            for (let n of nList || []) {
              if (n.name === 'img') return n
              if (n.children) {
                const deep = findImg(n.children)
                if (deep) return deep
              }
            }
            return null
          }
          const imgNode = findImg(children)
          const linkNode = children?.find(c => c.name === 'a')

          if (imgNode) {
            const imgEl = (
              <img
                src={imgNode.attribs.src}
                alt={imgNode.attribs.alt || ''}
                style={{
                  width: imgNode.attribs.style?.includes('width')
                    ? imgNode.attribs.style.split('width:')[1].split(';')[0]
                    : '100%',
                  maxWidth: '800px',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  borderRadius: '8px'
                }}
              />
            )
            return (
              <Box textAlign="center" my={6} key={idx}>
                {linkNode ? (
                  <Box
                    as="a"
                    href={linkNode.attribs.href}
                    target="_blank"
                    display="inline-block"
                  >
                    {imgEl}
                  </Box>
                ) : (
                  imgEl
                )}
              </Box>
            )
          }
        }

        // Links / Buttons / Manual PDFs
        if (name === 'a') {
          const href = attribs.href
          // Catch specific styled buttons
          if (
            attribs?.class?.includes('wp-block-button__link') ||
            attribs?.class?.includes('css-10d65bq')
          ) {
            return (
              <Box key={idx} display="flex" justifyContent="center" my={4}>
                <Button
                  as="a"
                  href={href}
                  target="_blank"
                  bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                  px={8}
                  /* --- FIX FOR TEXT WRAPPING --- */
                  whiteSpace="normal" // Allows text to move to the next line
                  height="auto" // Lets the button grow vertically to fit the text
                  py={3} // Adds padding to the top and bottom so it looks balanced
                  textAlign="left" // Optional: makes multi-line text easier to read
                >
                  {renderNodes(children)}
                </Button>
              </Box>
            )
          }
          // Fallback PDF handling (if not inside a File Block)
          if (href?.toLowerCase().endsWith('.pdf')) {
            if (excludePdfs || renderedPDFs.has(href)) return null
            renderedPDFs.add(href)
            return (
              <Box my={4} textAlign="center" key={idx}>
                <Button
                  as="a"
                  href={href}
                  target="_blank"
                  bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                >
                  📄 {children?.[0]?.data || 'View PDF'}
                </Button>
              </Box>
            )
          }
          return (
            <Box
              as="a"
              key={idx}
              href={href}
              color="blue.500"
              textDecoration="underline"
            >
              {renderNodes(children)}
            </Box>
          )
        }

        // Columns
        if (attribs?.class?.includes('wp-block-columns')) {
          return (
            <Box
              key={idx}
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              gap={6}
              my={8}
            >
              {renderNodes(children)}
            </Box>
          )
        }
        if (attribs?.class?.includes('wp-block-column')) {
          return (
            <Box key={idx} flex="1" minW="250px">
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

        return (
          <React.Fragment key={idx}>{renderNodes(children)}</React.Fragment>
        )
      }
      return null
    })
  }

  return renderNodes(dom.children)
}
