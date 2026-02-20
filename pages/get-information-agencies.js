// pages/georgias-law.js
import { getApolloClient } from '../lib/wordpress'
import { Container } from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import Section from '../components/section'
import { GET_SUPPORT_AGENCIES_INFORMATION } from '../lib/queries'

export default function GeorgiasLaw({ page }) {
  if (!page) return <p>Page not found</p>

  return (
    <layout>
      <Container>
        <Section delay={0.1}>
          <main className={styles.main}>
            <div>
              <h1>{page.title}</h1>
              {page.featuredImage && (
                <img src={page.featuredImage.node.sourceUrl} alt={page.title} />
              )}
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
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
    query: GET_SUPPORT_AGENCIES_INFORMATION,
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      page: data?.pageBy ?? null
    }
  }
}
