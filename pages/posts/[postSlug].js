import Head from 'next/head'
import NextLink from 'next/link'
import {
  Textarea,
  Container,
  Heading,
  Box,
  HStack,
  Button,
  Divider,
  Input,
  useToast,
  useColorModeValue,
  Badge,
  useBreakpointValue,
  Text,
  useClipboard,
  Tooltip,
  IconButton,
  Image
} from '@chakra-ui/react'
import { ChevronRightIcon, CopyIcon } from '@chakra-ui/icons'
import Paragraph from '../../components/paragraph'
import Section from '../../components/section'
import Layout from '../../components/layouts/article'
import { getApolloClient } from '../../lib/wordpress'
import { Blog } from '../../components/work'
import AuthorBio from '../../components/post/author-bio'
import styles from '../../styles/Home.module.css'
import { parseHtmlContent } from '../../lib/wordpress-parser'
import { GET_POST_BY_SLUG, useCreateCommentMutation } from '../../lib/queries'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { INCREMENT_VIEWS_MUTATION } from '../../lib/queries'

/* ---------------------------
   DATE FORMAT
---------------------------- */
function dayMonth(data) {
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

  let month = parseInt(data.slice(5, 7))
  let day = data.slice(8, 10)
  let year = data.slice(0, 4)

  if (day[0] === '0') day = day.slice(1)

  return monthNames[month] + ' ' + day + ', ' + year
}

/* ===========================
          POST PAGE
=========================== */
export default function Post({ post }) {
  const router = useRouter()
  const { onCopy, hasCopied } = useClipboard(
    `https://www.laceandblades.co.uk/posts/${post?.slug || ''}`
  )
  const [scroll, setScroll] = useState(0)
  const wordsPerMinute = 200
  const noHtml = post.content.replace(/<\/?[^>]+(>|$)/g, '')
  const wordCount = noHtml.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  const toast = useToast()
  const blockquoteRefs = useRef([])
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [email, setEmail] = useState('')
  const [createCommentMutation] = useCreateCommentMutation()

  const [incrementViews] = useMutation(INCREMENT_VIEWS_MUTATION)

  useEffect(() => {
    if (post?.databaseId) {
      incrementViews({ variables: { id: post.databaseId } }).catch(e =>
        console.error('Could not increment views:', e)
      )
    }
  }, [post?.databaseId, incrementViews])

  /* ---------------------------
     SCROLL TO TOP ON LOAD
  ---------------------------- */
  useEffect(() => window.scrollTo(0, 0), [])

  /* ---------------------------
     PARSE CONTENT
     Uses wordpress-parser to render
     images, videos, PDFs, buttons, pullquotes
  ---------------------------- */
  const contentWithMedia = parseHtmlContent(post.content, isMobile)

  useEffect(() => {
    const onScroll = () => {
      const winScroll = document.documentElement.scrollTop
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setScroll(scrolled)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ---------------------------
     COMMENT SUBMIT
  ---------------------------- */
  const handleCommentSubmit = async () => {
    if (!authorName || !email || !newComment) {
      toast({
        title: 'Please fill in all fields.',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
      return
    }

    try {
      await createCommentMutation({
        variables: {
          input: {
            content: newComment,
            commentOn: post.databaseId,
            author: authorName,
            authorEmail: email
          }
        }
      })

      toast({
        title: 'Comment added!',
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      setTimeout(() => window.location.reload(), 2000)
    } catch (error) {
      console.error(error)
    }
  }

  /* ===========================
          RENDER
  =========================== */
  return (
    <Layout>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        height="3px"
        bg={useColorModeValue('whiteAlpha.600', 'whiteAlpha.500')}
        zIndex="1000"
        style={{ width: `${scroll}%` }} // This connects the state to the width
        transition="width 0.1s ease-out"
      />
      <Container maxWidth="4xl">
        <Section delay={0.1}>
          <main className={styles.main}>
            <Box
              borderRadius="lg"
              mt={6}
              mb={2}
              p={2}
              pt={4}
              textAlign="center"
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              css={{ backdropFilter: 'blur(10px)' }}
            >
              <Blog>
                <div style={{ fontSize: '12px' }}>{post.title}</div>
              </Blog>
            </Box>

            <Heading
              as="h1"
              fontSize="7xl"
              fontFamily="CartaMarina"
              textAlign="center"
            >
              {post.title}
            </Heading>

            {post.tags?.edges?.length > 0 && (
              <Box
                marginTop="10px"
                marginBottom="10px"
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
              >
                {post.tags.edges.map(edge => (
                  <Box
                    key={edge.node.name}
                    boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
                    fontSize="11px"
                    marginRight="5px"
                    marginBottom="5px"
                    borderRadius="10px"
                    padding="3px 6px"
                    bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                    cursor="pointer"
                  >
                    {edge.node.name}
                  </Box>
                ))}
              </Box>
            )}

            {/* --- NEW DETAILS SECTION --- */}
            <Box mt={4} textAlign="center">
              <Divider mb={4} />
              <HStack
                justifyContent="center"
                alignItems="center" // Ensures everything is vertically centered
                spacing={3}
                fontSize="12px"
                textTransform="none"
                letterSpacing="normal"
              >
                {/* Common Style for all Boxes */}
                {[
                  // Category Box
                  post.categories?.nodes?.length > 0 && {
                    label: 'Category',
                    value: post.categories.nodes[0].name
                  },
                  // Author Box
                  {
                    label: 'Author',
                    value: `${post.author?.node?.firstName} ${post.author?.node?.lastName}`
                  },
                  // Updated Box
                  {
                    label: 'Updated',
                    value: dayMonth(post.modified)
                  },
                  // Read Time Box
                  {
                    label: 'Read',
                    value: `${readingTime} min`
                  }
                ]
                  .filter(Boolean)
                  .map((item, index) => (
                    <Box
                      key={index}
                      borderRadius="lg"
                      px={3}
                      py={2} // Consistent vertical padding
                      bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                      css={{ backdropFilter: 'blur(10px)' }}
                      boxShadow="0px 0px 8px 0px rgba(0,0,0,0.02)"
                    >
                      <Text as="span" fontWeight="bold">
                        {item.label}:{' '}
                      </Text>
                      {item.value}
                    </Box>
                  ))}

                {/* Copy Button - Now aligned perfectly */}
                <Tooltip
                  label={hasCopied ? 'Copied!' : 'Copy Link'}
                  closeOnClick={false}
                >
                  <IconButton
                    size="md" // Changed to md to match the height of the boxes better
                    variant="ghost" // Makes it blend in better
                    aria-label="Copy Link"
                    icon={<CopyIcon />}
                    onClick={onCopy}
                    bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                    css={{ backdropFilter: 'blur(10px)' }}
                    _hover={{
                      bg: useColorModeValue('green.100', 'green.800')
                    }}
                    borderRadius="lg"
                    height="38px" // Matches the height of the text boxes
                  />
                </Tooltip>
              </HStack>
              <Divider mt={4} />
            </Box>
            {/* --- END DETAILS SECTION --- */}

            {/* --- FEATURED IMAGE --- */}
            {post.featuredImage?.node?.sourceUrl && (
              <Box mt={6} mb={10} textAlign="center">
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.title}
                  borderRadius="20px"
                  width="100%"
                  maxHeight="600px" // Slightly taller to give it room
                  objectFit="contain" // Shows the full image, no cropping
                  bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                  boxShadow="0px 10px 30px rgba(0,0,0,0.1)"
                />
              </Box>
            )}
            {/* --- END FEATURED IMAGE --- */}

            <Box w="100%" py="25px">
              {/* Remove the <Paragraph> wrapper here so the content can use the full 4xl width */}
              <Box
                w="100%"
                className="post-content"
                ref={el => (blockquoteRefs.current = el)}
              >
                {contentWithMedia}
              </Box>
            </Box>

            <Divider my={6} />
            <AuthorBio />

            {/* COMMENTS */}
            <Divider my={6} />
            {post.comments.nodes.map(comment => (
              <Box key={comment.id} mb={4} p={3} borderRadius="lg">
                <div dangerouslySetInnerHTML={{ __html: comment.content }} />
              </Box>
            ))}

            {/* COMMENT FORM */}
            <Box p={3} borderRadius="lg">
              <Input
                placeholder="Enter your name"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                mb={2}
              />
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                mb={2}
              />
              <Textarea
                placeholder="Enter your comment"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                mb={2}
              />
              <Button colorScheme="green" onClick={handleCommentSubmit}>
                Comment
              </Button>
            </Box>

            <Button
              rightIcon={<ChevronRightIcon />}
              mt={4}
              onClick={() => router.back()} // Use router.back() instead of NextLink
            >
              Go Back
            </Button>
          </main>
        </Section>
      </Container>
    </Layout>
  )
}

/* ===========================
   SERVER SIDE PROPS
=========================== */
export async function getServerSideProps({ params, req }) {
  const { postSlug } = params
  const apolloClient = getApolloClient()

  const postData = await apolloClient.query({
    query: GET_POST_BY_SLUG,
    variables: { slug: postSlug },
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      post: postData?.data.postBy,
      cookies: req.headers.cookie ?? ''
    }
  }
}