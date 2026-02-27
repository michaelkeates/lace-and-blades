import Head from 'next/head'
import NextLink from 'next/link'

import {
  Textarea,
  Container,
  Flex,
  Box,
  SimpleGrid,
  Button,
  Divider,
  Input,
  useToast,
  useColorModeValue,
  chakra,
  Badge
} from '@chakra-ui/react'
import { ChevronRightIcon, CopyIcon } from '@chakra-ui/icons'
import Paragraph from '../../components/paragraph'
import Section from '../../components/section'
import Image from 'next/image'
import Layout from '../../components/layouts/article'
import { getApolloClient } from '../../lib/wordpress'

import { Title, Portfolio, Blog, WorkImage, Meta } from '../../components/work'

import styles from '../../styles/Home.module.css'

import AuthorBio from '../../components/post/author-bio'

import {
  GET_POST_BY_SLUG,
  GET_ALL_POSTS,
  useCreateCommentMutation
} from '../../lib/queries'

import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

// Import parseHtml function
export function parseHtml(html) {
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const images = doc.querySelectorAll('img')
    images.forEach(img => {
      const src = img.getAttribute('src')
      const newImg = document.createElement('a')
      newImg.setAttribute('href', src)
      newImg.setAttribute('target', '_blank')
      img.parentNode.replaceChild(newImg, img)
      newImg.appendChild(img)
    })
    return doc.body.innerHTML
  } else {
    return html
  }
}

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

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

export default function Post({ post }) {
  const [isNameValid, setIsNameValid] = useState(true)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isCommentValid, setIsCommentValid] = useState(true)
  const toast = useToast()
  const blockquoteRefs = useRef([])
  const isMounted = useRef(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isPageReloading, setIsPageReloading] = useState(false)

  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [email, setEmail] = useState('')
  const [createCommentMutation, { loading, error, data }] =
    useCreateCommentMutation()

  const handleCommentSubmit = async () => {
    if (!authorName || !email || !newComment) {
      // Update validation status for each field
      setIsNameValid(!!authorName)
      setIsEmailValid(!!email)
      setIsCommentValid(!!newComment)

      // Show error toast for fields that are not valid
      toast({
        title: 'Please fill in all fields.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'topright'
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.match(emailRegex)) {
      setIsEmailValid(false)

      toast({
        title: 'Invalid email format.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'topright'
      })
      return
    }

    try {
      const { data } = await createCommentMutation({
        variables: {
          input: {
            content: newComment,
            commentOn: post.databaseId,
            author: authorName,
            authorEmail: email
          }
        }
      })

      // Show success toast notification
      toast({
        title: 'Comment added!',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'topright'
      })

      // Reset validation status after successful submission
      setIsNameValid(true)
      setIsEmailValid(true)
      setIsCommentValid(true)

      //You can consider removing the page reload
      setIsPageReloading(true)
      setTimeout(() => {
        window.location.reload()
      }, 4000) // Delayed page reload
    } catch (error) {
      console.error('Error creating comment:', error.message)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the updated post data using the slug
        const apolloClient = getApolloClient()
        const postData = await apolloClient.query({
          query: GET_POST_BY_SLUG,
          variables: {
            slug: post.slug
          },
          fetchPolicy: 'cache-first'
        })

        const updatedPost = postData?.data?.postBy

        // TODO: Set the updatedPost to the component state or wherever you need it
      } catch (error) {
        console.error('Error fetching updated post data:', error.message)
      }
    }

    const fetchUpdatedPostData = () => {
      if (isCopied) {
        fetchData() // Fetch the updated post data when isCopied changes (i.e., after the user submits a comment and the page reloads)
      }
    }
    if (!isMounted.current) {
      isMounted.current = true
      const blockquotes = Array.from(
        blockquoteRefs.current.querySelectorAll('pre')
      )
      blockquotes.forEach(blockquote => {
        if (!blockquote.querySelector('.copy-btn')) {
          const quoteText = blockquote.textContent
          const copyButton = document.createElement('div')
          copyButton.style.position = 'absolute'
          copyButton.style.top = '0'
          copyButton.style.right = '0'
          copyButton.style.padding = '7px'
          copyButton.style.opacity = '0'
          copyButton.style.transition = 'opacity 0.3s ease-in-out'

          const handleClick = () => {
            navigator.clipboard.writeText(quoteText)
            setIsCopied(true)
            setTimeout(() => {
              setIsCopied(false)
            }, 2000) // Change the duration here (in milliseconds)
            toast({
              title: 'Text Copied',
              description: 'The text has been copied to the clipboard.',
              status: 'success',
              position: 'top-right',
              duration: 2000, // Change the duration here (in milliseconds)
              isClosable: true
            })
          }

          ReactDOM.render(
            <Button
              className="copy-btn"
              onClick={handleClick}
              onMouseOver={() => {
                copyButton.style.opacity = '1'
              }}
              onMouseOut={() => {
                copyButton.style.opacity = '0'
              }}
            >
              <CopyIcon />
            </Button>,
            copyButton
          )

          blockquote.addEventListener('mouseover', () => {
            copyButton.style.opacity = '1'
          })
          blockquote.addEventListener('mouseout', () => {
            copyButton.style.opacity = '0'
          })

          blockquote.style.position = 'relative'
          blockquote.style.display = 'inline-block'
          blockquote.style.paddingTop = '25px'
          blockquote.appendChild(copyButton)
        }
      })
      fetchData()
    }
    fetchUpdatedPostData()
  }, [isCopied, post.slug])

  return (
    <Layout>
        <Section delay={0.1}>
          <main className={styles.main}>
            <Box
              borderRadius="lg"
              mb={6}
              p={5}
              textAlign="center"
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              css={{ backdropFilter: 'blur(10px)' }}
              paddingBottom="6px"
              width="100%"
              marginTop="-4rem"
              boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05);"
            >
              <Blog>
                <div style={{ fontSize: '12px', fontWeight: 'normal' }}>
                  {post.title}
                  <Badge
                    bg={useColorModeValue('whiteAlpha.100', 'whiteAlpha.000')}
                    color=""
                  >
                    {dayMonth(post.date)}
                  </Badge>
                </div>
              </Blog>
            </Box>
            <h1 className={styles.title}>{post.title}</h1>
            <SimpleGrid paddingTop="25px" paddingBottom="25px">
              <Paragraph>
                <div className="post-content">
                  <div
                    className="post-content"
                    dangerouslySetInnerHTML={{
                      __html: parseHtml(post.content)
                    }}
                    ref={el => (blockquoteRefs.current = el)}
                  />
                </div>
              </Paragraph>
            </SimpleGrid>
            <Divider my={6} />
            <AuthorBio />
          </main>
          <Divider my={6} />
          <div>
            {post.comments.nodes.map(comment => (
              <Box
                key={comment.id}
                borderRadius="lg"
                mb={6}
                p={3}
                alignItems="center"
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                css={{ backdropFilter: 'blur(10px)' }}
                padding="10px"
                boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
              >
                <Flex alignItems="center" mb={2}>
                  {comment.author.node.avatar && (
                    <div>
                      <img
                        src={comment.author.node.avatar.url}
                        alt={`Avatar of ${comment.author.node.name}`}
                        style={{
                          borderRadius: '50%',
                          width: '50px',
                          height: '50px'
                        }}
                      />
                    </div>
                  )}
                  <div style={{ marginLeft: '10px' }}>
                    <div>{comment.author.node.name}</div>
                    <div style={{ fontSize: '11px' }}>{comment.date}</div>
                  </div>
                </Flex>
                <Divider my={1} />
                <div
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                  style={{ fontSize: '14px', marginLeft: '10px' }}
                />
              </Box>
            ))}
            <Box
              borderRadius="lg"
              mb={6}
              p={3}
              alignItems="center"
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              css={{ backdropFilter: 'blur(10px)' }}
              padding="10px"
              boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
              position="relative"
            >
              <Flex
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="space-between"
                height="100%"
              >
                {/* Input box for author name */}
                <Input
                  placeholder="Enter your name"
                  size="md"
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  borderColor={isCommentValid ? undefined : 'red'}
                  marginBottom="10px" // Add some spacing between the input and the textarea
                />
                <Input
                  placeholder="Enter your email"
                  size="md"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  borderColor={isCommentValid ? undefined : 'red'}
                  marginBottom="10px" // Add some spacing between the input and the textarea
                />
                <Textarea
                  placeholder="Enter your comment"
                  size="md"
                  flex="1"
                  value={newComment}
                  borderColor={isCommentValid ? undefined : 'red'}
                  onChange={e => setNewComment(e.target.value)}
                />
                <Button
                  colorScheme="green"
                  color="white"
                  position="flex"
                  bottom="5px"
                  right="5px"
                  marginTop="5px"
                  ml="auto"
                  mt={4}
                  onClick={handleCommentSubmit}
                >
                  Comment
                </Button>
              </Flex>
            </Box>
          </div>
          <NextLink href="/posts" passHref scroll={false}>
            <Button
              rightIcon={<ChevronRightIcon />}
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
            >
              Go Back
            </Button>
          </NextLink>
        </Section>
    </Layout>
  )
}

export async function getServerSideProps({ params, req }) {
  const { postSlug } = params

  const apolloClient = getApolloClient()

  const postData = await apolloClient.query({
    query: GET_POST_BY_SLUG,
    variables: {
      slug: postSlug
    },
    fetchPolicy: 'network-only'
  })

  const post = postData?.data.postBy
  const site = {
    ...postData?.data.generalSettings
  }

  const postsData = await apolloClient.query({
    query: GET_ALL_POSTS
  })

  const posts = postsData?.data.posts.edges.map(({ node }) => node)

  const paths = posts.map(({ slug }) => ({
    params: {
      postSlug: slug
    }
  }))

  return {
    props: {
      post,
      site,
      paths,
      cookies: req.headers.cookie ?? ''
    }
  }
}
