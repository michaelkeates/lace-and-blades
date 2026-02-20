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

const NotFound = () => {
  return (
    <Container>
      <Section delay={0.1}>
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
              Return to home
            </Button>
          </NextLink>
        </Box>
      </Section>
    </Container>
  )
}

export default NotFound
