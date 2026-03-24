import Head from 'next/head'
import NextLink from 'next/link'
import {
  Textarea,
  Container,
  Heading,
  Box,
  SimpleGrid,
  Button,
  Divider,
  Input,
  useToast,
  useColorModeValue,
  Badge,
  useBreakpointValue
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
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
  const toast = useToast()
  const blockquoteRefs = useRef([])
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [email, setEmail] = useState('')
  const [createCommentMutation] = useCreateCommentMutation()

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
                <div style={{ fontSize: '12px' }}>
                  {post.title}
                  <Badge ml={2} bg="transparent" p={0} textTransform="none">
                    {dayMonth(post.date)}
                  </Badge>
                </div>
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

            <NextLink href="/posts" passHref scroll={false}>
              <Button rightIcon={<ChevronRightIcon />} mt={4}>
                Go Back
              </Button>
            </NextLink>
          </main>
        </Section>
      </Container>
    </Layout>
  )
}

/* ===========================
   SERVER SIDE PROPS
=========================== */
export async function getServerSideProps({ params }) {
  const { postSlug } = params
  const apolloClient = getApolloClient()

  const postData = await apolloClient.query({
    query: GET_POST_BY_SLUG,
    variables: { slug: postSlug },
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      post: postData?.data.postBy
    }
  }
}
