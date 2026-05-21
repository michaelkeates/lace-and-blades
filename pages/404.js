import NextLink from 'next/link'
import Section from '../components/section'
import {
  Box,
  Text,
  Container,
  Divider,
  useColorModeValue,
  Button
} from '@chakra-ui/react'
import Bubble from '../components/emoji/default'
import Email from '../components/emoji/email'

const NotFound = () => {
  return (
    <Section delay={0.1}>
      <Email
        text="If in Immediate Danger contact 999"
        email="lace.blades2026@gmail.com"
      />
      <Bubble
        text="Sorry!"
        emoji="🤦‍♂️"
      />
      <Text align="center" paddingTop="7px">
        The page you&apos;re looking for was not found.
      </Text>
      <Divider my={6} />
      <Box my={6} align="center">
        <NextLink href="/" passHref>
          <Button bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}>
            Go Back
          </Button>
        </NextLink>
      </Box>
    </Section>
  )
}

export default NotFound