import { useRouter } from 'next/router'
import NextLink from 'next/link'
import {
  Heading,
  Box,
  Image,
  Link,
  Badge,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

export const Title = ({ children }) => (
  <Box>
    <NextLink href="/about" passHref>
      <Link>About</Link>
    </NextLink>
    <span>
      {' '}
      <ChevronRightIcon />{' '}
    </span>
    <Heading display="inline-block" as="h3" fontSize={15} mb={4}>
      {children}
    </Heading>
  </Box>
)

export const Page = ({ children }) => {
  const router = useRouter()
  const secondaryColor = useColorModeValue('black', 'whiteAlpha.900')
  const hoverColor = useColorModeValue('gray.500', 'gray.300')

  const handleBack = e => {
    e.preventDefault()
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  // Common link styles to ensure "Home" and "Previous" are identical
  const linkStyles = {
    fontSize: "12px",
    fontWeight: "bold",
    color: secondaryColor,
    _hover: { color: hoverColor, textDecoration: 'none' },
    display: "flex",
    alignItems: "center",
  }

  return (
    <HStack
      justifyContent="center"
      spacing={0} // We'll use margins on the chevrons for better control
      wrap="wrap"
      lineHeight="shorter"
    >
      {/* 1. Home */}
      <NextLink href="/" passHref>
        <Link {...linkStyles}>Home</Link>
      </NextLink>

      <Box as="span" mx={2} display="flex" alignItems="center">
        <ChevronRightIcon />
      </Box>

      {/* 2. Previous */}
      <Link onClick={handleBack} cursor="pointer" {...linkStyles}>
        Previous
      </Link>

      <Box as="span" mx={2} display="flex" alignItems="center">
        <ChevronRightIcon />
      </Box>

      {/* 3. Title */}
      <Heading
        as="h3"
        fontSize="12px"
        fontWeight="normal"
        m={0}
        display="flex"
        alignItems="center"
      >
        {children}
      </Heading>
    </HStack>
  )
}

export const Blog = ({ children }) => {
  const router = useRouter()

  const handleBack = e => {
    e.preventDefault()
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/posts')
    }
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Link
        onClick={handleBack}
        cursor="pointer"
        color={useColorModeValue('black', 'whiteAlpha.900')}
        fontWeight="bold"
        fontSize="12px"
      >
        Blog
      </Link>
      <Box as="span" mx={2}>
        <ChevronRightIcon />
      </Box>
      <Heading display="inline-block" as="h3" fontSize={12} m={0}>
        {children}
      </Heading>
    </Box>
  )
}

export const Repo = ({ children }) => {
  const router = useRouter()
  return (
    <Box>
      <Link onClick={() => router.push('/repositories')}>Repositories</Link>
      <span>
        {' '}
        <ChevronRightIcon />{' '}
      </span>
      <Heading display="inline-block" as="h3" fontSize={15} mb={4}>
        {children}
      </Heading>
    </Box>
  )
}

export const WorkImage = ({ src, alt }) => (
  <Image borderRadius="lg" w="full" src={src} alt={alt} mb={4} />
)

export const Meta = ({ children }) => (
  <Badge
    fontSize="10px"
    borderRadius="lg"
    bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
    color=""
    css={{ backdropFilter: 'blur(10px)' }}
    padding="7px;"
    margin="5px"
    mr={3}
  >
    {children}
  </Badge>
)
