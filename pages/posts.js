import { useEffect, useState } from 'react'
import {
  SimpleGrid,
  Box,
  Container,
  Divider,
  Button,
  useColorModeValue,
  Flex,
  Image,
  Text
} from '@chakra-ui/react'
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import NextLink from 'next/link'
import Bubble from '../components/emoji/heart'
import { getApolloClient } from '../lib/apollo'
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

    // 1. Remove HTML tags
    let cleaned = text.replace(/<\/?[^>]+(>|$)/g, '')

    // 2. Hide/Remove all HTML entities (like &#8220;, &nbsp;, etc.)
    cleaned = cleaned.replace(/&#\d+;/g, '').replace(/&\w+;/g, '')

    // 3. Truncate and add ellipsis
    if (cleaned.length <= length) return cleaned
    return cleaned.slice(0, length).replace(/\s+\S*$/, '') + '...'
  }

  return (
    <Layout title="Portfolio">
      <Container maxW="5xl" mt="3rem">
        <Section delay={0.2}>
          {/* Pagination Header */}
          <Flex gap={{ base: 2, md: 3 }} mb={6} alignItems="stretch" height="64px">
            <Button
              onClick={goToPreviousPage}
              isDisabled={isBeginning}
              leftIcon={<ChevronLeftIcon />}
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
              borderRadius="md"
              // Smaller width on mobile (base), larger on tablet/desktop (md)
              width={{ base: "60px", md: "120px" }}
              height="100%"
            >
              {/* Hide text on mobile to save maximum space */}
              <Text display={{ base: "none", md: "inline" }}>Previous</Text>
            </Button>

            <Box flex="1" height="100%" minW="0">
              <Bubble
                text={`View my latest posts on page ${activePage} of ${totalPages}`}
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
              width={{ base: "60px", md: "120px" }}
              height="100%"
            >
              <Text display={{ base: "none", md: "inline" }}>Next</Text>
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

                      {/* Flex container to align title and emoji */}
                      <Flex
                        fontWeight="bold"
                        mt={2}
                        px={2}
                        alignItems="center"
                        justifyContent="center"
                        gap={1}
                      >
                        {post.title}
                        {post.tags?.nodes?.some(tag => tag.name.toLowerCase() === 'pinned') && (
                          <Box as="span" fontSize="14px">📌</Box>
                        )}
                      </Flex>

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
  let allPosts = []
  let hasNextPage = true
  let endCursor = null

  // Keep fetching until there are no more posts
  while (hasNextPage) {
    const { data } = await apolloClient.query({
      query: GET_ALL_POSTS,
      variables: { after: endCursor }
    })

    const fetchedPosts = data?.posts.edges.map(({ node }) => ({
      ...node,
      path: `/posts/${node.slug}`
    })) || []

    allPosts = [...allPosts, ...fetchedPosts]

    // Update pagination variables for the next loop
    hasNextPage = data?.posts.pageInfo.hasNextPage
    endCursor = data?.posts.pageInfo.endCursor
  }

  // 1. Separate pinned posts from regular posts
  const pinnedPosts = allPosts.filter(post =>
    post.tags?.nodes?.some(tag => tag.name.toLowerCase() === 'pinned')
  )

  const regularPosts = allPosts.filter(post =>
    !post.tags?.nodes?.some(tag => tag.name.toLowerCase() === 'pinned')
  )

  const sortedPosts = [...pinnedPosts, ...regularPosts]

  return {
    props: {
      posts: sortedPosts,
      cookies: req.headers.cookie ?? ''
    }
  }
}