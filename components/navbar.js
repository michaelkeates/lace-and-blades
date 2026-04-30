'use client'

import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import {
  Container,
  Box,
  Link,
  Stack,
  Flex,
  Menu,
  MenuList,
  MenuButton,
  IconButton,
  useColorModeValue,
  Button,
  useDisclosure,
  Divider,
  Text,
  Portal,
  Icon
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import {
  LuMenu,
  LuBook,
  LuCastle,
  LuPhone,
  LuShoppingBag,
  LuFileHeart,
  LuPersonStanding,
  LuInstagram,
  LuLink,
  LuYoutube,
  LuPin,
  LuHeart
} from 'react-icons/lu'
import { FaTiktok } from 'react-icons/fa'
import { gql } from '@apollo/client'
import { getApolloClient } from '../lib/apollo'

import Logo from './logo'
import ThemeToggleButton from './buttons/theme-toggle-button'
import SearchBox from './searchbox/searchbox'
import QuickExitButton from './buttons/quick-exit'

const GET_NAVBAR_POSTS = gql`
  query GetNavbarPosts {
    posts(first: 50) {
      nodes {
        title
        slug
        tags(first: 100) {
          nodes {
            name
          }
        }
      }
    }
  }
`

const allMenuItems = [
  { label: "Georgia's Law", icon: <LuCastle size={18} />, path: '/georgias-law' },
  { label: 'Support & Helplines', icon: <LuPhone size={18} />, path: '/support-helplines' },
  { label: 'Blog', icon: <LuBook size={18} />, path: '/posts' },
  { label: 'Support Agencies Information', icon: <LuBook size={18} />, path: '/get-information-agencies' },
  { label: 'Giving Back - Donations & Fundraisers', icon: <LuFileHeart size={18} />, path: '/giving-back-donations-fundraisers' },
  { label: 'Speaking & Testimony', icon: <LuPersonStanding size={18} />, path: '/speaking-testimony' },
  { label: 'My Story of Survival', icon: <LuShoppingBag size={18} />, path: '/shop' },
  { label: "Questions we don't want to answer", icon: <LuBook size={18} />, path: '/questions-we-dont-want-to-answer' },
  { label: 'Terms, Transparency, Privacy & Affiliations', icon: <LuBook size={18} />, path: '/terms-transparency-privacy-affiliations' },
  { label: 'With Thanks to', icon: <LuHeart size={18} />, path: '/with-thanks-to' }
]

const socialItems = [
  { label: 'Instagram', icon: <LuInstagram size={18} />, path: 'https://www.instagram.com/lace_blades/', external: true },
  { label: 'Linktree', icon: <LuLink size={18} />, path: 'https://linktr.ee/laceandblades/', external: true },
  { label: 'TikTok', icon: <FaTiktok size={18} />, path: 'https://www.tiktok.com/@lace_blades?_r=1&_t=zn-92jym5mhogm/', external: true },
  { label: 'YouTube', icon: <LuYoutube size={18} />, path: 'https://www.youtube.com/@Lace-BladesGrace', external: true }
]

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const mobileDisc = useDisclosure()
  const [navPosts, setNavPosts] = useState([])

  useEffect(() => {
    const fetchNavPosts = async () => {
      try {
        const client = getApolloClient()
        const { data } = await client.query({ query: GET_NAVBAR_POSTS })
        const nodes = data?.posts?.nodes || []

        const pinned = nodes.filter(p =>
          p.tags?.nodes?.some(t => t.name.trim().toLowerCase() === 'pinned')
        )
        const regular = nodes.filter(p =>
          !p.tags?.nodes?.some(t => t.name.trim().toLowerCase() === 'pinned')
        )

        // STRICT LIMIT: 4 posts maximum, pinned first.
        const combined = [...pinned, ...regular].slice(0, 4)
        setNavPosts(combined)
      } catch (e) {
        console.error("Error loading navbar posts:", e)
      }
    }
    fetchNavPosts()
  }, [])

  const renderItemContent = (label, icon, path, closeAction, external = false) => {
    const commonProps = {
      p: 2,
      borderRadius: "md",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start", // Changed to flex-start for title consistency
      cursor: "pointer",
      _hover: { bg: 'whiteAlpha.200', transform: 'scale(1.05)' },
      transition: "all 0.2s",
      minH: "70px" // Ensures items with 1-line vs 2-line text stay same height
    }

    const inner = (
      <>
        <Box mb={1} flexShrink={0}>{icon}</Box>
        <Text
          fontSize="xs" // Restored to standard size
          textAlign="center"
          noOfLines={2}
          lineHeight="1.2"
          wordBreak="break-word"
        >
          {label}
        </Text>
      </>
    )

    if (external) {
      return (
        <Link key={label} href={path} target="_blank" rel="noopener noreferrer" onClick={closeAction} {...commonProps}>
          {inner}
        </Link>
      )
    }

    return (
      <NextLink key={path} href={path} passHref legacyBehavior>
        <Flex as={Link} onClick={closeAction} {...commonProps}>
          {inner}
        </Flex>
      </NextLink>
    )
  }

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue('#e988ec40', '#26192980')}
      top={0}
      left={0}
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      zIndex="999"
    >
      <Container display="flex" p={2} maxW="container.md" align="center" justify="space-between">
        <Flex align="center" h="40px" marginRight={2}>
          <Logo />
        </Flex>

        <Stack direction="row" display={{ base: 'none', md: 'flex' }}>
          <Menu isOpen={isOpen} onClose={onClose}>
            <MenuButton
              as={Button}
              onClick={onOpen}
              leftIcon={<LuMenu />}
              variant="ghost"
              fontSize="sm"
              bg={useColorModeValue('whiteAlpha.600', 'whiteAlpha.100')}
            >
              Menu
            </MenuButton>
            <Portal>
              <MenuList
                maxW="450px"
                minW="350px"
                sx={{
                  backdropFilter: 'blur(15px) !important',
                  backgroundColor: useColorModeValue('rgba(206,158,224,0.8)', 'rgba(31, 26, 33, 0.9)')
                }}
              >
                <Text px={3} mb={1} fontSize="xs" fontWeight="bold" textTransform="uppercase" opacity={0.6} textAlign="center">
                  Pages
                </Text>
                {/* Main Pages Grid */}
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1} p={2}>
                  {allMenuItems.map(item => renderItemContent(item.label, item.icon, item.path, onClose))}
                </Box>

                {/* Latest Posts Grid - Capped at 4 items */}
                {navPosts.length > 0 && (
                  <>
                    <Divider my={2} />
                    <Text px={3} mb={1} fontSize="xs" fontWeight="bold" textTransform="uppercase" opacity={0.6} textAlign="center">
                      Latest Posts
                    </Text>
                    <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1} p={2}>
                      {navPosts.map(post => {
                        const isPinned = post.tags?.nodes?.some(t => t.name.trim().toLowerCase() === 'pinned')
                        return renderItemContent(
                          post.title,
                          <Icon as={isPinned ? LuPin : LuBook} color={isPinned ? "red.400" : "inherit"} size={18} />,
                          `/posts/${post.slug}`,
                          onClose
                        )
                      })}
                    </Box>
                  </>
                )}

                <Divider my={2} />
                <Text px={3} mb={1} fontSize="xs" fontWeight="bold" textTransform="uppercase" opacity={0.6} textAlign="center">
                  Social
                </Text>
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1} px={2} pb={2}>
                  {socialItems.map(item => renderItemContent(item.label, item.icon, item.path, onClose, true))}
                </Box>
              </MenuList>
            </Portal>
          </Menu>
        </Stack>

        <Flex flex={1} ml={1} justify="flex-end" align="center">
          <Box ml={2} flex="1"><SearchBox /></Box>
          <Box ml={2}><QuickExitButton /></Box>
          <Box ml={2}><ThemeToggleButton /></Box>

          <Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
            <Menu isOpen={mobileDisc.isOpen} onClose={mobileDisc.onClose}>
              <MenuButton as={IconButton} icon={<HamburgerIcon />} variant="outline" onClick={mobileDisc.onOpen} />
              <Portal>
                <MenuList
                  maxW="320px"
                  sx={{
                    backdropFilter: 'blur(15px) !important',
                    backgroundColor: useColorModeValue('rgba(206,158,224,0.9)', 'rgba(36,31,39,0.9)')
                  }}
                >
                  <Text px={3} mb={1} fontSize="xs" fontWeight="bold" textTransform="uppercase" opacity={0.6} textAlign="center">
                    Pages
                  </Text>
                  <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} p={2}>
                    {allMenuItems.map(item => renderItemContent(item.label, item.icon, item.path, mobileDisc.onClose))}
                  </Box>

                  {navPosts.length > 0 && (
                    <>
                      <Divider my={2} />
                      <Text px={3} mb={1} fontSize="xs" fontWeight="bold" textTransform="uppercase" opacity={0.6} textAlign="center">
                        Latest Posts
                      </Text>
                      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} p={2}>
                        {navPosts.map(post => {
                          const isPinned = post.tags?.nodes?.some(t => t.name.trim().toLowerCase() === 'pinned')
                          return renderItemContent(
                            post.title,
                            <Icon as={isPinned ? LuPin : LuBook} color={isPinned ? "red.400" : "inherit"} size={18} />,
                            `/posts/${post.slug}`,
                            mobileDisc.onClose
                          )
                        })}
                      </Box>
                    </>
                  )}

                  <Divider my={2} />
                  <Text px={3} mb={1} fontSize="xs" fontWeight="bold" textTransform="uppercase" opacity={0.6} textAlign="center">
                    Social
                  </Text>
                  <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} px={2} pb={2}>
                    {socialItems.map(item => renderItemContent(item.label, item.icon, item.path, mobileDisc.onClose, true))}
                  </Box>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar