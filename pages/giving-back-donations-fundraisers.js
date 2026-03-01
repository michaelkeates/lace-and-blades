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
            <div style={{ marginTop: '2rem' }}>
  <iframe
    title="Giving Back Donations & Fundraisers"
    src="https://laceandblades.michaelkeates.co.uk/giving-back-donations-fundraisers/"
    style={{
      width: '100%',
      height: '900px', // adjust height for content
      border: 0,
      overflow: 'hidden',
    }}
    scrolling="no"
  />
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
