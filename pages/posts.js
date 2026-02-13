//import Head from 'next/head'
import { useState } from 'react'
import { SimpleGrid, Box, Badge, Container } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'
import NextLink from 'next/link'
import { GET_ALL_POSTS } from '../lib/queries'
import Bubble from '../components/bubbleheader2'

import { Button, useColorModeValue } from '@chakra-ui/react'
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import { getApolloClient } from '../lib/wordpress'
import { useQuery } from '@apollo/client'

function dayMonth(data) {
  const monthNames = [
    //why do i have to include null?
    'null',
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  //split up the string to get the day and month
  var month = parseInt(data.slice(5, 7))
  var day = data.slice(8, 10)
  var year = data.slice(0, 4)

  //remove 0 from 02, 03 etc ... until 10
  if (day[0] == '0') {
    day = day.slice(1, 2)
  }

  //concatenate the two together again and return
  var formatted = monthNames[month] + ' ' + day + ', ' + year

  return formatted
}

export default function Home({ posts }) {
  const apolloClient = getApolloClient() // Get Apollo client instance
  const { loading, error, data } = useQuery(GET_ALL_POSTS, {
    fetchPolicy: 'cache-first', // Add the fetchPolicy here
    client: apolloClient // Provide the client instance to the hook
  })

  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const postsToDisplay = posts.slice(startIndex, endIndex)

  const totalPages = Math.ceil(posts.length / postsPerPage)

  const goToNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))
  }

  const goToPreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1))
  }

  const isBeginning = currentPage === 1
  const isEnd = currentPage === totalPages
  return (
    <Layout title="Portfolio">
      <Container>
        <Bubble text="View the latest posts!" emoji="💪" />
        <Section delay={0.2}>
          <SimpleGrid columns={[2, 2, 2]} gap={4}>
            {postsToDisplay.map(post => (
              <Section delay={0.1} key={post.slug}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  textAlign="center"
                  bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                  css={{ backdropFilter: 'blur(10px)' }}
                  boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05);"
                  borderRadius="10px"
                  padding="1px"
                >
                  <GridItem
                    thumbnail={
                      post?.featuredImage?.node?.sourceUrl ??
                      '/images/Lace-Blades-small.jpeg'
                    }
                    title={post.title}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt
                      }}
                    />
                    <Box
                      borderRadius="4px"
                      marginTop="12px"
                      marginBottom="12px"
                      fontSize={12}
                    >
                      {' '}
                      🗓️ {dayMonth(post.date)}
                    </Box>
                    <Box
                      marginTop="10px"
                      marginBottom="10px"
                      display="flex"
                      flexWrap="wrap"
                      justifyContent="center" // Center the tags horizontally
                      alignItems="center" // Center the tags vertically
                    >
                      {post.tags &&
                      post.tags.nodes &&
                      post.tags.nodes.length > 0
                        ? post.tags.nodes.map(tag => (
                            <Box
                              key={tag.name}
                              boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05);"
                              fontSize="12px" // Make the text smaller
                              marginRight="5px"
                              marginBottom="5px"
                              borderRadius="10px"
                              padding="3px 6px" // Adjust padding to match smaller text
                              bg={useColorModeValue(
                                'whiteAlpha.500',
                                'whiteAlpha.200'
                              )}
                              cursor="pointer"
                              onClick={() => (window.location.href = tag.link)}
                            >
                              {tag.name}
                            </Box>
                          ))
                        : null}
                    </Box>
                  </GridItem>
                  <NextLink href={post.path} passHref scroll={false}>
                    <Button
                      boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05);"
                      fontSize="14px"
                      marginTop="10px"
                      marginBottom="10px"
                      bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                    >
                      Read More
                    </Button>
                  </NextLink>
                </Box>
              </Section>
            ))}
            {!postsToDisplay ||
              (postsToDisplay.length === 0 && <li>Oops, no posts found!</li>)}
          </SimpleGrid>
        </Section>
        <SimpleGrid columns={[2, 1, 2]} gap={4}>
          <Button
            onClick={goToPreviousPage}
            disabled={isBeginning}
            opacity={isBeginning ? 0.5 : 1}
            style={{ pointerEvents: isBeginning ? 'none' : 'auto' }}
            leftIcon={<ChevronLeftIcon />}
            bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
            boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05);"
          >
            Previous
          </Button>
          <Button
            onClick={goToNextPage}
            disabled={isEnd}
            opacity={isEnd ? 0.5 : 1}
            style={{ pointerEvents: isEnd ? 'none' : 'auto' }}
            rightIcon={<ChevronRightIcon />}
            bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
            boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05);"
          >
            Next
          </Button>
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const apolloClient = getApolloClient()

  const { data } = await apolloClient.query({
    query: GET_ALL_POSTS
  })

  const posts = data?.posts.edges
    .map(({ node }) => node)
    .map(post => ({
      ...post,
      path: `/posts/${post.slug}`
    }))

  return {
    props: {
      posts,
      cookies: req.headers.cookie ?? ''
    }
  }
}
