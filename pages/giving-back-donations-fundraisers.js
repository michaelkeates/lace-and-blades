// pages/georgias-law.js
import { getApolloClient } from '../lib/wordpress'
import { Container } from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import Section from '../components/section'
import { GET_GIVING_BACK_PAGE } from '../lib/queries'

export default function GivingBackDonationsFundraisers({ page }) {
  if (!page) return <p>Page not found</p>

  return (
    <layout>
        <Section delay={0.1}>
          <main className={styles.main}>
            <h1>{page.title}</h1>

            {page.featuredImage && (
              <img src={page.featuredImage.node.sourceUrl} alt={page.title} />
            )}
            <div>
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
          </main>
        </Section>
    </layout>
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
