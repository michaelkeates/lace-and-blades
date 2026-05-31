import { parseDocument } from 'htmlparser2'
import {
  Box,
  Divider,
  Text,
  SimpleGrid,
  useColorModeValue,
  Flex,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react'
import React from 'react'
import { WPTwitter } from '../components/parser/twitter'
import { WPImage } from '../components/parser/image'
import { WPVideo, WPYoutube } from '../components/parser/video'
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

        // --- 3. WordPress Group Block Handling ---
        if (className.includes("wp-block-group")) {
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
          return <Box key={idx} className={className} width="100%">{renderNodes(children, inColumn)}</Box>;
        }

        // --- 4. WordPress Quote Block ---
        if (name === "blockquote" || className.includes("wp-block-quote")) {
          return (
            <Box
              key={idx}
              as="blockquote"
              borderLeftWidth="4px"
              // Uses a soft pink for the accent line
              borderLeftColor={useColorModeValue('pink.300', 'pink.400')}
              // Optional: Adds a very faint pink tint to the background
              bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.50')}
              pl={6}
              pr={4} // Adding a bit of padding on the right for balance
              py={4}
              my={8}
              borderRadius="0 8px 8px 0" // Softens the corners on the right side
              fontStyle="italic"
              // Darker pink/gray text for readability
              color={useColorModeValue('pink.800', 'pink.100')}
              sx={{
                "p": {
                  marginBottom: "0 !important",
                  lineHeight: "1.8",
                  fontSize: "21px"
                }
              }}
            >
              {renderNodes(children, inColumn)}
            </Box>
          );
        }

        // --- 5. WordPress File Block (PDFs) ---
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

        // --- 6. Twitter Detection ---
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

        // --- 7. Custom Elements & Line Breaks ---
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

        // --- 8. Link & Button Rendering ---
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

        // --- 9. Media Handling ---

        // 9.1 SELF-HOSTED VIDEO (MP4)
        if (name === 'video') return <WPVideo key={idx} src={attribs.src} />

        // 9.2 IFRAME / YOUTUBE EMBED (The "I finally see you" Fix)
        if (name === 'iframe' || className.includes('wp-block-embed__wrapper')) {
          // If the node itself is an iframe, or if we need to find the iframe inside the wrapper
          const findIframe = (nodes) => {
            if (node.name === 'iframe') return node; // The current node is the iframe
            for (let n of nodes || []) {
              if (n.name === 'iframe') return n;
              if (n.children) {
                const deep = findIframe(n.children);
                if (deep) return deep;
              }
            }
            return null;
          };

          const iframeNode = findIframe(children);

          if (iframeNode || name === 'iframe') {
            const targetNode = iframeNode || node;
            const finalSrc = targetNode.attribs?.src;

            if (finalSrc) {
              // Use the component to make it pretty and responsive
              return <WPYoutube key={idx} url={finalSrc} />;
            }
          }
        }

        // --- 9.3 WORDPRESS TABLES ---
        if (name === 'figure' && className.includes('wp-block-table')) {
          return (
            <TableContainer
              key={idx}
              width="100%"
              my={8}
              overflowX="auto"
              whiteSpace="normal" // Allows text wrapping inside table cells
            >
              {renderNodes(children, inColumn)}
            </TableContainer>
          )
        }

        if (name === 'table') {
          return (
            <Table
              key={idx}
              variant="simple"
              size="sm"
              borderWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              {renderNodes(children, inColumn)}
            </Table>
          )
        }

        if (name === 'thead') {
          return <Thead key={idx} bg={useColorModeValue('gray.50', 'whiteAlpha.50')}>{renderNodes(children, inColumn)}</Thead>
        }

        if (name === 'tbody') {
          return <Tbody key={idx}>{renderNodes(children, inColumn)}</Tbody>
        }

        if (name === 'tr') {
          return (
            <Tr
              key={idx}
              _hover={{ bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.50') }}
            >
              {renderNodes(children, inColumn)}
            </Tr>
          )
        }

        if (name === 'th') {
          const alignment = attribs?.['data-align'] || 'left'
          return (
            <Th
              key={idx}
              textAlign={alignment}
              p={4}
              fontSize="12px"
              textTransform="none" // Keeps typography cleaner for long headers
              fontWeight="bold"
              fontFamily="Georgia, serif"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              {renderNodes(children, inColumn)}
            </Th>
          )
        }

        if (name === 'td') {
          const alignment = attribs?.['data-align'] || 'left'
          return (
            <Td
              key={idx}
              textAlign={alignment}
              p={4}
              fontSize="15px"
              lineHeight="1.5"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              verticalAlign="top"
            >
              {renderNodes(children, inColumn)}
            </Td>
          )
        }

        // --- Wordpress Annotation Heading (H4) & Standard Headings ---
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(name)) {
          const isAnnotationHeading = className.includes('is-style-text-annotation');

          if (name === 'h4' && isAnnotationHeading) {
            return (
              <Box
                key={idx}
                as="h4"
                my={6}
                p={5}
                bg={useColorModeValue('gray.50', 'whiteAlpha.100')}
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
                borderRadius="xl" // Curved edges
                fontSize={{ base: '14px', md: '15px' }}
                lineHeight="1.6"
                fontWeight="normal"
                fontFamily="Georgia, serif"
                color={useColorModeValue('gray.800', 'gray.200')}
                width="100%"
                boxShadow="sm"
              >
                {renderNodes(children, inColumn)}
              </Box>
            )
          }

          // Your default heading logic
          const sizes = { h1: '2.8em', h2: '2.2em', h3: '1.8em' }
          return (
            <Box as={name} key={idx} fontSize={sizes[name] || '1.2em'} fontWeight={700} fontFamily="Georgia, serif" my="1.2em">
              {renderNodes(children, inColumn)}
            </Box>
          )
        }

        // --- Wordpress Annotation Paragraph (P) & Standard Paragraphs ---
        if (name === 'p') {
          const isAnnotationParam = className.includes('is-style-text-annotation');

          if (isAnnotationParam) {
            return (
              <Box
                key={idx}
                as="p"
                mb={inColumn ? 3 : 6}
                p={4}
                bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                // 1. Add a subtle full border instead of just a left border
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
                // 2. Change this to curve all four corners completely
                borderRadius="xl"
                fontSize={{ base: '14px', md: '16px' }}
                lineHeight="1.6"
                fontFamily="Georgia, serif"
                color={useColorModeValue('gray.700', 'gray.200')}
                width="100%"
                boxShadow="sm"
              >
                {renderNodes(children, inColumn)}
              </Box>
            )
          }

          // Your default standard paragraph block
          return (
            <Box as="p" key={idx} mb={inColumn ? 2 : 4} fontSize="20px" lineHeight="1.6" fontFamily="Georgia, serif">
              {renderNodes(children, inColumn)}
            </Box>
          )
        }

        if (name === 'hr' || attribs?.class?.includes('wp-block-separator')) {
          return <Divider key={idx} my={10} borderColor={useColorModeValue('blackAlpha.400', 'whiteAlpha.400')} />
        }

        // UPDATED FIGURE LOGIC: Finds images inside links and forces full width
        if (name === 'figure' && attribs?.class?.includes('wp-block-image')) {
          const findNode = (nodes, tagName) => {
            for (let n of nodes || []) {
              if (n.name === tagName) return n;
              if (n.children) {
                const deep = findNode(n.children, tagName);
                if (deep) return deep;
              }
            }
            return null;
          };

          const imgNode = findNode(children, 'img');
          const linkNode = findNode(children, 'a');

          if (imgNode) {
            const imageComponent = (
              <WPImage
                key={idx}
                attribs={imgNode.attribs}
                parentAttribs={attribs}
                inColumn={inColumn}
              />
            );

            return (
              <Box key={idx} width="100%" mb={8}>
                {linkNode ? (
                  <Box
                    as="a"
                    href={linkNode.attribs.href}
                    target={linkNode.attribs.target}
                    rel={linkNode.attribs.rel}
                    display="block"
                    width="100%"
                  >
                    {imageComponent}
                  </Box>
                ) : (
                  imageComponent
                )}
              </Box>
            );
          }
        }

        return <React.Fragment key={idx}>{renderNodes(children, inColumn)}</React.Fragment>
      }
      return null
    })
  }

  return renderNodes(dom.children)
}