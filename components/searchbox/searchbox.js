'use client'

import { useState, useRef } from 'react'
import NextLink from 'next/link'
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Link,
  useColorModeValue,
  useOutsideClick,
  Container
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@apollo/client'
import { GET_ALL_POSTS, GET_ALL_PAGES } from '../../lib/queries'

const MotionBox = motion(Box)

const SearchBox = () => {
  const [query, setQuery] = useState('')
  const ref = useRef()

  const { data: postsData } = useQuery(GET_ALL_POSTS)
  const { data: pagesData } = useQuery(GET_ALL_PAGES)

  const menuBg = useColorModeValue(
    'rgba(206,158,224,0.95)',
    'rgba(36,31,39,0.95)'
  )
  const menuHover = useColorModeValue(
    'rgba(255, 201, 250, 0.9)',
    'rgba(100, 100, 100, 0.9)'
  )
  // Inside your component
  const iconOpacity = useColorModeValue(1, 0.7) // 1 for light, 0.7 for dark
  const placeholderOpacity = useColorModeValue(1, 0.6)
  const textColor = useColorModeValue('blackAlpha.900', 'whiteAlpha.800')
  const placeholderColor = useColorModeValue(
    `rgba(0,0,0,${placeholderOpacity})`,
    `rgba(255,255,255,${placeholderOpacity})`
  )

  useOutsideClick({
    ref,
    handler: () => setQuery('')
  })

  // --- Convert WordPress posts ---
  const wpPosts =
    postsData?.posts?.edges?.map(({ node }) => ({
      title: node.title,
      path: `/posts/${node.slug}`,
      type: 'post',
      keywords: [
        node.title.toLowerCase(),
        ...(node.categories?.nodes?.map(c => c.name.toLowerCase()) || []),
        ...(node.tags?.nodes?.map(t => t.name.toLowerCase()) || [])
      ]
    })) || []

  // --- Convert WordPress pages ---
  const wpPages =
    pagesData?.pages?.nodes?.map(page => {
      const textContent = page.content
        .replace(/<[^>]+>/g, '') // remove HTML tags
        .replace(/[^\w\s]/g, ' ') // remove punctuation
        .toLowerCase() // lowercase
      const words = textContent.split(/\s+/).filter(Boolean)
      return {
        title: page.title,
        path: `/${page.slug}`,
        type: 'page',
        keywords: [page.title.toLowerCase(), ...words]
      }
    }) || []

  const searchablePages = [...wpPages, ...wpPosts]

  // Filter results
  const results = searchablePages.filter(page => {
    const q = query.toLowerCase()
    return (
      page.title.toLowerCase().includes(q) ||
      page.keywords.some(k => k.includes(q))
    )
  })

  const closeSearch = () => setQuery('')

  return (
    <Box ref={ref} position="relative" w={{ base: "120px", md: "250px" }}>
      <InputGroup
        h="40px"
        bg={useColorModeValue('whiteAlpha.400', 'whiteAlpha.50')}
        css={{ backdropFilter: 'blur(10px)' }}
        borderRadius="md"
        boxShadow="0px 0px 12px rgba(0,0,0,0.05)"
      >
        <InputLeftElement h="40px" pointerEvents="none">
          <SearchIcon opacity={iconOpacity} />
        </InputLeftElement>

        <Input
          h="40px"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          border="none"
          _focus={{ boxShadow: 'none' }}
          color={textColor}
          caretColor={textColor}
          fontSize="sm"
          _placeholder={{ color: placeholderColor }}
        />
      </InputGroup>

      <AnimatePresence>
        {query && (
          <MotionBox
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            position="absolute"
            top="120%" // positions it right below the input
            right={0} // aligns the right edge with the input's right edge
            w="260px"
            bg={menuBg}
            style={{ backdropFilter: 'blur(10px)' }}
            borderRadius="md"
            boxShadow="lg"
            zIndex={2000}
            p={2}
          >
            <List display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
              {results.length === 0 && (
                <Box gridColumn="span 2" px={2} py={1} fontSize="xs">
                  No results
                </Box>
              )}

              {results.slice(0, 8).map(page => (
                <ListItem key={page.path}>
                  <NextLink href={page.path} passHref legacyBehavior>
                    <Link
                      display="block"
                      px={2}
                      py={1}
                      color={textColor}
                      borderRadius="md"
                      fontSize="sm"
                      _hover={{ bg: menuHover }}
                      onClick={closeSearch}
                    >
                      <Box lineHeight="1.2">{page.title}</Box>
                      <Box fontSize="xs" opacity={0.6}>
                        {page.type === 'post' ? 'Post' : 'Page'}
                      </Box>
                    </Link>
                  </NextLink>
                </ListItem>
              ))}
            </List>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default SearchBox
