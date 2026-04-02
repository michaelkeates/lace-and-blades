import { Box } from '@chakra-ui/react'

export const WPVideo = ({ src }) => (
  <Box
    as="video"
    controls
    src={src}
    width="100%"
    borderRadius="lg"
    boxShadow="md"
    my={4}
  />
)