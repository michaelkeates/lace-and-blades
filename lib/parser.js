import { parseDocument } from 'htmlparser2'
import {
  Box,
  Divider,
  SimpleGrid,
  useColorModeValue,
  Flex,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading
} from '@chakra-ui/react'
import React from 'react'
import { WPTwitter } from '../components/parser/twitter'
import { WPImage } from '../components/parser/image'
import { WPVideo, WPYoutube } from '../components/parser/video'
import { WPLink } from '../components/parser/link'
import { WPPdf } from '../components/parser/pdf'
import { WPTimeline } from '../components/parser/timeline'

// Serializes a parsed htmlparser2 node back to an HTML string.
// Used to hand raw HTML subtrees to dangerouslySetInnerHTML without losing
// class names or structure that the Chakra mapper would otherwise drop.
function serializeNode(node) {
  if (!node) return ''
  if (node.type === 'text') return node.data
  if (node.type === 'comment') return `<!--${node.data}-->`
  if (node.type === 'tag') {
    const attrs = Object.entries(node.attribs || {})
      .map(([k, v]) => (v === '' ? k : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
      .join(' ')
    const inner = (node.children || []).map(serializeNode).join('')
    const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])
    if (voidTags.has(node.name)) return `<${node.name}${attrs ? ' ' + attrs : ''}>`
    return `<${node.name}${attrs ? ' ' + attrs : ''}>${inner}</${node.name}>`
  }
  return ''
}

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

      if (node.type === 'text') {
        if (node.data.includes('twitter.com/status/')) return null
        return node.data
      }

      // htmlparser2 gives <style> nodes type='style', not type='tag',
      // so they must be caught here before the tag block.
      if (node.type === 'style') {
        const cssText = (node.children || []).map(c => c.data || '').join('')
        return <style key={idx} dangerouslySetInnerHTML={{ __html: cssText }} />
      }

      if (node.type === 'tag') {
        const { name, attribs, children } = node
        const className = attribs?.class || "";

        // Add this check near the top of the 'if (node.type === 'tag')' block
        if (attribs.style && attribs.style.includes('border:1px solid #b9d9b8')) {
          const innerHtml = (children || []).map(serializeNode).join('')
          return (
            <Box
              key={idx}
              dangerouslySetInnerHTML={{ __html: `<div style="${attribs.style}">${innerHtml}</div>` }}
            />
          )
        }

        // Render the entire poster block as raw HTML so every lb-* class name
        // is preserved and matched by the embedded <style> CSS above.
        // Recursing through Chakra components loses the wrapper divs and class names.
        if (className.includes('lb-poster-wrap')) {
          const innerHtml = (children || []).map(serializeNode).join('')
          return (
            <div
              key={idx}
              className={className}
              dangerouslySetInnerHTML={{ __html: innerHtml }}
            />
          )
        }

        if (className.includes('lb-title')) {
          return (
            <Heading
              key={idx}
              as="h1"
              fontFamily="var(--font-playfair)"
              textTransform="uppercase"
              color="#c86470"
              fontSize={{ base: "38px", md: "72px" }}
            >
              {renderNodes(children, inColumn)}
            </Heading>
          );
        }

        // Hand the entire timeline off to WPTimeline which renders it with Chakra.
        // This means the WordPress <style> selectors (color: #3521a0 etc.) never
        // match — the output elements carry no lb-* class names.
        if (className.includes('lb-journey-wrap')) {
          return <WPTimeline key={idx} node={node} renderNodes={renderNodes} />
        }

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

        if (name === "blockquote" || className.includes("wp-block-quote")) {
          return (
            <Box
              key={idx}
              as="blockquote"
              borderLeftWidth="4px"
              borderLeftColor={useColorModeValue('pink.300', 'pink.400')}
              bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.50')}
              pl={6}
              pr={4}
              py={4}
              my={8}
              borderRadius="0 8px 8px 0"
              fontStyle="italic"
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

        if (className.includes("custom-button-row")) {
          return (
            <Flex key={idx} gap="15px" justify="center" wrap="wrap" my={8} width="100%">
              {renderNodes(children, true)}
            </Flex>
          );
        }

        if (name === "br") return <br key={idx} />;

        if (name === "svg") {
          return (
            <Box as="svg" key={idx} viewBox={attribs.viewbox || attribs.viewBox} xmlns={attribs.xmlns} width="20px" height="20px" fill="currentColor" display="inline-block" verticalAlign="middle" mr={2}>
              {renderNodes(children, inColumn)}
            </Box>
          );
        }

        if (name === "path") return <path key={idx} d={attribs.d} fill="currentColor" />;

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

        if (name === 'video') return <WPVideo key={idx} src={attribs.src} />

        if (name === 'iframe' || className.includes('wp-block-embed__wrapper')) {
          const findIframe = (nodes) => {
            if (node.name === 'iframe') return node;
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
            if (finalSrc) return <WPYoutube key={idx} url={finalSrc} />;
          }
        }

        if (name === 'figure' && className.includes('wp-block-table')) {
          return (
            <TableContainer key={idx} width="100%" my={8} overflowX="auto" whiteSpace="normal">
              {renderNodes(children, inColumn)}
            </TableContainer>
          )
        }

        if (name === 'table') {
          return (
            <Table key={idx} variant="simple" size="sm" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
              {renderNodes(children, inColumn)}
            </Table>
          )
        }

        if (name === 'thead') return <Thead key={idx} bg={useColorModeValue('gray.50', 'whiteAlpha.50')}>{renderNodes(children, inColumn)}</Thead>
        if (name === 'tbody') return <Tbody key={idx}>{renderNodes(children, inColumn)}</Tbody>
        if (name === 'tr') return <Tr key={idx} _hover={{ bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.50') }}>{renderNodes(children, inColumn)}</Tr>

        if (name === 'th') {
          const alignment = attribs?.['data-align'] || 'left'
          return (
            <Th key={idx} textAlign={alignment} p={4} fontSize="12px" textTransform="none" fontWeight="bold" fontFamily="Georgia, serif" borderColor={useColorModeValue('gray.200', 'gray.700')}>
              {renderNodes(children, inColumn)}
            </Th>
          )
        }

        if (name === 'td') {
          const alignment = attribs?.['data-align'] || 'left'
          return (
            <Td key={idx} textAlign={alignment} p={4} fontSize="15px" lineHeight="1.5" borderColor={useColorModeValue('gray.200', 'gray.700')} verticalAlign="top">
              {renderNodes(children, inColumn)}
            </Td>
          )
        }

        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(name)) {
          const isAnnotationHeading = className.includes('is-style-text-annotation');
          if (name === 'h4' && isAnnotationHeading) {
            return (
              <Box key={idx} as="h4" my={6} p={5} bg={useColorModeValue('gray.50', 'whiteAlpha.100')} border="1px solid" borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')} borderRadius="xl" fontSize={{ base: '14px', md: '15px' }} lineHeight="1.6" fontWeight="normal" fontFamily="Georgia, serif" color={useColorModeValue('gray.800', 'gray.200')} width="100%" boxShadow="sm">
                {renderNodes(children, inColumn)}
              </Box>
            )
          }
          const sizes = { h1: '2.8em', h2: '2.2em', h3: '1.8em' }
          return (
            <Box as={name} key={idx} fontSize={sizes[name] || '1.2em'} fontWeight={700} fontFamily="Georgia, serif" my="1.2em">
              {renderNodes(children, inColumn)}
            </Box>
          )
        }

        // --- 12. Paragraphs (Updated with Min-Readability Fallback) ---
        if (name === 'p') {
          const isAnnotationParam = className.includes('is-style-text-annotation');

          let customFontSize = null;
          if (attribs.style) {
            const match = attribs.style.match(/font-size:\s*([^;]+)/i);
            if (match) {
              const rawSize = match[1];
              // If it's 0.5rem (or anything you consider too small), upgrade to 14px
              customFontSize = (rawSize === '0.5rem') ? '14px' : rawSize;
            }
          }

          if (isAnnotationParam) {
            return (
              <Box
                key={idx}
                as="p"
                mb={inColumn ? 3 : 6}
                p={4}
                bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
                borderRadius="xl"
                fontSize={customFontSize || { base: '14px', md: '16px' }}
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

          return (
            <Box
              as="p"
              key={idx}
              mb={inColumn ? 2 : 4}
              fontSize={customFontSize || "20px"}
              lineHeight="1.6"
              fontFamily="Georgia, serif"
            >
              {renderNodes(children, inColumn)}
            </Box>
          )
        }

        if (name === 'hr' || attribs?.class?.includes('wp-block-separator')) {
          return <Divider key={idx} my={10} borderColor={useColorModeValue('blackAlpha.400', 'whiteAlpha.400')} />
        }

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
            // Check if this is the specific image
            const isTargetImage = imgNode.attribs?.src === 'https://wordpress.laceandblades.co.uk/wp-content/uploads/2026/07/image-3.png';

            const imageComponent = (
              <WPImage
                key={idx}
                attribs={imgNode.attribs}
                parentAttribs={attribs}
                inColumn={inColumn}
                // Pass the size override if it's the target image
                style={isTargetImage ? { maxWidth: '200px', margin: '0 auto' } : {}}
              />
            );

            return (
              <Box
                key={idx}
                width="100%"
                mb={8}
                display="flex"
                justifyContent={isTargetImage ? "center" : "flex-start"}
              >
                {linkNode ? (
                  <Box as="a" href={linkNode.attribs.href} target={linkNode.attribs.target} rel={linkNode.attribs.rel} display="block" width={isTargetImage ? "200px" : "100%"}>
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