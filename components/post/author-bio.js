import React from 'react'

import NextLink from 'next/link'
//import Image from 'next/image'
import { gql } from '@apollo/client'

import {
  Link,
  Container,
  Heading,
  Box,
  SimpleGrid,
  Button,
  Divider,
  //  List,
  //  ListItem,
  useColorModeValue,
  chakra,
  Badge,
  Flex
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Paragraph from '../../components/paragraph'
import Section from '../../components/section'
import Image from 'next/image'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const AuthorBio = () => (
  <Section>
    <Box flexShrink={0} align="center">
      <ProfileImage
        src="/images/Lace-Blades-small.jpeg"
        alt="Profile image"
        borderRadius="full"
        width="100"
        height="100"
      />
    </Box>
    <Box display={{ md: 'flex' }}>
      <Box flexGrow={1}>
        <Heading
          as="h3"
          variant="page-title"
          fontFamily="Roboto"
          fontWeight=""
          textAlign="center"
        >
          Lace & Blades
        </Heading>
      </Box>
    </Box>

    <Section delay={0.1}>
      <Paragraph>
        Lace & Blades didn't begin as a book. It was the first words and were
        never meant to be read. Fragments written in fear just to keep reality.
        I didn't know it was abuse. I thought I was failing at a relationship.
        The darkness arrived quietly - through affection and control disguised
        as care. As control and trauma bonding tightened, writing became my
        lifeline, real-time truth with no polish or hindsight.
      </Paragraph>
    </Section>
  </Section>
)

export default AuthorBio
