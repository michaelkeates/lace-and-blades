import Logo from './logo'
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
  Button
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import ThemeToggleButton from './buttons/theme-toggle-button'
import TikTokButton from './buttons/tiktok-button'
import LinkedinButton from './buttons/linkedin-button'
import LinktrButton from './buttons/linktr-button'
import WordpressButton from './buttons/wordpress-button'

import { useRouter } from 'next/router'

import { LuHome, LuMenu } from 'react-icons/lu'

const LinkItem = ({ href, path, target, children, ...props }) => {
  const active = path === href
  const inactiveColor = useColorModeValue('gray200', 'whiteAlpha.900')
  return (
    <NextLink href={href} passHref scroll={false}>
      <Link
        p={2}
        //bg={active ? 'grassTeal' : undefined}
        //bg={active ? useColorModeValue('whiteAlpha.400', 'whiteAlpha.200') : undefined}
        color={active ? '#a6bbce' : active}
        target={target}
        //borderRadius="full"
        fontSize="12"
        {...props}
      >
        {children}
      </Link>
    </NextLink>
  )
}

const Navbar = props => {
  const { path } = props
  const router = useRouter()
  const menuBg = useColorModeValue(
    'rgba(81, 43, 113, 0.8)',
    'rgba(141, 84, 180, 0.8)'
  ) // dark/light
  const menuHover = useColorModeValue(
    'rgba(141, 84, 180, 0.9)',
    'rgba(81, 43, 113, 0.9)'
  )

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue('#fb00ffc7', '#ad2bca80')}
      css={{
        backdropFilter: 'blur(10px)',
        transition: 'backdrop-filter 0.3s ease-out'
      }}
      zIndex={999}
      {...props}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        wrap="wrap"
        align="center"
        justify="space-between"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            <Logo />
          </Heading>
        </Flex>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
          p={2}
        >
          {/* Chakra Menu */}
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<LuMenu />}
              aria-label="Toggle theme"
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              padding="10px"
              boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
              color={useColorModeValue('blackAlpha.900', 'whiteAlpha.600')}
              _hover={{ bg: 'rgba(255,255,255,0.25)' }}
              _active={{ bg: 'rgba(255,255,255,0.3)' }}
            >
              Menu
            </MenuButton>

            <MenuList
              borderRadius="md"
              boxShadow="lg"
              portalProps={{ appendToParentPortal: true }}
              s
              style={{
                backgroundColor: menuBg,
                backdropFilter: 'blur(10px)', // <-- frosted glass
                WebkitBackdropFilter: 'blur(10px)'
              }}
            >
              <MenuItem
                icon={<LuMenu size={18} />}
                bg={menuBg}
                color="white"
                _hover={{ bg: menuHover }}
                onClick={() => router.push('/about')}
              >
                The Book - How Lace & Blades Became a Book
              </MenuItem>

              <MenuItem
                icon={<LuMenu size={18} />}
                bg={menuBg}
                color="white"
                _hover={{ bg: menuHover }}
                onClick={() => router.push('/support')}
              >
                Support & Helplines
              </MenuItem>

              <MenuItem
                icon={<LuMenu size={18} />}
                bg={menuBg}
                color="white"
                _hover={{ bg: menuHover }}
                onClick={() => router.push('/support')}
              >
                Resources (Downloads)
              </MenuItem>

              <MenuItem
                icon={<LuMenu size={18} />}
                bg={menuBg}
                color="white"
                _hover={{ bg: menuHover }}
                onClick={() => router.push('/support')}
              >
                Giving Back - Donations & Fundraisers
              </MenuItem>

              <MenuItem
                icon={<LuMenu size={18} />}
                bg={menuBg}
                color="white"
                _hover={{ bg: menuHover }}
                onClick={() => router.push('/support')}
              >
                Law, Justice & Advocacy
              </MenuItem>

              <MenuItem
                icon={<LuMenu size={18} />}
                bg={menuBg}
                color="white"
                _hover={{ bg: menuHover }}
                onClick={() => router.push('/support')}
              >
                Speaking & Testimony
              </MenuItem>

              <MenuItem
                icon={<LuMenu size={18} />}
                bg={menuBg}
                color="white"
                _hover={{ bg: menuHover }}
                onClick={() => router.push('/posts')}
              >
                Blog
              </MenuItem>

              <MenuItem
                icon={<LuMenu size={18} />}
                bg={menuBg}
                color="white"
                _hover={{ bg: menuHover }}
                onClick={() => router.push('/posts')}
              >
                Shop - Buy the Book
              </MenuItem>

              <MenuItem
                icon={<LuMenu size={18} />}
                bg={menuBg}
                color="white"
                _hover={{ bg: menuHover }}
                onClick={() => router.push('/posts')}
              >
                Professionals & Organisations
              </MenuItem>

              <MenuItem
                icon={<LuMenu size={18} />}
                bg={menuBg}
                color="white"
                _hover={{ bg: menuHover }}
                onClick={() => router.push('/posts')}
              >
                Media & Press
              </MenuItem>

              <MenuItem
                icon={<LuMenu size={18} />}
                bg={menuBg}
                color="white"
                _hover={{ bg: menuHover }}
                onClick={() => router.push('/posts')}
              >
                Contact
              </MenuItem>

              <MenuItem
                icon={<LuMenu size={18} />}
                bg={menuBg}
                color="white"
                _hover={{ bg: menuHover }}
                onClick={() => router.push('/posts')}
              >
                Questions we don't want to answer
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
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

          <Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
            <Menu isLazy id="navbar-menu">
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
                _focus={{ boxShadow: 'none' }}
              />
              <MenuList
                bg="{useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}"
                css={{ backdropFilter: 'blur(10px)' }}
              >
                <NextLink href="/about" passHref>
                  <MenuItem
                    bg="{useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}"
                    px={4}
                    py={2}
                    transition="all 0.2s"
                    _hover={{
                      bg: useColorModeValue('whiteAlpha.600', 'whiteAlpha.300')
                    }}
                    _expanded={{ bg: 'blue.400' }}
                    _focus={{ boxShadow: 'none' }}
                    as={Link}
                  >
                    About
                  </MenuItem>
                </NextLink>
                <NextLink href="/repositories" passHref>
                  <MenuItem
                    bg="{useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}"
                    px={4}
                    py={2}
                    transition="all 0.2s"
                    _hover={{
                      bg: useColorModeValue('whiteAlpha.600', 'whiteAlpha.300')
                    }}
                    _expanded={{ bg: 'blue.400' }}
                    _focus={{ boxShadow: 'none' }}
                    as={Link}
                  >
                    Portfolio
                  </MenuItem>
                </NextLink>
                <NextLink href="/posts" passHref>
                  <MenuItem
                    bg="{useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}"
                    px={4}
                    py={2}
                    transition="all 0.2s"
                    _hover={{
                      bg: useColorModeValue('whiteAlpha.600', 'whiteAlpha.300')
                    }}
                    _expanded={{ bg: 'blue.400' }}
                    _focus={{ boxShadow: 'none' }}
                    as={Link}
                  >
                    Blog
                  </MenuItem>
                </NextLink>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
