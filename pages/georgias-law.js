// pages/georgias-law.js
import { getApolloClient } from '../lib/wordpress'
import { gql } from '@apollo/client'
import {
  Container,
  Heading,
  Box,
  useColorModeValue,
  chakra,
  Divider,
  Button
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import styles from '../styles/Home.module.css'
import Section from '../components/section'

export const GET_GEORGIAS_LAW_PAGE = gql`
  query GET_GEORGIAS_LAW_PAGE {
    pageBy(uri: "georgias-law") {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`

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

// Fetch fresh content on every request
export async function getServerSideProps() {
  const apolloClient = getApolloClient()
  const { data } = await apolloClient.query({
    query: GET_GEORGIAS_LAW_PAGE,
    fetchPolicy: 'network-only', // always get latest content
  })

  return {
    props: {
      page: data?.pageBy ?? null,
    },
  }
}