// pages/georgias-law.js
import { getApolloClient } from '../lib/wordpress'
import { Container, Box } from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import Section from '../components/section'
import { GET_MEDIA_PRESS_BOOK } from '../lib/queries'

import parse from 'html-react-parser'

export default function MediaPress({ page }) {
  if (!page) return <p>Page not found</p>

  const renderedPDFs = new Set()

  const contentWithEmbeddedPDFs = parse(page.content, {
    replace: node => {
      // Only process <a> tags with PDF links
      if (
        node.name === 'a' &&
        node.attribs?.href &&
        node.attribs.href.toLowerCase().endsWith('.pdf')
      ) {
        const href = node.attribs.href

        // Deduplicate: skip if already rendered
        if (renderedPDFs.has(href)) return <></>
        renderedPDFs.add(href)

        const title = node.children?.[0]?.data || 'PDF Document'

        return (
          <Box
            marginY={4}
            key={href}
            overflowX="auto" // allow horizontal scroll if needed
          >
            <Box
              position="relative"
              paddingTop="56.25%" // 16:9 aspect ratio
              width="100%"
            >
              <iframe
                src={href}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                title={title}
              />
            </Box>
            <Box marginTop={2}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            </Box>
          </Box>
        )
      }

      // Explicitly remove original <a> node content
      return undefined
    }
  })

  return (
    <layout>
      <Container mt="-100px">
        <Section delay={0.1}>
          <main className={styles.main}>
            <div>
              <h1>{page.title}</h1>
              {page.featuredImage && (
                <img src={page.featuredImage.node.sourceUrl} alt={page.title} />
              )}
              <div>{contentWithEmbeddedPDFs}</div>
            </div>
          </main>
        </Section>
      </Container>
    </layout>
  )
}

export async function getServerSideProps() {
  const apolloClient = getApolloClient()
  const { data } = await apolloClient.query({
    query: GET_MEDIA_PRESS_BOOK,
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      page: data?.pageBy ?? null
    }
  }
}
