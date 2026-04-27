import { parseDocument } from 'htmlparser2'
import {
  Box,
  Divider,
  Text,
  SimpleGrid,
  useColorModeValue,
  Flex
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
        const className = attribs?.class || "";

        // --- 2. WordPress Layout Handling (Columns) ---
        if (attribs?.class?.includes('wp-block-columns')) {
          const hasButtonOrFile = (nodes) => {
            return nodes.some(n => {
              const className = n.attribs?.class || '';
              if (className.includes('wp-block-button') || className.includes('wp-block-file')) return true;
              if (n.children) return hasButtonOrFile(n.children);
              return false;
            });
          };

          return (
            <SimpleGrid
              key={idx}
              columns={{ base: 1, md: 2 }}
              spacingX={{ base: 0, md: 12 }}
              spacingY={8}
              mb={10}
              alignItems="start"
              width="100%"
            >
              {children
                .filter(c => c.type === 'tag')
                .map((child, cIdx) => {
                  const isCenteredType = hasButtonOrFile([child]);
                  return (
                    <Box
                      key={cIdx}
                      width="100%"
                      display="flex"
                      flexDirection="column"
                      alignItems={isCenteredType ? "center" : "stretch"}
                      textAlign={isCenteredType ? "center" : "left"}
                    >
                      {renderNodes([child], true)}
                    </Box>
                  );
                })}
            </SimpleGrid>
          )
        }

        // --- 3. WordPress Group Block Handling (Side-by-Side Address Logic) ---
        if (className.includes("wp-block-group")) {
          // Trigger flex layout only if WP has set it to flex/nowrap (like your addresses)
          const isFlexRow = className.includes("is-layout-flex");

          if (isFlexRow) {
            return (
              <Flex
                key={idx}
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="center"
                gap={{ base: 6, md: 12 }}
                my={10}
                p={{ base: 8, md: 10 }}
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                borderRadius="xl"
                width="100%"
                boxShadow="sm"
              >
                {children
                  .filter(c => c.type === 'tag' || (c.type === 'text' && c.data.trim()))
                  .map((child, cIdx) => {
                    const isImage = child.name === 'figure' || child.attribs?.class?.includes('wp-block-image');
                    return (
                      <Box 
                        key={cIdx} 
                        flex="1"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        textAlign="center"
                        minW={isImage ? "auto" : { base: "100%", md: "300px" }}
                      >
                        {renderNodes([child], true)}
                      </Box>
                    );
                  })}
              </Flex>
            );
          }
          // Default group behavior for other pages (Charity page)
          return <Box key={idx} className={className} width="100%">{renderNodes(children, inColumn)}</Box>;
        }

        // --- 4. WordPress File Block (PDFs) ---
        if (attribs?.class?.includes('wp-block-file')) {
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
                inColumn={inColumn}
              />
            );
          }
        }

        // --- 5. Twitter Detection ---
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

        // --- 6. Custom Elements & Line Breaks ---
        if (className.includes("custom-button-row")) {
          return (
            <Flex key={idx} gap="15px" justify="center" wrap="wrap" my={8} width="100%">
              {renderNodes(children, true)}
            </Flex>
          );
        }

        if (name === "br") {
          return <br key={idx} />;
        }

        if (name === "svg") {
          return (
            <Box as="svg" key={idx} viewBox={attribs.viewbox || attribs.viewBox} xmlns={attribs.xmlns} width="20px" height="20px" fill="currentColor" display="inline-block" verticalAlign="middle" mr={2}>
              {renderNodes(children, inColumn)}
            </Box>
          );
        }

        if (name === "path") {
          return <path key={idx} d={attribs.d} fill="currentColor" />;
        }

        // --- 7. Link & Button Rendering ---
        if (name === "a") {
          const isButtonLink = className.includes("wp-block-button__link") || className.includes("wp-element-button");

          if (isButtonLink) {
            return (
              <Box
                as="a"
                key={idx}
                href={attribs.href}
                target="_blank" 
                rel="noopener noreferrer"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                padding="12px 24px"
                borderRadius="8px"
                fontWeight="bold"
                textDecoration="none !important"
                fontSize="16px"
                _hover={{ 
                  bg: useColorModeValue('gray.100', 'whiteAlpha.300'),
                  textDecoration: "none !important" 
                }}
              >
                {renderNodes(children, inColumn)}
              </Box>
            );
          }

          return (
            <WPLink
              key={idx}
              attribs={attribs}
              children={children}
              inColumn={inColumn}
              hasImage={children?.some(c => c.name === 'img')}
              renderNodes={renderNodes}
            />
          );
        }

        // --- 8. Media Handling ---
        if (name === 'video') return <WPVideo key={idx} src={attribs.src} />
        if (name === 'img') return <WPImage key={idx} attribs={attribs} inColumn={inColumn} />

        if (name === 'figcaption') {
          return (
            <Text key={idx} fontSize="sm" textAlign="center" color={useColorModeValue('gray.600', 'gray.400')} mt={-2} mb={6} fontStyle="italic">
              {renderNodes(children, inColumn)}
            </Text>
          )
        }

        // --- 9. Standard Tag Rendering ---
        if (name === 'p') return (
          <Box as="p" key={idx} mb={inColumn ? 2 : 4} fontSize="20px" lineHeight="1.6" fontFamily="Georgia, serif">
            {renderNodes(children, inColumn)}
          </Box>
        )

        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(name)) {
          const sizes = { h1: '2.8em', h2: '2.2em', h3: '1.8em' }
          return (
            <Box as={name} key={idx} fontSize={sizes[name] || '1.2em'} fontWeight={700} fontFamily="Georgia, serif" my="1.2em">
              {renderNodes(children, inColumn)}
            </Box>
          )
        }

        if (name === 'hr' || attribs?.class?.includes('wp-block-separator')) {
          return <Divider key={idx} my={10} borderColor={useColorModeValue('blackAlpha.400', 'whiteAlpha.400')} />
        }

        if (name === 'figure' && attribs?.class?.includes('wp-block-image')) {
          const imgNode = children?.find(c => c.name === 'img');
          if (imgNode) {
            return <WPImage key={idx} attribs={imgNode.attribs} parentAttribs={attribs} inColumn={inColumn} />;
          }
        }

        return <React.Fragment key={idx}>{renderNodes(children, inColumn)}</React.Fragment>
      }
      return null
    })
  }

  return renderNodes(dom.children)
}