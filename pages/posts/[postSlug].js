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

import parse from 'html-react-parser'

import {
  GET_POST_BY_SLUG,
  GET_ALL_POSTS,
  useCreateCommentMutation
} from '../../lib/queries'

import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

/* ---------------------------
   IMAGE WRAPPING FUNCTION
---------------------------- */
export function parseHtml(html) {
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const images = doc.querySelectorAll('img')

    images.forEach(img => {
      const src = img.getAttribute('src')
      const wrapper = document.createElement('a')
      wrapper.setAttribute('href', src)
      wrapper.setAttribute('target', '_blank')
      img.parentNode.replaceChild(wrapper, img)
      wrapper.appendChild(img)
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

  var month = parseInt(data.slice(5, 7))
  var day = data.slice(8, 10)
  var year = data.slice(0, 4)

  if (day[0] === '0') day = day.slice(1)

  return monthNames[month] + ' ' + day + ', ' + year
}

/* ===========================
          POST PAGE
=========================== */

export default function Post({ post }) {
  const toast = useToast()
  const blockquoteRefs = useRef([])
  const isMounted = useRef(false)

  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [email, setEmail] = useState('')
  const [isCommentValid, setIsCommentValid] = useState(true)

  const [createCommentMutation] = useCreateCommentMutation()

  /* ---------------------------
     PDF EMBEDDING LOGIC
  ---------------------------- */

  const renderedPDFs = new Set()

  const contentWithEmbeddedPDFs = parse(parseHtml(post.content), {
    replace: node => {
      if (
        node.name === 'a' &&
        node.attribs?.href &&
        node.attribs.href.toLowerCase().endsWith('.pdf')
      ) {
        const href = node.attribs.href

        if (renderedPDFs.has(href)) return <></>
        renderedPDFs.add(href)

        const title = node.children?.[0]?.data || 'PDF Document'

        return (
          <Box marginY={4} key={href}>
            <iframe
              src={href}
              width="100%"
              height="600px"
              style={{ border: 'none' }}
            />
            <Box marginTop={2}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            </Box>
          </Box>
        )
      }

      return undefined
    }
  })

  /* ---------------------------
     COMMENT SUBMIT
  ---------------------------- */

  const handleCommentSubmit = async () => {
    if (!authorName || !email || !newComment) {
      setIsCommentValid(false)
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
      <Section delay={0.1}>
        <main className={styles.main}>
          <Box
            borderRadius="lg"
            mb={6}
            p={5}
            textAlign="center"
            bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
            css={{ backdropFilter: 'blur(10px)' }}
            marginTop="-4rem"
          >
            <Blog>
              <div style={{ fontSize: '12px' }}>
                {post.title}
                <Badge ml={2}>{dayMonth(post.date)}</Badge>
              </div>
            </Blog>
          </Box>

          <h1 className={styles.title}>{post.title}</h1>

          <SimpleGrid paddingTop="25px" paddingBottom="25px">
            <Paragraph>
              <div
                className="post-content"
                ref={el => (blockquoteRefs.current = el)}
              >
                {contentWithEmbeddedPDFs}
              </div>
            </Paragraph>
          </SimpleGrid>

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