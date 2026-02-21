'use client'

import NextLink from 'next/link'
import {
  Container,
  Box,
  Link,
  Stack,
  Heading,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useColorModeValue,
  Button,
  useDisclosure
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import {
  LuMenu,
  LuClipboard,
  LuBook,
  LuCastle,
  LuPhone,
  LuShoppingBag,
  LuFileHeart,
  LuPersonStanding
} from 'react-icons/lu'

import Logo from './logo'
import ThemeToggleButton from './buttons/theme-toggle-button'
import TikTokButton from './buttons/tiktok-button'
import LinkedinButton from './buttons/linkedin-button'
import LinktrButton from './buttons/linktr-button'
import WordpressButton from './buttons/wordpress-button'

// Single source of truth for all menu items
const allMenuItems = [
  {
    label: "Georgia's Law",
    icon: <LuCastle size={18} />,
    path: '/georgias-law',
    type: 'icon'
  },
  {
    label: 'Support & Helplines',
    icon: <LuPhone size={18} />,
    path: '/support-helplines',
    type: 'icon'
  },
  { label: 'Blog', icon: <LuBook size={18} />, path: '/posts', type: 'icon' },
  {
    label: 'Contact',
    icon: <LuBook size={18} />,
    path: '/contact',
    type: 'icon'
  },
  {
    label: 'Support Agencies Information',
    icon: <LuBook size={18} />,
    path: '/get-information-agencies',
    type: 'icon'
  },
  {
    label: 'Giving Back - Donations & Fundraisers',
    icon: <LuFileHeart size={18} />,
    path: '/support',
    type: 'icon'
  },
  {
    label: 'Speaking & Testimony',
    icon: <LuPersonStanding size={18} />,
    path: '/support',
    type: 'icon'
  },
  {
    label: 'Shop - Buy the Book',
    icon: <LuShoppingBag size={18} />,
    path: '/get-information-agencies',
    type: 'icon'
  },
  {
    label: "Questions we don't want to answer",
    icon: <LuBook size={18} />,
    path: '/questions-we-dont-want-to-answer',
    type: 'icon'
  },
  {
    label: 'Media & Press',
    icon: <LuBook size={18} />,
    path: '/posts',
    type: 'icon'
  },
  {
    label: 'The Book - How Lace & Blades Became a Book',
    icon: <LuBook size={18} />,
    path: '/posts',
    type: 'icon'
  }
]

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const menuBg = useColorModeValue(
    'rgba(206,158,224,0.95)',
    'rgba(36,31,39,0.95)'
  )
  const menuHover = useColorModeValue(
    'rgba(141,84,180,0.9)',
    'rgba(81,43,113,0.9)'
  )

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue('#e988ec40', '#26192980')}
      style={{ backdropFilter: 'blur(10px)' }}
      zIndex="999"
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <Flex align="center">
          <Heading as="h1" size="lg">
            <Logo />
          </Heading>
        </Flex>

        {/* Desktop Menu */}
        <Stack
          direction="row"
          display={{ base: 'none', md: 'flex' }}
          align="center"
        >
          <Menu isOpen={isOpen} onClose={onClose}>
            <MenuButton
              as={Button}
              onClick={onOpen}
              leftIcon={<LuMenu />}
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
            >
              Menu
            </MenuButton>
            <MenuList
              bg={menuBg}
              style={{ backdropFilter: 'blur(10px)' }}
              maxW="400px"
              minW="300px"
              w="fit-content"
            >
              {/* Icon Grid */}
              <Flex mb={2} px={2}>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(4, 1fr)" // 4 icons per row
                  gap={1} // spacing between icons
                  w="100%"
                  justifyItems="center" // center icons horizontally in each cell
                >
                  {allMenuItems
                    .filter(item => item.type === 'icon')
                    .map(item => (
                      <NextLink
                        key={item.label}
                        href={item.path}
                        passHref
                        legacyBehavior
                      >
                        <Flex
                          as={Link}
                          direction="column"
                          align="center"
                          cursor="pointer"
                          _hover={{ bg: 'whiteAlpha.200' }}
                          p={2}
                          borderRadius="md"
                          onClick={onClose}
                        >
                          {item.icon}
                          <Box fontSize="xs" mt={1}>
                            {item.label}
                          </Box>
                        </Flex>
                      </NextLink>
                    ))}
                </Box>
              </Flex>

              {/* Text Links */}
              {allMenuItems
                .filter(item => item.type === 'text')
                .map(item => (
                  <NextLink
                    key={item.label}
                    href={item.path}
                    passHref
                    legacyBehavior
                  >
                    <MenuItem
                      as={Link}
                      _hover={{ bg: menuHover }}
                      onClick={onClose}
                    >
                      {item.label}
                    </MenuItem>
                  </NextLink>
                ))}
            </MenuList>
          </Menu>
        </Stack>

        {/* Right side social & theme buttons */}
        <Flex flex={1} ml={1} justify="flex-end" align="center">
          <Box ml={2}>
            <TikTokButton />
          </Box>
          <Box ml={2}>
            <LinkedinButton />
          </Box>
          <Box ml={2}>
            <LinktrButton />
          </Box>
          <Box ml={2}>
            <WordpressButton />
          </Box>
          <Box ml={2}>
            <ThemeToggleButton />
          </Box>
          {/* Mobile Menu */}
          <Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
            <Menu isLazy>
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
                _focus={{ boxShadow: 'none' }}
              />
              <MenuList
                bg={menuBg}
                css={{ backdropFilter: 'blur(10px)' }}
                maxW="400px"
                w="fit-content"
              >
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap={2}
                  p={2}
                  justifyItems="center"
                >
                  {allMenuItems.map(item => (
                    <MenuItem
                      key={item.label}
                      as={NextLink}
                      href={item.path}
                      onClick={onClose}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      p={2}
                      borderRadius="md"
                      bg="transparent"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      _focus={{ bg: 'whiteAlpha.200' }}
                      _active={{ bg: 'whiteAlpha.200' }}
                    >
                      {item.icon && <Box mb={1}>{item.icon}</Box>}
                      <Box fontSize="xs" textAlign="center">
                        {item.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Box>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
