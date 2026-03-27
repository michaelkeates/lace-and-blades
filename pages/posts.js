import { useEffect, useState } from 'react'
import {
  SimpleGrid,
  Box,
  Container,
  Divider,
  Button,
  useColorModeValue,
  Flex,
  Image
} from '@chakra-ui/react'
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import NextLink from 'next/link'
import Bubble from '../components/emoji/heart'
import { getApolloClient } from '../lib/wordpress'
import { GET_ALL_POSTS } from '../lib/queries'
import { useRouter } from 'next/router'

export default function Home({ posts = [] }) {
  const router = useRouter()

  // 1. Initialize state. We check if there's a page in the URL immediately.
  const [currentPage, setCurrentPage] = useState(1)

  // 2. Sync state with URL when the component mounts or the query changes
  useEffect(() => {
    if (router.query.page) {
      const pageNum = parseInt(router.query.page)
      if (!isNaN(pageNum)) {
        setCurrentPage(pageNum)
      }
    }
  }, [router.query.page])

  // 3. Calculation logic (Must happen AFTER hooks and BEFORE return)
  const postsPerPage = 8
  const totalPages = Math.ceil(posts.length / postsPerPage)

  // Ensure we don't go out of bounds
  const activePage = Math.min(Math.max(currentPage, 1), totalPages || 1)

  const startIndex = (activePage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const postsToDisplay = posts.slice(startIndex, endIndex)

  const isBeginning = activePage === 1
  const isEnd = activePage === totalPages

  // 4. Navigation Handlers
  const handlePageChange = newPage => {
    setCurrentPage(newPage)
    router.push(
      { pathname: router.pathname, query: { page: newPage } },
      undefined,
      { shallow: true }
    )
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToNextPage = () => {
    if (!isEnd) handlePageChange(activePage + 1)
  }

  const goToPreviousPage = () => {
    if (!isBeginning) handlePageChange(activePage - 1)
  }

  const truncate = (text, length = 120) => {
    if (!text) return ''
    const cleaned = text.replace(/<\/?[^>]+(>|$)/g, '')
    if (cleaned.length <= length) return cleaned
    return cleaned.slice(0, length).replace(/\s+\S*$/, '') + '...'
  }

  return (
    <Layout title="Portfolio">
      <Container maxW="5xl" mt="3rem">
        <Section delay={0.2}>
          {/* Pagination Header */}
          <Flex gap={3} mb={6} alignItems="stretch" height="64px">
            <Button
              onClick={goToPreviousPage}
              isDisabled={isBeginning}
              leftIcon={<ChevronLeftIcon />}
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
              borderRadius="md"
              width="120px"
              height="100%"
            >
              Previous
            </Button>

            <Box flex="1" height="100%">
              <Bubble
                text={`View my latest posts on
 page ${activePage} of ${totalPages}`}
                emoji="❤️"
              />
            </Box>

            <Button
              onClick={goToNextPage}
              isDisabled={isEnd}
              rightIcon={<ChevronRightIcon />}
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
              borderRadius="md"
              width="120px"
              height="100%"
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
                    height="auto"
                    minHeight="610px"
                  >
                    <Box flex="1" display="flex" flexDirection="column">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        w="100%"
                        h={{ base: '150px', sm: '200px', md: '250px' }}
                        objectFit="cover"
                        borderRadius="8px"
                      />
                      <Box fontWeight="bold" mt={2} px={2}>
                        {post.title}
                      </Box>
                      <Divider mt={2} />
                      <Box mt={2} fontSize="12px" px={2}>
                        {truncate(post.excerpt, 100)}
                      </Box>
                    </Box>

                    <NextLink href={post.path} passHref scroll={false}>
                      <Button
                        boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
                        fontSize="14px"
                        mt={2}
                        mb={2}
                        mx={2}
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
          </SimpleGrid>

          {postsToDisplay.length === 0 && (
            <Box textAlign="center" py={10}>
              Oops, no posts found!
            </Box>
          )}
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

  return { props: { posts } }
}
