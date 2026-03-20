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
  Text
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

const adminItems = [
  {
    label: 'Admin Login',
    icon: <LuDoorClosed size={18} />,
    path: 'https://laceandblades.michaelkeates.co.uk/wp-login.php',
    external: true
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

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const menuBg = useColorModeValue(
    'rgba(206,158,224,0.95)',
    'rgba(36,31,39,0.95)'
  )

  const renderMenuItem = item => {
    if (item.external) {
      return (
        <Link
          key={item.label}
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
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
          onClick={onClose}
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
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              opacity={0.6}
            >
              Menu
            </MenuButton>

            <MenuList
              bg={menuBg}
              style={{ backdropFilter: 'blur(10px)' }}
              maxW="400px"
              minW="300px"
            >
              {/* MAIN GRID */}
              <Box
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                gap={1}
                p={2}
              >
                {allMenuItems.map(renderMenuItem)}
              </Box>

              {/* ADMIN */}
              <Divider my={2} />
              <Text
                px={3}
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                opacity={0.6}
              >
                Admin
              </Text>
              <Box
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                gap={1}
                px={2}
              >
                {adminItems.map(renderMenuItem)}
              </Box>

              {/* SOCIAL */}
              <Divider my={2} />
              <Text
                px={3}
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                opacity={0.6}
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
                {socialItems.map(renderMenuItem)}
              </Box>
            </MenuList>
          </Menu>
        </Stack>

        {/* Right side */}
        <Flex flex={1} ml={1} justify="flex-end" align="center">
          <Box ml={2}>
            <SearchBox />
          </Box>
          <Box ml={2}>
            <ThemeToggleButton />
          </Box>

          {/* Mobile */}
          <Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
            <Menu isLazy>
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
              />

              <MenuList
                bg={menuBg}
                style={{ backdropFilter: 'blur(10px)' }}
                maxW="300px"
              >
                {/* MAIN */}
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap={2}
                  p={2}
                >
                  {allMenuItems.map(renderMenuItem)}
                </Box>

                {/* ADMIN */}
                <Divider my={2} />
                <Text
                  px={3}
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  opacity={0.6}
                >
                  Admin
                </Text>

                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap={2}
                  px={2}
                >
                  {adminItems.map(renderMenuItem)}
                </Box>

                {/* SOCIAL */}
                <Divider my={2} />
                <Text
                  px={3}
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  opacity={0.6}
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
                  {socialItems.map(renderMenuItem)}
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
