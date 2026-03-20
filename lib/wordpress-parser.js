// lib/wordpress-parser.js
import { parseDocument } from 'htmlparser2'
import { Box, Button, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

export function parseHtmlContent(html, isMobile = false) {
  const renderedPDFs = new Set()

  // Parse HTML string into DOM nodes
  const dom = parseDocument(html)

  // Recursive renderer
  const renderNodes = (nodes) => {
    return nodes.map((node, idx) => {
      if (!node) return null

      if (node.type === 'text') return node.data

      if (node.type === 'tag') {
        const { name, attribs, children } = node

        // Paragraphs
        if (name === 'p') {
          let textAlign = 'left'
          if (attribs?.class?.includes('has-text-align-center')) textAlign = 'center'
          else if (attribs?.class?.includes('has-text-align-right')) textAlign = 'right'

          return (
            <Box
              as="p"
              textAlign={textAlign}
              mb={3}
              fontSize="20px"
              lineHeight="1.8"
              fontFamily="Georgia, serif"
              key={idx}
            >
              {renderNodes(children)}
            </Box>
          )
        }

        // Headings h1-h6
        if (['h1','h2','h3','h4','h5','h6'].includes(name)) {
          let fontSize = '20px'
          if(name === 'h1') fontSize = '2.8em'
          else if(name === 'h2') fontSize = '2.2em'
          else if(name === 'h3') fontSize = '1.8em'
          else if(name === 'h4') fontSize = '1.5em'
          else if(name === 'h5') fontSize = '1.2em'
          else if(name === 'h6') fontSize = '1em'

          return React.createElement(
            name,
            { 
              key: idx,
              style: {
                fontSize,
                lineHeight: 1.3,
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
                margin: '1.2em 0 0.5em 0'
              }
            },
            renderNodes(children)
          )
        }

        // Images
        if (name === 'img') {
          const src = attribs.src
          const alt = attribs.alt || ''
          const maxWidth = attribs?.class?.includes('size-full')
            ? '100%'
            : attribs?.class?.includes('size-large')
            ? '800px'
            : '500px'

          return (
            <Box textAlign="center" my={4} key={src}>
              <img
                src={src}
                alt={alt}
                style={{ width:'100%', maxWidth, height:'auto', display:'block', margin:'0 auto' }}
              />
            </Box>
          )
        }

        // Figures (images/videos + captions)
        if (name === 'figure') {
          const imgNode = children.find(c => c.name === 'img')
          const videoNode = children.find(c => c.name === 'video')
          const captionNode = children.find(c => c.name === 'figcaption')
          const caption = captionNode ? captionNode.children[0]?.data : null

          if (videoNode) {
            const src = videoNode.attribs.src || videoNode.children?.[0]?.attribs?.src
            const poster = videoNode.attribs?.poster

            return (
              <Box textAlign="center" my={4} key={src}>
                <video
                  controls
                  poster={poster}
                  style={{ width:'100%', maxWidth:'640px', display:'block', margin:'0 auto' }}
                >
                  <source src={src} type="video/mp4" />
                </video>
                {caption && (
                  <Box fontSize="sm" mt={1} color="gray.500" textAlign="center">
                    <em>{caption}</em>
                  </Box>
                )}
              </Box>
            )
          }

          if (imgNode) {
            const src = imgNode.attribs.src
            const alt = imgNode.attribs.alt || ''
            return (
              <Box textAlign="center" my={4} key={src}>
                <img
                  src={src}
                  alt={alt}
                  style={{ width:'100%', maxWidth:'800px', height:'auto', display:'block', margin:'0 auto' }}
                />
                {caption && (
                  <Box fontSize="sm" mt={1} color="gray.500" textAlign="center">
                    <em>{caption}</em>
                  </Box>
                )}
              </Box>
            )
          }
        }

        // Videos outside figure
        if (name === 'video') {
          const src = attribs.src || children?.[0]?.attribs?.src
          const poster = attribs.poster
          return (
            <Box textAlign="center" my={4} key={src}>
              <video
                controls
                poster={poster}
                style={{ width:'100%', maxWidth:'640px', display:'block', margin:'0 auto' }}
              >
                <source src={src} type="video/mp4" />
              </video>
            </Box>
          )
        }

        // Lists
        if (name === 'ul' || name === 'ol') {
          return (
            <Box as={name} pl={6} my={3} key={idx}>
              {renderNodes(children)}
            </Box>
          )
        }

        if (name === 'li') {
          return <Box as="li" mb={1} key={idx}>{renderNodes(children)}</Box>
        }

// WordPress buttons
if (
  name === 'a' &&
  (node.parent?.attribs?.class?.includes('wp-block-button') ||
   node.parent?.parent?.attribs?.class?.includes('wp-block-buttons'))
) {
  const href = attribs.href
  return (
    <Button
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
      fontSize="14px"
      mt={2}
      mb={2}
      bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
      key={idx}
    >
      {renderNodes(children)}
    </Button>
  )
}

        // PDFs
        if (name === 'a' && attribs.href?.toLowerCase().endsWith('.pdf')) {
          const href = attribs.href
          if (renderedPDFs.has(href)) return null
          renderedPDFs.add(href)
          const title = children?.[0]?.data || 'PDF Document'

          return (
            <Box my={4} width="100%" key={href}>
              {!isMobile ? (
                <iframe src={href} width="100%" height="600px" style={{ border:'none' }} />
              ) : (
                <Button as="a" href={href} target="_blank" rel="noopener noreferrer" width="100%" colorScheme="blue">
                  Open PDF
                </Button>
              )}
              <Box mt={2}>
                <a href={href} target="_blank" rel="noopener noreferrer">{title}</a>
              </Box>
            </Box>
          )
        }

        // Fallback
        return <React.Fragment key={idx}>{renderNodes(children)}</React.Fragment>
      }

      return null
    })
  }

  return renderNodes(dom.children)
}