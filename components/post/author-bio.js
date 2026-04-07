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
import Logo from '/components/heading'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const AuthorBio = () => (
  <Section>
    <Box flexShrink={0} align="center">
      <ProfileImage
        src="/images/IMG-20260220-WA0017_2.jpg"
        alt="Profile image"
        width={120}
        height={120}
        borderRadius="full"
      />
    </Box>
    <Box>
    </Box>
    <Box display="flex" justifyContent="center" width="full" paddingTop={4}>
      <Logo
        fontSize={{ base: '4xl', md: '5xl' }}
        paddingBottom={4}
      />
    </Box>
    <Section delay={0.1}>
      <Paragraph>
        Lace & Blades is about turning my lived experience into action and
        support. From survival to justice, this space shares support from
        multiple organisations, the impact of coercive control, and the fight to
        rebuild life after sexual assault and trauma. But this is more than
        storytelling. It is a call for change. Lace & Blades has taken on the
        challenges on the housing and safeguarding failures with the Government
        systems. Pushing for change. Because survival should never depend on
        employment status, location, or silence. Real Stories | Domestic Abuse |
        System Change
      </Paragraph>
    </Section>
  </Section>
)

export default AuthorBio
