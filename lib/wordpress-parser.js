import { parseDocument } from 'htmlparser2'
import {
  Box,
  Button,
  useColorModeValue,
  Divider,
  Text,
  Image,
  SimpleGrid
} from '@chakra-ui/react'
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

  const renderNodes = (nodes, inColumn = false) => {
    return nodes.map((node, idx) => {
      if (!node) return null

      // --- 1. Text Nodes ---
      if (node.type === 'text') {
        if (node.data.includes('twitter.com/status/')) return null
        return node.data
      }

      if (node.type === 'tag') {
        const { name, attribs, children } = node

        // --- 2. WordPress Layout Handling (Columns) ---
        if (attribs?.class?.includes('wp-block-columns')) {
          return (
            <SimpleGrid 
              key={idx} 
              columns={isMobile ? 1 : children.filter(c => c.name === 'div').length || 2} 
              spacing={10} 
              my={8}
              alignItems="start"
            >
              {renderNodes(children, true)}
            </SimpleGrid>
          )
        }

        if (attribs?.class?.includes('wp-block-column')) {
          return (
            <Box key={idx} width="100%">
              {renderNodes(children, true)}
            </Box>
          )
        }

        // --- 3. WordPress File Block (PDFs) ---
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

        // --- 4. Twitter Detection ---
        const isTwitterContainer =
          attribs?.class?.includes('twitter-tweet') ||
          attribs?.class?.includes('wp-block-embed-twitter')
        const tweetUrl = findTwitterUrl([node])
        if (tweetUrl && (isTwitterContainer || name === 'p')) {
          return <TwitterEmbed key={idx} url={tweetUrl.split('?')[0].trim()} />
        }

        // --- 5. Video Handling ---
        if (name === 'video') {
          return (
            <Box
              key={idx}
              as="video"
              controls
              src={attribs.src}
              width="100%"
              borderRadius="lg"
              boxShadow="md"
              my={4}
            />
          )
        }

        // --- 6. Image Handling ---
        if (name === 'img') {
          return (
            <Box
              key={idx}
              display="flex"
              // Always center the image block
              justifyContent="center"
              width="100%"
              my={inColumn ? 2 : 6}
            >
              <Image
                src={attribs.src}
                alt={attribs.alt || ''}
                width="128px"
                height="128px"
                maxW="100%"
                borderRadius="md"
                objectFit="contain"
              />
            </Box>
          )
        }

        if (name === 'figcaption') {
          return (
            <Text
              key={idx}
              fontSize="sm"
              textAlign="center"
              color={useColorModeValue('gray.600', 'gray.400')}
              mt={-2}
              mb={6}
              fontStyle="italic"
            >
              {renderNodes(children, inColumn)}
            </Text>
          )
        }

        // --- 7. Standard Tag Rendering ---

        if (name === 'br') return <br key={idx} />

        if (name === 'hr' || attribs?.class?.includes('wp-block-separator')) {
          return (
            <Divider
              key={idx}
              my={10}
              borderColor={useColorModeValue(
                'blackAlpha.400',
                'whiteAlpha.400'
              )}
            />
          )
        }

        if (name === 'mark') {
          const styleStr = attribs?.style || ''
          const hexMatch = styleStr.match(/#[a-fA-F0-9]{3,6}/)
          const rgbaMatch = styleStr.match(/rgba?\([^)]+\)/)
          const themeFallback = useColorModeValue('#1A202C', '#FFFFFF')
          const finalColor = hexMatch ? hexMatch[0] : rgbaMatch ? rgbaMatch[0] : themeFallback

          return (
            <Box
              as="mark"
              key={idx}
              display="inline"
              sx={{
                background: 'transparent !important',
                color: `${finalColor} !important`,
                fontWeight: 'bold !important',
                fontSize: 'inherit',
                visibility: 'visible !important',
                opacity: '1 !important'
              }}
            >
              {renderNodes(children, inColumn)}
            </Box>
          )
        }

        if (name === 'strong' || name === 'b') {
          return (
            <Box as="strong" key={idx} fontWeight="bold" display="inline">
              {renderNodes(children, inColumn)}
            </Box>
          )
        }

        if (name === 'p') {
          return (
            <Box
              as="p"
              key={idx}
              mb={4}
              fontSize="20px"
              lineHeight="1.8"
              fontFamily="Georgia, serif"
            >
              {renderNodes(children, inColumn)}
            </Box>
          )
        }

        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(name)) {
          const sizes = { h1: '2.8em', h2: '2.2em', h3: '1.8em' }
          return (
            <Box
              as={name}
              key={idx}
              fontSize={sizes[name] || '1.2em'}
              fontWeight={700}
              fontFamily="Georgia, serif"
              my="1.2em"
              color="inherit"
            >
              {renderNodes(children, inColumn)}
            </Box>
          )
        }

        if (name === 'blockquote' || attribs?.class?.includes('wp-block-quote')) {
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
              py={4}
            >
              {renderNodes(children, inColumn)}
            </Box>
          )
        }

        if (name === 'a') {
          if (attribs?.class?.includes('wp-block-button__link')) {
            return (
              <Box key={idx} display="flex" justifyContent={inColumn ? "flex-start" : "center"} my={4}>
                <Button
                  as="a"
                  href={attribs.href}
                  target="_blank"
                  whiteSpace="normal"
                  height="auto"
                  py={3}
                  colorScheme="blue"
                >
                  {renderNodes(children, inColumn)}
                </Button>
              </Box>
            )
          }
          const hasImage = children?.some(c => c.name === 'img')
          
          const linkElement = (
            <Box
              as="a"
              key={idx}
              href={attribs.href}
              color="blue.500"
              textDecoration="underline"
              display={hasImage ? 'inline-block' : 'inline'}
              verticalAlign="middle"
              target={attribs.target}
              rel={attribs.rel}
            >
              {renderNodes(children, inColumn)}
            </Box>
          )

          // If it's an image link, wrap it in a centered flex container
          if (hasImage) {
            return (
              <Box key={`wrap-${idx}`} display="flex" justifyContent="center" width="100%">
                {linkElement}
              </Box>
            )
          }

          return linkElement
        }

        // FALLBACK
        return (
          <React.Fragment key={idx}>{renderNodes(children, inColumn)}</React.Fragment>
        )
      }
      return null
    })
  }

  return renderNodes(dom.children)
}