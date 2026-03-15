import { useState } from 'react'
import {
  SimpleGrid,
  Box,
  Container,
  Divider,
  Button,
  useColorModeValue,
  Flex
} from '@chakra-ui/react'
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import NextLink from 'next/link'
import Bubble from '../components/emoji/heart'
import { getApolloClient } from '../lib/wordpress'
import { useQuery } from '@apollo/client'
import { GET_ALL_POSTS } from '../lib/queries'

function dayMonth(dateString) {
  const monthNames = [
    'null',
    'January',
    'February',
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
  const month = parseInt(dateString.slice(5, 7))
  let day = dateString.slice(8, 10)
  const year = dateString.slice(0, 4)
  if (day[0] === '0') day = day.slice(1)
  return `${monthNames[month]} ${day}, ${year}`
}

export default function Home({ posts }) {
  const apolloClient = getApolloClient()
  const { loading, error } = useQuery(GET_ALL_POSTS, {
    fetchPolicy: 'cache-first',
    client: apolloClient
  })

  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 8
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const postsToDisplay = posts.slice(startIndex, endIndex)
  const totalPages = Math.ceil(posts.length / postsPerPage)

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isBeginning = currentPage === 1
  const isEnd = currentPage === totalPages

  const truncate = (text, length = 120) => {
    if (!text) return ''
    const cleaned = text.replace(/<\/?[^>]+(>|$)/g, '')
    const noTrailingComma = cleaned.replace(/,\s*$/, '')
    if (noTrailingComma.length <= length) return noTrailingComma
    return noTrailingComma.slice(0, length).replace(/\s+\S*$/, '') + '...'
  }

  return (
    <Layout title="Portfolio">
      <Container maxW="5xl" mt="3rem">
        <Section delay={0.2}>
          {/* Pagination Header using Grid */}
          <Flex gap={3} mb={6} alignItems="stretch" height="64px">
            {' '}
            {/* set desired height */}
            {/* Previous Button */}
            <Button
              onClick={goToPreviousPage}
              disabled={isBeginning}
              leftIcon={<ChevronLeftIcon />}
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
              borderRadius="md"
              width="120px"
              height="100%" // stretch to match Flex height
            >
              Previous
            </Button>
            {/* Bubble */}
            <Box flex="1" height="100%">
              {' '}
              {/* stretch bubble to same height */}
              <Bubble text="View my latest posts!" emoji="❤️" />
            </Box>
            {/* Next Button */}
            <Button
              onClick={goToNextPage}
              disabled={isEnd}
              rightIcon={<ChevronRightIcon />}
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
              borderRadius="md"
              width="120px"
              height="100%" // stretch to match Flex height
            >
              Next
            </Button>
          </Flex>

          {/* Posts Grid */}
          <SimpleGrid columns={[2, 2, 4]} gap={4}>
            {postsToDisplay.map(post => {
              const imageUrl =
                post?.featuredImage?.node?.mediaDetails?.sizes?.find(
                  s => s.name === 'thumbnail'
                )?.sourceUrl ??
                post?.featuredImage?.node?.sourceUrl ??
                '/images/Lace-Blades-small.jpeg'

              return (
                <Section delay={0.1} key={post.slug}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    textAlign="center"
                    bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                    css={{ backdropFilter: 'blur(10px)' }}
                    boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
                    borderRadius="10px"
                    padding="4px"
                    height="820px"
                  >
                    <Box flex="1" display="flex" flexDirection="column">
                      <img
                        src={imageUrl}
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '250px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />

                      <Box fontWeight="bold" mt={2}>
                        {post.title}
                      </Box>

                      <Divider mt={2} />

                      <Box mt={2} fontSize="12px">
                        {truncate(post.excerpt, 100)}
                      </Box>

                      <Box
                        mt={2}
                        mb={2}
                        display="flex"
                        flexWrap="wrap"
                        justifyContent="center"
                        alignItems="center"
                      >
                        {post.tags?.nodes?.slice(0, 4)?.map(tag => (
                          <Box
                            key={tag.name}
                            boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
                            fontSize="10px"
                            mr={1}
                            mb={1}
                            borderRadius="10px"
                            px={2}
                            py={1}
                            bg={useColorModeValue(
                              'whiteAlpha.500',
                              'whiteAlpha.200'
                            )}
                            cursor="pointer"
                            onClick={() => (window.location.href = tag.link)}
                          >
                            {tag.name}
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    <NextLink href={post.path} passHref scroll={false}>
                      <Button
                        boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
                        fontSize="14px"
                        mt={2}
                        mb={2}
                        bg={useColorModeValue(
                          'whiteAlpha.500',
                          'whiteAlpha.200'
                        )}
                      >
                        Read More
                      </Button>
                    </NextLink>
                  </Box>
                </Section>
              )
            })}

            {!postsToDisplay || postsToDisplay.length === 0 ? (
              <li>Oops, no posts found!</li>
            ) : null}
          </SimpleGrid>
        </Section>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const apolloClient = getApolloClient()

  const { data } = await apolloClient.query({ query: GET_ALL_POSTS })

  const posts = data?.posts.edges
    .map(({ node }) => node)
    .map(post => ({ ...post, path: `/posts/${post.slug}` }))

  return { props: { posts, cookies: req.headers.cookie ?? '' } }
}
