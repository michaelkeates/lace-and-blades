import { getApolloClient } from '../lib/wordpress'
import {
  Container,
  Box,
  SimpleGrid,
  Link,
  Button,
  useColorModeValue
} from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import Section from '../components/section'
import parse, { domToReact } from 'html-react-parser'
import { GET_GIVING_BACK_PAGE } from '../lib/queries'

export default function GivingBackDonationsFundraisers({ page }) {
  if (!page) return <p>Page not found</p>

  const renderedPDFs = new Set()
  const pdfs = []

  // Replace nodes recursively
  function replaceNode(node) {
    if (!node) return

    // Columns container
    if (
      node.name === 'div' &&
      node.attribs?.class?.includes('wp-block-columns')
    ) {
      return (
        <Box
          className="wp-block-columns"
          display="flex"
          flexWrap="wrap"
          gap="1rem"
          justifyContent="flex-start"
          alignItems="flex-start"
          width="100%"
        >
          {domToReact(node.children, { replace: replaceNode })}
        </Box>
      )
    }

    // Individual column
    if (
      node.name === 'div' &&
      node.attribs?.class?.includes('wp-block-column')
    ) {
      return (
        <Box
          className="wp-block-column"
          flex="1 1 48%"
          minWidth="200px"
          mb={4}
          boxSizing="border-box"
        >
          {domToReact(node.children, { replace: replaceNode })}
        </Box>
      )
    }
    8

    // Figure with image
    if (node.name === 'figure') {
      return (
        <Box as="figure" mb={4}>
          {domToReact(node.children, {
            replace: child => {
              if (child.name === 'img') {
                return (
                  <img
                    {...child.attribs}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                )
              }
              if (child.name === 'figcaption') {
                return (
                  <Box as="figcaption" textAlign="center" fontSize="sm" mt={1}>
                    {domToReact(child.children)}
                  </Box>
                )
              }
              return replaceNode(child)
            }
          })}
        </Box>
      )
    }

    // PDFs
    if (
      node.name === 'a' &&
      node.attribs?.href?.toLowerCase().endsWith('.pdf')
    ) {
      const href = node.attribs.href
      if (!renderedPDFs.has(href)) {
        renderedPDFs.add(href)
        const title = node.children?.[0]?.data || 'PDF Document'
        pdfs.push({ href, title })
      }
      return <></>
    }

    if (
      node.name === 'object' &&
      node.attribs?.data?.toLowerCase().endsWith('.pdf')
    ) {
      const href = node.attribs.data
      if (!renderedPDFs.has(href)) {
        renderedPDFs.add(href)
        const title = node.attribs['aria-label'] || 'PDF Document'
        pdfs.push({ href, title })
      }
      return <></>
    }

    // Paragraphs
    if (node.name === 'p')
      return (
        <Box mb={3} fontSize="lg">
          {domToReact(node.children, { replace: replaceNode })}
        </Box>
      )

    // Headings
    if (node.name === 'h1')
      return (
        <Box as="h1" fontSize="4xl" my={4}>
          {domToReact(node.children, { replace: replaceNode })}
        </Box>
      )
    if (node.name === 'h2')
      return (
        <Box
          as="h2"
          fontSize="3xl"
          my={6}
          textAlign={
            node.attribs?.class?.includes('has-text-align-center')
              ? 'center'
              : 'left'
          }
        >
          {domToReact(node.children, { replace: replaceNode })}
        </Box>
      )
    if (node.name === 'h3')
      return (
        <Box as="h3" fontSize="2xl" my={4}>
          {domToReact(node.children, { replace: replaceNode })}
        </Box>
      )

    // Links
    if (node.name === 'a')
      return (
        <Link href={node.attribs.href} isExternal color="blue.500">
          {domToReact(node.children, { replace: replaceNode })}
        </Link>
      )

    // Lists
    if (node.name === 'ul')
      return (
        <Box as="ul" mb={3}>
          {domToReact(node.children, { replace: replaceNode })}
        </Box>
      )
    if (node.name === 'li')
      return (
        <Box as="li">{domToReact(node.children, { replace: replaceNode })}</Box>
      )
  }

  const content = parse(page.content, { replace: replaceNode })

  return (
    <Container maxW="4xl" mt="-7rem">
      <Section delay={0.1}>
        <main className={styles.main}>
          <h1>{page.title}</h1>

          {page.featuredImage && (
            <img
              className={styles.featuredImage}
              src={page.featuredImage.node.sourceUrl}
              alt={page.title}
            />
          )}

          {/* WordPress content */}
          <Box mb={10} className={`${styles.wpContent} wp-content-wrapper`}>
            {content}
          </Box>

          {/* PDFs below content */}
{pdfs.length > 0 && (
  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10} mt={6}>
    {pdfs.map(pdf => (
      <Box
        key={pdf.href}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={3}
      >
        <embed
          src={pdf.href}
          type="application/pdf"
          width="100%"
          height="300px"
        />
        <Box mt={2} display="flex" justifyContent="center">
          <Link
            href={pdf.href}
            isExternal
            width="100%"
            _hover={{ textDecoration: 'none' }}
          >
            <Button
              width="100%" // Button fills column width
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              _hover={{ bg: useColorModeValue('whiteAlpha.600', 'whiteAlpha.300') }}
              whiteSpace="normal" // Allow text to wrap
              textAlign="center"
              py={4}
            >
              {pdf.title}
            </Button>
          </Link>
        </Box>
      </Box>
    ))}
  </SimpleGrid>
)}
        </main>
      </Section>
    </Container>
  )
}

export async function getServerSideProps() {
  const apolloClient = getApolloClient()
  const { data } = await apolloClient.query({
    query: GET_GIVING_BACK_PAGE,
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      page: data?.pageBy ?? null
    }
  }
}
