// components/PDFViewer.js
import { Box } from '@chakra-ui/react'

export default function PDFViewer({ file }) {
  return (
    <Box marginY={4} overflowX="auto">
      <Box
        as="iframe"
        src={file}
        width="100%"
        height="600px"
        border="none"
        title="PDF Document"
        style={{ maxWidth: '100%', minHeight: '400px' }}
      />
    </Box>
  )
}