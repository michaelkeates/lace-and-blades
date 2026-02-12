import NextLink from 'next/link'
import { Heading, Box, Image, Link, Badge, useColorModeValue } from '@chakra-ui/react'
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
    <Heading display="inline-block" as="h3" fontSize={15} mb={4} >
      {children}
    </Heading>
  </Box>
)

export const Portfolio = ({ children }) => (
  <Box>
    <NextLink href="/portfolio" passHref>
      <Link>Portfolio</Link>
    </NextLink>
    <span>
      {' '}
      <ChevronRightIcon />{' '}
    </span>
    <Heading display="inline-block" as="h3" fontSize={15} mb={4} >
      {children}
    </Heading>
  </Box>
)

export const Blog = ({ children }) => (
  <Box>
    <NextLink href="/posts" passHref>
      <Link>Blog</Link>
    </NextLink>
    <span>
      {' '}
      <ChevronRightIcon />{' '}
    </span>
    <Heading display="inline-block" as="h7" fontSize={15} mb={4} >
      {children}
    </Heading>
  </Box>
)

export const Repo = ({ children }) => (
  <Box>
    <NextLink href="/repositories" passHref>
      <Link>Portfolio</Link>
    </NextLink>
    <span>
      {' '}
      <ChevronRightIcon />{' '}
    </span>
    <Heading display="inline-block" as="h7" fontSize={15} mb={4} >
      {children}
    </Heading>
  </Box>
)

export const WorkImage = ({ src, alt }) => (
  <Image borderRadius="lg" w="full" src={src} alt={alt} mb={4} />
)

export const Meta = ({ children }) => (
  <Badge fontSize="10px" borderRadius="lg" bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} color="" css={{ backdropFilter: 'blur(10px)' }} padding="7px;" margin="5px" mr={3}>
    {children}
  </Badge>
)