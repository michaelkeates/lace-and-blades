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
import { LuMenu, LuClipboard, LuBook, LuCastle, LuPhone, LuShoppingBag } from 'react-icons/lu'

import Logo from './logo'
import ThemeToggleButton from './buttons/theme-toggle-button'
import TikTokButton from './buttons/tiktok-button'
import LinkedinButton from './buttons/linkedin-button'
import LinktrButton from './buttons/linktr-button'
import WordpressButton from './buttons/wordpress-button'

// Horizontal menu icons (clickable)
const horizontalMenuItems = [
  { label: "Georgia's Law", value: "georgias-law", icon: <LuCastle size={18} />, path: "/georgias-law" },
  { label: "Support & Helplines", icon: <LuPhone size={18} />, path: "/support" },
  { label: "Blog", icon: <LuBook size={18} />, path: "/posts" },
  { label: "Contact", icon: <LuBook size={18} />, path: "/contact" },
  { label: "Get Information", icon: <LuClipboard size={18} />, path: "/get-information-agencies" },
  { label: "Shop - Buy the Book", icon: <LuShoppingBag size={18} />, path: "/get-information-agencies" },
  { label: "Questions we don't want to answer", icon: <LuBook size={18} />, path: "/questions-we-dont-want-to-answer" },
  { label: 'Media & Press', icon: <LuBook size={18} />, path: '/posts' },
]

// Standard menu links
const menuItems = [
  { label: 'The Book - How Lace & Blades Became a Book', path: '/about' },
  { label: 'Support Agencies Information', path: '/resources' },
  { label: 'Giving Back - Donations & Fundraisers', path: '/support' },
  { label: 'Law, Justice & Advocacy', path: '/support' },
  { label: 'Speaking & Testimony', path: '/support' },
  { label: 'Media & Press', path: '/posts' },
]

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure() // ✅ inside component
  const menuBg = useColorModeValue('rgba(206,158,224,0.95)', 'rgba(36,31,39,0.95)')
  const menuHover = useColorModeValue('rgba(141,84,180,0.9)', 'rgba(81,43,113,0.9)')

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
        <Stack direction="row" display={{ base: 'none', md: 'flex' }} align="center">
          <Menu isOpen={isOpen} onClose={onClose}>
            <MenuButton as={Button} onClick={onOpen} leftIcon={<LuMenu />} bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}>
              Menu
            </MenuButton>
<MenuList bg={menuBg} style={{ backdropFilter: 'blur(10px)' }}>
  {/* Horizontal clickable icons */}
  <Flex mb={2} px={2} flexWrap="wrap" justify="space-around">
    {horizontalMenuItems.map((item, index) => (
      <NextLink key={item.value} href={item.path ?? '#'} passHref legacyBehavior>
        <Flex
          as={Link}
          direction="column"
          align="center"
          cursor="pointer"
          _hover={{ bg: 'whiteAlpha.200' }}
          p={2}
          borderRadius="md"
          onClick={onClose}
          flex="1 0 25%" // Each item takes 25% of row → 4 per row
        >
          {item.icon}
          <Box fontSize="xs" mt={1}>{item.label}</Box>
        </Flex>
      </NextLink>
    ))}
  </Flex>

  {/* Standard menu links */}
  {menuItems.map(item => (
    <NextLink key={item.label} href={item.path} passHref legacyBehavior>
      <MenuItem as={Link} _hover={{ bg: menuHover }} onClick={onClose}>
        {item.label}
      </MenuItem>
    </NextLink>
  ))}
</MenuList>
          </Menu>
        </Stack>

        {/* Right side social & theme buttons */}
        <Flex flex={1} ml={1} justify="flex-end" align="center">
          <Box ml={2}><TikTokButton /></Box>
          <Box ml={2}><LinkedinButton /></Box>
          <Box ml={2}><LinktrButton /></Box>
          <Box ml={2}><WordpressButton /></Box>
          <Box ml={2}><ThemeToggleButton /></Box>

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
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                css={{ backdropFilter: 'blur(10px)' }}
              >
                {menuItems.map(item => (
                  <NextLink key={item.label} href={item.path} passHref legacyBehavior>
                    <MenuItem as={Link} _hover={{ bg: menuHover }}>
                      {item.label}
                    </MenuItem>
                  </NextLink>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar