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

          // Helper to check if a column contains a button or PDF deep in its tree
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
                  // Check this specific column for buttons
                  const isCenteredType = hasButtonOrFile([child]);

                  return (
                    <Box
                      key={cIdx}
                      width="100%"
                      display="flex"
                      flexDirection="column"
                      // Vertical/Horizontal centering for buttons, start-alignment for text
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

        // --- 3. WordPress File Block (PDFs) ---
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

        // --- 5. Custom Button Row Handling (THE FIX) ---
        if (className.includes("custom-button-row")) {
          return (
            <Flex
              key={idx}
              gap="15px"
              justify="center"
              wrap="wrap"
              my={8}
              width="100%"
            >
              {renderNodes(children, true)}
            </Flex>
          );
        }

        // --- 6. SVG & Icon Handling ---
        if (name === "svg") {
          return (
            <Box
              as="svg"
              key={idx}
              viewBox={attribs.viewbox || attribs.viewBox}
              xmlns={attribs.xmlns}
              width="20px"
              height="20px"
              fill="currentColor"
              display="inline-block"
              verticalAlign="middle"
              mr={2}
            >
              {renderNodes(children, inColumn)}
            </Box>
          );
        }

        if (name === "path") {
          return <path key={idx} d={attribs.d} fill="currentColor" />;
        }

        // --- 7. Link & Button Rendering (MERGED TO PREVENT OVERWRITE) ---
        if (name === "a") {
          const isButtonLink = className.includes("wp-block-button__link") || className.includes("wp-element-button");

          if (isButtonLink) {
            return (
              <Box
                as="a"
                key={idx}
                href={attribs.href}
                // Force new tab behavior
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

          // Default Link behavior (Your original WPLink)
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

        // --- Add this right above your 'p' tag handler ---
        if (name === "br") {
          return <br key={idx} />;
        }

        if (name === "p") {
          return (
            <Box
              as="p"
              key={idx}
              mb={4}
              fontSize="20px"
              lineHeight="1.6" // Better for addresses
              fontFamily="Georgia, serif"
              whiteSpace="normal" // Ensures it respects the width of the container
            >
              {renderNodes(children, inColumn)}
            </Box>
          );
        }

        // --- 9. Standard Tag Rendering ---
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

// --- Unified WordPress Group Block Handling ---
if (className.includes("wp-block-group")) {
  const containsImage = (nodes) => {
    return nodes.some(n => {
      if (n.name === 'img' || n.name === 'figure' || n.attribs?.class?.includes('wp-block-image')) return true;
      if (n.children) return containsImage(n.children);
      return false;
    });
  };

  const hasContent = (node) => {
    if (node.type === 'text' && node.data.trim().length > 0) return true;
    if (node.name === 'p' || node.name === 'img' || node.name === 'figure') return true;
    if (node.children && node.children.length > 0) return node.children.some(c => hasContent(c));
    return false;
  };

  return (
    <Flex
      key={idx}
      className={className}
      direction={{ base: "column", md: "row" }}
      // This centers the content pair inside the background
      align="center"
      justify="center" 
      gap={{ base: 6, md: 16 }} // Increased gap for better visual separation
      my={10}
      p={{ base: 8, md: 12 }}
      bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
      borderRadius="xl"
      width="100%" 
      maxW="none"
      boxShadow="sm"
      overflow="hidden"
    >
      {children
        .filter(child => hasContent(child))
        .map((child, cIdx) => {
          const isImgContainer = containsImage([child]);
          
          return (
            <Box 
              key={cIdx} 
              // flex="1" on both makes them equal halves, which forces centering
              flex="1" 
              // Ensure the containers don't get too small or too huge
              maxW={isImgContainer ? { base: "100%", md: "450px" } : { base: "100%", md: "500px" }}
              display="flex" 
              flexDirection="column" 
              // Center-align everything internally for a cleaner look
              alignItems="center" 
              textAlign="center"
            >
              {renderNodes([child], true)}
            </Box>
          );
      })}
    </Flex>
  );
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
          const imgNode = children?.find(c => c.name === 'img');
          if (imgNode) {
            return (
              <WPImage
                key={idx}
                attribs={imgNode.attribs}
                parentAttribs={attribs}
                inColumn={inColumn}
              />
            );
          }
        }

        // FALLBACK
        return <React.Fragment key={idx}>{renderNodes(children, inColumn)}</React.Fragment>
      }
      return null
    })
  }

  return renderNodes(dom.children)
}