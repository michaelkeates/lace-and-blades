'use client'

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
  Portal
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
  LuDoorClosed,
  LuInstagram,
  LuLink,
  LuYoutube
} from 'react-icons/lu'
import { FaTiktok } from 'react-icons/fa'

import Logo from './logo'
import ThemeToggleButton from './buttons/theme-toggle-button'
import SearchBox from './searchbox/searchbox'
import QuickExitButton from './buttons/quick-exit'

const allMenuItems = [
  {
    label: "Georgia's Law",
    icon: <LuCastle size={18} />,
    path: '/georgias-law'
  },
  {
    label: 'Support & Helplines',
    icon: <LuPhone size={18} />,
    path: '/support-helplines'
  },
  { label: 'Blog', icon: <LuBook size={18} />, path: '/posts' },
  {
    label: 'Support Agencies Information',
    icon: <LuBook size={18} />,
    path: '/get-information-agencies'
  },
  {
    label: 'Giving Back - Donations & Fundraisers',
    icon: <LuFileHeart size={18} />,
    path: '/giving-back-donations-fundraisers'
  },
  {
    label: 'Speaking & Testimony',
    icon: <LuPersonStanding size={18} />,
    path: '/speaking-testimony'
  },
  {
    label: 'Shop - Buy the Book',
    icon: <LuShoppingBag size={18} />,
    path: '/shop'
  },
  {
    label: "Questions we don't want to answer",
    icon: <LuBook size={18} />,
    path: '/questions-we-dont-want-to-answer'
  },
  {
    label: 'Campaign News & Action',
    icon: <LuBook size={18} />,
    path: '/media-press'
  },
  {
    label: 'Terms, Transparency, Privacy & Affiliations',
    icon: <LuBook size={18} />,
    path: '/terms-transparency-privacy-affiliations'
  }
]

const socialItems = [
  {
    label: 'Instagram',
    icon: <LuInstagram size={18} />,
    path: 'https://www.instagram.com/lace_blades/',
    external: true
  },
  {
    label: 'Linktree',
    icon: <LuLink size={18} />,
    path: 'https://linktr.ee/laceandblades/',
    external: true
  },
  {
    label: 'TikTok',
    icon: <FaTiktok size={18} />,
    path: 'https://www.tiktok.com/@lace_blades?_r=1&_t=zn-92jym5mhogm/',
    external: true
  },
  {
    label: 'YouTube',
    icon: <LuYoutube size={18} />,
    path: 'https://www.youtube.com/@Lace-BladesGrace',
    external: true
  }
]

const adminItems = [
  {
    label: 'Admin Login',
    icon: <LuDoorClosed size={18} />,
    path: 'https://laceandblades.michaelkeates.co.uk/wp-login.php',
    external: true
  },
  {
    label: 'Analytics',
    icon: <LuBook size={18} />,
    path: '/analytics'
  }
]

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const mobileDisc = useDisclosure()

  // FIXED: Lowering opacity to 0.4 so the blur is visible
  const menuBg = useColorModeValue(
    'rgba(206,158,224,0.4)',
    'rgba(36,31,39,0.5)'
  )

  const renderMenuItem = (item, isMobileItem = false) => {
    const closeAction = isMobileItem ? mobileDisc.onClose : onClose

    if (item.external) {
      return (
        <Link
          key={item.label}
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeAction}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          borderRadius="md"
          _hover={{ bg: 'whiteAlpha.200', transform: 'scale(1.05)' }}
        >
          {item.icon && <Box mb={1}>{item.icon}</Box>}
          <Box fontSize="xs" textAlign="center">
            {item.label}
          </Box>
        </Link>
      )
    }

    return (
      <NextLink key={item.label} href={item.path} passHref legacyBehavior>
        <Flex
          as={Link}
          direction="column"
          align="center"
          cursor="pointer"
          onClick={closeAction}
          p={2}
          borderRadius="md"
          _hover={{ bg: 'whiteAlpha.200', transform: 'scale(1.05)' }}
        >
          {item.icon && <Box mb={1}>{item.icon}</Box>}
          <Box fontSize="xs" textAlign="center">
            {item.label}
          </Box>
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
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
      zIndex="999"
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        align="center"
        justify="space-between"
      >
        <Flex align="center" h="40px" marginRight={2}>
          <Logo />
        </Flex>

        {/* Desktop Menu */}
        <Stack direction="row" display={{ base: 'none', md: 'flex' }}>
          <Menu isOpen={isOpen} onClose={onClose}>
            <MenuButton
              as={Button}
              onClick={onOpen}
              leftIcon={<LuMenu />}
              variant="ghost"
              h="40px"
              px={4}
              fontSize="sm"
              fontWeight="normal"
              opacity={0.9}
              color={useColorModeValue('blackAlpha.900', 'whiteAlpha.800')}
              bg={useColorModeValue('whiteAlpha.600', 'whiteAlpha.100')}
              border="none"
              _focus={{ boxShadow: 'none' }}
              _active={{
                bg: useColorModeValue('whiteAlpha.800', 'whiteAlpha.300')
              }}
              _hover={{
                bg: useColorModeValue('whiteAlpha.700', 'whiteAlpha.200')
              }}
            >
              Menu
            </MenuButton>
            <Portal>
              <MenuList
                maxW="400px"
                minW="300px"
                zIndex="popover"
                sx={{
                  backdropFilter: 'blur(15px) !important',
                  WebkitBackdropFilter: 'blur(15px) !important',
                  backgroundColor: useColorModeValue(
                    'rgba(206,158,224,0.4)',
                    'rgba(31, 26, 33, 0.5)'
                  )
                }}
              >
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(4, 1fr)"
                  gap={1}
                  p={2}
                >
                  {allMenuItems.map(item => renderMenuItem(item, false))}
                </Box>

                <Divider my={2} />
                <Text
                  px={3}
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  opacity={0.6}
                  textAlign="center"
                >
                  Social Links
                </Text>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(4, 1fr)"
                  gap={1}
                  px={2}
                  pb={2}
                >
                  {socialItems.map(item => renderMenuItem(item, false))}
                </Box>

                <Divider my={2} />
                <Text
                  px={3}
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  opacity={0.6}
                  textAlign="center"
                >
                  Admin
                </Text>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(4, 1fr)"
                  gap={1}
                  px={2}
                >
                  {adminItems.map(item => renderMenuItem(item, false))}
                </Box>
              </MenuList>
            </Portal>
          </Menu>
        </Stack>

        <Flex flex={1} ml={1} justify="flex-end" align="center">
          <Box ml={2}>
            <SearchBox />
          </Box>
          <Box ml={2}>
            <QuickExitButton />
          </Box>
          <Box ml={2}>
            <ThemeToggleButton />
          </Box>

          {/* Mobile Menu */}
          <Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
            <Menu isOpen={mobileDisc.isOpen} onClose={mobileDisc.onClose}>
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
                onClick={mobileDisc.onOpen}
              />
              <Portal>
                <MenuList
                  maxW="300px"
                  zIndex="popover"
                  sx={{
                    // Using 'backdrop-filter' here is more reliable than the theme
                    // when dealing with Portal/Popper conflicts
                    backdropFilter: 'blur(15px) !important',
                    WebkitBackdropFilter: 'blur(15px) !important',
                    backgroundColor: useColorModeValue(
                      'rgba(206,158,224,0.4)',
                      'rgba(36,31,39,0.5)'
                    )
                  }}
                >
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={2}
                    p={2}
                  >
                    {allMenuItems.map(item => renderMenuItem(item, true))}
                  </Box>
                  <Divider my={2} />
                  <Text
                    px={3}
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="uppercase"
                    opacity={0.6}
                    textAlign="center"
                  >
                    Social Links
                  </Text>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={2}
                    px={2}
                    pb={2}
                  >
                    {socialItems.map(item => renderMenuItem(item, true))}
                  </Box>
                  <Divider my={2} />
                  <Text
                    px={3}
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="uppercase"
                    opacity={0.6}
                    textAlign="center"
                  >
                    Admin
                  </Text>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={2}
                    px={2}
                  >
                    {adminItems.map(item => renderMenuItem(item, true))}
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
