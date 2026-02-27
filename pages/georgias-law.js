// pages/georgias-law.js
import { getApolloClient } from '../lib/wordpress'
import { Container, Box, Heading, useBreakpointValue } from '@chakra-ui/react'
import Section from '../components/section'
import styles from '../styles/Home.module.css'
import { GET_GEORGIAS_LAW } from '../lib/queries'
import parse from 'html-react-parser'

// Wrap images in anchors
export function parseHtml(html) {
  if (typeof window === 'undefined') return html
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('img').forEach(img => {
    const src = img.src
    const wrapper = document.createElement('a')
    wrapper.href = src
    wrapper.target = '_blank'
    img.parentNode.replaceChild(wrapper, img)
    wrapper.appendChild(img)
  })
  return doc.body.innerHTML
}

export default function GeorgiasLaw({ page }) {
  if (!page) return <p>Page not found</p>

  const renderedPDFs = new Set()
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Map PDF URLs to WordPress-generated thumbnails (if available)
  const pdfThumbnails = {}
  page.mediaItems?.nodes.forEach(item => {
    if (item.mediaItemUrl) {
      const thumb = item.mediaDetails?.sizes?.find(
        s => s.name === 'thumbnail'
      )?.sourceUrl
      if (thumb) pdfThumbnails[item.mediaItemUrl] = thumb
    }
  })

  const contentWithEmbeddedPDFs = parse(parseHtml(page.content), {
    replace: node => {
      if (
        node.name === 'a' &&
        node.attribs?.href?.toLowerCase().endsWith('.pdf')
      ) {
        const href = node.attribs.href
        if (renderedPDFs.has(href)) return <></>
        renderedPDFs.add(href)
        const title = node.children?.[0]?.data || 'PDF Document'
        const thumbnail = pdfThumbnails[href]

        return (
          <Box
            key={href}
            my={4}
            width="100%"
            overflow="hidden"
            borderRadius="md"
          >
            {/* Desktop: embed PDF */}
            {!isMobile && (
              <embed
                src={href}
                type="application/pdf"
                width="100%"
                height="500px"
                style={{ maxWidth: '100%' }}
              />
            )}

            {/* Mobile: show WordPress thumbnail if available, fallback to PDF icon */}
            {isMobile && (
              <img
                src={
                  thumbnail ??
                  page.featuredImage?.node?.sourceUrl ??
                  '/pdf-placeholder.png'
                }
                alt={title}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}

            {/* PDF link */}
            <Box mt={2}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            </Box>
          </Box>
        )
      }
      return undefined
    }
  })

  return (
    <Section delay={0.1}>
      <Container maxW="container.md" mt="4rem">
        <Heading as="h1" mb={4}>
          {page.title}
        </Heading>

        {page.featuredImage && (
          <img
            src={page.featuredImage.node.sourceUrl}
            alt={page.title}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        )}

        <Box>{contentWithEmbeddedPDFs}</Box>
      </Container>
    </Section>
  )
}

// Server-side fetch
export async function getServerSideProps() {
  const apolloClient = getApolloClient()
  const { data } = await apolloClient.query({
    query: GET_GEORGIAS_LAW,
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      page: data?.pageBy ?? null
    }
  }
}
