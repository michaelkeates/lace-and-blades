// pages/georgias-law.js
import { getApolloClient } from '../lib/wordpress'
import { Container, Box, Heading } from '@chakra-ui/react'
import Section from '../components/section'
import styles from '../styles/Home.module.css'
import { GET_GEORGIAS_LAW } from '../lib/queries'
import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import PDFViewer from '../components/pdfviewer'

// ---------------------------
// UTILITY: Wrap IMAGES in ANCHORS
// ---------------------------
export function parseHtml(html) {
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const images = doc.querySelectorAll('img')
    images.forEach(img => {
      const src = img.getAttribute('src')
      const wrapper = document.createElement('a')
      wrapper.setAttribute('href', src)
      wrapper.setAttribute('target', '_blank')
      img.parentNode.replaceChild(wrapper, img)
      wrapper.appendChild(img)
    })
    return doc.body.innerHTML
  } else {
    return html
  }
}

// ---------------------------
// MAIN PAGE COMPONENT
// ---------------------------
export default function GeorgiasLaw({ page }) {
  const [windowWidth, setWindowWidth] = useState(0)

  // Track window width for responsive PDF rendering
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
      const handleResize = () => setWindowWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (!page) return <p>Page not found</p>

  const renderedPDFs = new Set()

  const contentWithEmbeddedPDFs = parse(parseHtml(page.content), {
    replace: node => {
      if (
        node.name === 'a' &&
        node.attribs?.href &&
        node.attribs.href.toLowerCase().endsWith('.pdf')
      ) {
        const href = node.attribs.href

        if (renderedPDFs.has(href)) return <></>
        renderedPDFs.add(href)

        const title = node.children?.[0]?.data || 'PDF Document'

        return (
          <Box marginY={4} key={href}>
            <PDFViewer file={href} />
            <Box marginTop={2}>
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
        <main className={styles.main}>
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
        </main>
      </Container>
    </Section>
  )
}

// ---------------------------
// SERVER-SIDE FETCH
// ---------------------------
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