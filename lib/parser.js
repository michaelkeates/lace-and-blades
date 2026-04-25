import { parseDocument } from 'htmlparser2'
import {
  Box,
  Divider,
  Text,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react'
import React from 'react'
import { WPTwitter } from '../components/parser/twitter'
import { WPImage } from '../components/parser/image'
import { WPVideo } from '../components/parser/video'
import { WPLink } from '../components/parser/link'
import { WPPdf } from '../components/parser/pdf'

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
              columns={isMobile ? 1 : 2} // Force 1 on mobile, 2 on desktop
              spacingX={10}             // Horizontal gap on desktop
              spacingY={isMobile ? 2 : 0} // Very small vertical gap between Logo and PDF on mobile
              mb={isMobile ? 4 : 8}     // Margin between the pairs
              alignItems="center"       // Vertical center the logo and PDF
            >
              {renderNodes(children, true)}
            </SimpleGrid>
          )
        }

        // --- 3. WordPress File Block (PDFs) ---
        if (attribs?.class?.includes('wp-block-file')) {
          // Deep search for the PDF link to ensure we don't miss it in complex column nesting
          const findPdfLink = (nodes) => {
            for (let n of nodes || []) {
              if (n.name === 'a' && n.attribs?.href?.toLowerCase().endsWith('.pdf')) {
                return {
                  url: n.attribs.href,
                  title: n.children?.[0]?.data || 'Download PDF'
                };
              }
              if (n.children) {
                const found = findPdfLink(n.children);
                if (found) return found;
              }
            }
            return null;
          };

          const pdfInfo = findPdfLink(children);

          if (pdfInfo && !excludePdfs && !renderedPDFs.has(pdfInfo.url)) {
            renderedPDFs.add(pdfInfo.url);
            return (
              <WPPdf
                key={idx}
                fileUrl={pdfInfo.url}
                fileTitle={pdfInfo.title}
                isMobile={isMobile}
                inColumn={inColumn} // Pass this to the component for spacing
              />
            );
          }
        }

        // --- 4. Twitter Detection ---
        const isTwitterContainer = attribs?.class?.includes('twitter-tweet') ||
          attribs?.class?.includes('wp-block-embed-twitter');

        const tweetUrl = findTwitterUrl([node]);

        if (tweetUrl && (isTwitterContainer || name === 'p')) {
          return (
            <WPTwitter
              key={idx}
              node={node}
              idx={idx}
              findTwitterUrl={findTwitterUrl}
            />
          );
        }

        // --- 5. Media Handling ---
        if (name === 'video') return <WPVideo key={idx} src={attribs.src} />
        if (name === 'img') return <WPImage key={idx} attribs={attribs} inColumn={inColumn} />

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

        // --- 6. Standard Tag Rendering ---
        if (name === 'p') return (
          <Box as="p" key={idx} mb={4} fontSize="20px" lineHeight="1.8" fontFamily="Georgia, serif">
            {renderNodes(children, inColumn)}
          </Box>
        )

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
            >
              {renderNodes(children, inColumn)}
            </Box>
          )
        }

        if (name === 'a') {
          return (
            <WPLink
              key={idx}
              attribs={attribs}
              children={children}
              inColumn={inColumn}
              hasImage={children?.some(c => c.name === 'img')}
              renderNodes={renderNodes}
            />
          )
        }

        if (name === 'hr' || attribs?.class?.includes('wp-block-separator')) {
          return (
            <Divider
              key={idx}
              my={10}
              borderColor={useColorModeValue('blackAlpha.400', 'whiteAlpha.400')}
            />
          )
        }

        if (name === 'figure' && attribs?.class?.includes('wp-block-image')) {
          // Find the img tag among the figure's children
          const imgNode = children?.find(c => c.name === 'img');

          if (imgNode) {
            return (
              <WPImage
                key={idx}
                attribs={imgNode.attribs}
                parentAttribs={attribs} // We pass the figure's classes here
                inColumn={inColumn}
              />
            );
          }
        }

        if (name === 'img') {
          // If the parent is a figure, we already handled it above, so return null
          if (node.parent?.name === 'figure') return null;

          return <WPImage key={idx} attribs={attribs} inColumn={inColumn} />;
        }

        // Keep the direct <img> fallback just in case
        if (name === 'img' && node.parent?.name !== 'figure') {
          return <WPImage key={idx} attribs={attribs} inColumn={inColumn} />;
        }

        // FALLBACK
        return <React.Fragment key={idx}>{renderNodes(children, inColumn)}</React.Fragment>
      }
      return null
    })
  }

  return renderNodes(dom.children)
}