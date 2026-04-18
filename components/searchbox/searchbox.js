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
  SimpleGrid,
  Spinner
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@apollo/client'
import { SEARCH_POSTS } from '../../lib/queries'

const MotionBox = motion(Box)

const SearchBox = () => {
  const [query, setQuery] = useState('')
  const containerRef = useRef()
  // Track all dimensions to anchor the portal correctly
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })

  // 1. FETCH ON DEMAND
  const { data, loading } = useQuery(SEARCH_POSTS, {
    variables: { search: query },
    skip: query.length < 2, 
  })

  // 2. FORMAT RESULTS
  const results = [
    ...(data?.posts?.nodes?.map(node => ({
      title: node.title,
      path: `/posts/${node.slug}`,
      type: 'post'
    })) || []),
    ...(data?.pages?.nodes?.map(node => ({
      title: node.title,
      path: `/${node.slug}`,
      type: 'page'
    })) || [])
  ]

  // 3. UPDATE COORDINATES
  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }

  useEffect(() => {
    if (query) {
      updateCoords()
      window.addEventListener('resize', updateCoords)
    }
    return () => window.removeEventListener('resize', updateCoords)
  }, [query])

  const menuBg = useColorModeValue('rgba(206, 158, 224, 0.4)', 'rgba(36, 31, 39, 0.5)')
  const textColor = useColorModeValue('blackAlpha.900', 'whiteAlpha.800')
  const menuHover = useColorModeValue('whiteAlpha.400', 'whiteAlpha.200')

  useOutsideClick({
    ref: containerRef,
    handler: () => setQuery('')
  })

  return (
    <Box ref={containerRef} position="relative" w="100%">
      <InputGroup h="40px" bg={useColorModeValue('whiteAlpha.400', 'whiteAlpha.50')} borderRadius="md">
        <InputLeftElement h="40px" pointerEvents="none">
          {loading ? <Spinner size="xs" /> : <SearchIcon opacity={0.7} />}
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
        {query.length >= 2 && (
          <Portal>
            <MotionBox
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              position="absolute"
              zIndex="popover"
              // Positioning logic: anchor to the left of the search bar
              top={`${coords.top + 8}px`}
              left={{ base: "10px", md: `${coords.left}px` }}
              // Width logic: match the search bar on desktop, full width on mobile
              w={{ base: "calc(100vw - 20px)", md: `${coords.width}px` }}
              minW={{ md: "450px" }} 
              maxW="95vw"
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
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                  {!loading && results.length === 0 && (
                    <Box gridColumn="span 2" px={2} py={1} fontSize="xs" color={textColor}>
                      No results found for "{query}"
                    </Box>
                  )}
                  {results.map(page => (
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
                          <Text lineHeight="1.2" fontWeight="500" isTruncated>{page.title}</Text>
                          <Text fontSize="10px" opacity={0.6} textTransform="uppercase">{page.type}</Text>
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