'use client'

import { useState, useRef, useEffect } from 'react'
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
  Portal,
  Text,
  SimpleGrid
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@apollo/client'
import { GET_ALL_POSTS, GET_ALL_PAGES } from '../../lib/queries'

const MotionBox = motion(Box)

const SearchBox = () => {
  const [query, setQuery] = useState('')
  const containerRef = useRef()
  const [topCoord, setTopCoord] = useState(0)

  const { data: postsData } = useQuery(GET_ALL_POSTS)
  const { data: pagesData } = useQuery(GET_ALL_PAGES)

  // We only need the Top coordinate now, because Right will be fixed to the page edge
  const updateTopCoord = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setTopCoord(rect.bottom + window.scrollY)
    }
  }

  useEffect(() => {
    if (query) {
      updateTopCoord()
      window.addEventListener('resize', updateTopCoord)
    }
    return () => window.removeEventListener('resize', updateTopCoord)
  }, [query])

  const menuBg = useColorModeValue('rgba(206, 158, 224, 0.4)', 'rgba(36, 31, 39, 0.5)')
  const textColor = useColorModeValue('blackAlpha.900', 'whiteAlpha.800')
  const menuHover = useColorModeValue('whiteAlpha.400', 'whiteAlpha.200')

  useOutsideClick({
    ref: containerRef,
    handler: () => setQuery('')
  })

  const searchablePages = [
    ...(postsData?.posts?.edges?.map(({ node }) => ({ title: node.title, path: `/posts/${node.slug}`, type: 'post' })) || []),
    ...(pagesData?.pages?.nodes?.map(page => ({ title: page.title, path: `/${page.slug}`, type: 'page' })) || [])
  ]

  const results = searchablePages.filter(page => 
    page.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Box ref={containerRef} position="relative" w={{ base: "120px", md: "250px" }}>
      <InputGroup
        h="40px"
        bg={useColorModeValue('whiteAlpha.400', 'whiteAlpha.50')}
        css={{ backdropFilter: 'blur(10px)' }}
        borderRadius="md"
      >
        <InputLeftElement h="40px" pointerEvents="none">
          <SearchIcon opacity={0.7} />
        </InputLeftElement>
        <Input
          h="40px"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          border="none"
          _focus={{ boxShadow: 'none' }}
          color={textColor}
          fontSize="sm"
        />
      </InputGroup>

      <AnimatePresence>
        {query && (
          <Portal>
            <MotionBox
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              position="absolute"
              top={`${topCoord + 8}px`}
              
              /* --- RIGHT SIDE OF WEBSITE ALIGNMENT --- */
              right="20px" // This keeps it 20px away from the right edge of the whole page
              
              w={{ base: "calc(100vw - 40px)", md: "600px" }} // Wider menu for better 2x2 rows
              maxW="1200px" // Prevents it from getting too huge on ultra-wide screens
              zIndex="popover"
              p={3}
              borderRadius="xl"
              boxShadow="2xl"
              sx={{
                backdropFilter: 'blur(15px) !important',
                WebkitBackdropFilter: 'blur(15px) !important',
                backgroundColor: menuBg, 
                border: '1px solid',
                borderColor: useColorModeValue('whiteAlpha.400', 'whiteAlpha.200')
              }}
            >
              <List>
                <SimpleGrid columns={2} spacing={2}>
                  {results.length === 0 && (
                    <Box gridColumn="span 2" px={2} py={1} fontSize="xs" color={textColor}>
                      No results found
                    </Box>
                  )}
                  {results.slice(0, 8).map(page => (
                    <ListItem key={page.path}>
                      <NextLink href={page.path} passHref legacyBehavior>
                        <Link
                          display="block"
                          px={3}
                          py={2}
                          color={textColor}
                          borderRadius="lg"
                          fontSize="sm"
                          _hover={{ bg: menuHover, textDecoration: 'none' }}
                          onClick={() => setQuery('')}
                        >
                          <Text 
                            lineHeight="1.2" 
                            fontWeight="500" 
                            isTruncated
                          >
                            {page.title}
                          </Text>
                          <Text fontSize="10px" opacity={0.6} textTransform="uppercase">
                            {page.type}
                          </Text>
                        </Link>
                      </NextLink>
                    </ListItem>
                  ))}
                </SimpleGrid>
              </List>
            </MotionBox>
          </Portal>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default SearchBox