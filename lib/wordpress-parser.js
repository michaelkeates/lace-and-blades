// lib/wordpress-parser.js
import { parseDocument } from 'htmlparser2'
import { Box, Button, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

export function parseHtmlContent(html, isMobile = false) {
  const renderedPDFs = new Set()

  const dom = parseDocument(html)

  const renderNodes = nodes => {
    return nodes.map((node, idx) => {
      if (!node) return null
      if (node.type === 'text') return node.data

      if (node.type === 'tag') {
        const { name, attribs, children } = node

        // --- Paragraphs ---
        if (name === 'p') {
          let textAlign = 'left'
          if (attribs?.class?.includes('has-text-align-center'))
            textAlign = 'center'
          else if (attribs?.class?.includes('has-text-align-right'))
            textAlign = 'right'

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

        // --- Headings ---
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

        // --- Images ---
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
                style={{
                  width: '100%',
                  maxWidth,
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </Box>
          )
        }

        // --- Figures ---
        if (name === 'figure') {
          const imgNode = children.find(c => c.name === 'img')
          const videoNode = children.find(c => c.name === 'video')
          const captionNode = children.find(c => c.name === 'figcaption')
          const caption = captionNode ? captionNode.children[0]?.data : null

          if (videoNode) {
            const src =
              videoNode.attribs.src || videoNode.children?.[0]?.attribs?.src
            const poster = videoNode.attribs?.poster

            return (
              <Box textAlign="center" my={4} key={src}>
                <video
                  controls
                  poster={poster}
                  style={{
                    width: '100%',
                    maxWidth: '640px',
                    display: 'block',
                    margin: '0 auto'
                  }}
                >
                  <source src={src} type="video/mp4" />
                </video>

                {caption && (
                  <Box fontSize="sm" mt={1} color="gray.500">
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

        // --- Videos ---
        if (name === 'video') {
          const src = attribs.src || children?.[0]?.attribs?.src
          const poster = attribs.poster

          return (
            <Box textAlign="center" my={4} key={src}>
              <video
                controls
                poster={poster}
                style={{
                  width: '100%',
                  maxWidth: '640px',
                  display: 'block',
                  margin: '0 auto'
                }}
              >
                <source src={src} type="video/mp4" />
              </video>
            </Box>
          )
        }

        // --- Lists ---
        if (name === 'ul' || name === 'ol') {
          return (
            <Box as={name} pl={6} my={3} key={idx}>
              {renderNodes(children)}
            </Box>
          )
        }

        if (name === 'li') {
          return (
            <Box as="li" mb={1} key={idx}>
              {renderNodes(children)}
            </Box>
          )
        }

        // --- Links / PDFs / Buttons ---
        if (name === 'a') {
          const href = attribs.href
          const title = children?.[0]?.data || 'Open PDF'

          // --- PDF handling ---
          if (
            attribs?.class?.includes('wp-block-file__button') ||
            href?.toLowerCase().endsWith('.pdf')
          ) {
            if (renderedPDFs.has(href)) return null
            renderedPDFs.add(href)

            // ✅ MOBILE FIX
            if (isMobile) {
              const thumbnailSrc = `${href}-thumbnail.jpg`

              return (
                <Box my={4} width="100%" key={href} textAlign="center">
                  {/* Optional thumbnail */}
                  <img
                    src={thumbnailSrc}
                    alt={title}
                    style={{
                      width: '100%',
                      maxWidth: '600px',
                      height: 'auto'
                    }}
                    onError={e => {
                      e.target.style.display = 'none'
                    }}
                  />

                  {/* Always-visible button */}
                  <Button
                    as="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    width="100%"
                    mt={2}
                    boxShadow="0px 0px 12px rgba(0,0,0,0.05)"
                    fontSize="14px"
                    bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                  >
                    📄 {title}
                  </Button>
                </Box>
              )
            }

            // ✅ DESKTOP (unchanged)
            return (
              <Box my={4} width="100%" key={href}>
                <object
                  data={href}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                  style={{ border: 'none' }}
                >
                  <span>Your browser does not support inline PDFs.</span>
                </object>

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

          // --- WP Buttons ---
          if (attribs?.class?.includes('wp-block-button__link')) {
            return (
              <Button
                as="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                key={idx}
                mt={2}
                mb={2}
                fontSize="14px"
                boxShadow="0px 0px 12px rgba(0,0,0,0.05)"
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              >
                {renderNodes(children)}
              </Button>
            )
          }

          // --- Regular links ---
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

        // --- Fallback ---
        return (
          <React.Fragment key={idx}>
            {renderNodes(children)}
          </React.Fragment>
        )
      }

      return null
    })
  }

  return renderNodes(dom.children)
}