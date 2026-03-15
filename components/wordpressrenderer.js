// components/WordPressRenderer.js
import { Box, Text, Link, Heading, Divider, UnorderedList, ListItem, Button } from '@chakra-ui/react'
import parse, { domToReact } from 'html-react-parser'

export default function WordPressRenderer({ html }) {
  return parse(html, {
    replace: node => {
      if (!node) return

      // Paragraphs
      if (node.name === 'p') {
        const content = domToReact(node.children)
        const hasText = typeof content === 'string' ? content.trim() !== '' : true
        if (!hasText) return <></>
        return <Text mb={3} fontSize="lg">{content}</Text>
      }

      // Headings
      if (node.name === 'h1') return <Heading as="h1" size="2xl" my={4}>{domToReact(node.children)}</Heading>
      if (node.name === 'h2') return <Heading as="h2" size="xl" my={6} textAlign={node.attribs?.class?.includes('has-text-align-center') ? 'center' : 'left'}>{domToReact(node.children)}</Heading>
      if (node.name === 'h3') return <Heading as="h3" size="lg" my={4}>{domToReact(node.children)}</Heading>
      if (node.name === 'h4') return <Heading as="h4" size="md" my={3}>{domToReact(node.children)}</Heading>

      // Emphasis and strong
      if (node.name === 'em') return <Text as="em">{domToReact(node.children)}</Text>
      if (node.name === 'strong') return <Text as="strong">{domToReact(node.children)}</Text>

      // Links
      if (node.name === 'a') {
        const isButton = node.attribs?.class?.includes('wp-block-button__link')
        if (isButton) {
          return <Button as={Link} href={node.attribs.href} isExternal colorScheme="blue" my={2}>{domToReact(node.children)}</Button>
        }
        return <Link href={node.attribs.href} isExternal color="blue.500">{domToReact(node.children)}</Link>
      }

      // Separator
      if (node.name === 'hr') return <Divider my={6} />

      // Lists
      if (node.name === 'ul') return <UnorderedList my={3}>{domToReact(node.children)}</UnorderedList>
      if (node.name === 'li') return <ListItem mb={1}>{domToReact(node.children)}</ListItem>
    }
  })
}