import { Box, Button } from '@chakra-ui/react'

export const WPLink = ({ attribs, children, inColumn, hasImage, renderNodes }) => {
  // 1. WordPress Button Style
  if (attribs?.class?.includes('wp-block-button__link')) {
    return (
      <Box display="flex" justifyContent={inColumn ? "flex-start" : "center"} my={4}>
        <Button
          as="a"
          href={attribs.href}
          target="_blank"
          whiteSpace="normal"
          height="auto"
          py={3}
          colorScheme="blue"
        >
          {renderNodes(children, inColumn)}
        </Button>
      </Box>
    )
  }

  // 2. Standard Link or Image Link
  const linkElement = (
    <Box
      as="a"
      href={attribs.href}
      color="blue.500"
      textDecoration="underline"
      display={hasImage ? 'inline-block' : 'inline'}
      verticalAlign="middle"
      target={attribs.target}
      rel={attribs.rel}
    >
      {renderNodes(children, inColumn)}
    </Box>
  )

  if (hasImage) {
    return (
      <Box display="flex" justifyContent="center" width="100%">
        {linkElement}
      </Box>
    )
  }

  return linkElement
}