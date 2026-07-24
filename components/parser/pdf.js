import { Box, Button, useColorModeValue } from '@chakra-ui/react'

export const WPPdf = ({ fileUrl, fileTitle, inColumn }) => {
  const btnBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const btnHoverBg = useColorModeValue('gray.100', 'whiteAlpha.300')
  const thumbnailUrl = fileUrl.replace(/\.pdf$/i, '-pdf.jpg')

  return (
    <Box
      // CRITICAL: Remove top margin on mobile if in a column to prevent "the push".
      // Responsive prop (not useBreakpointValue) so SSR + client first render match.
      mt={inColumn ? { base: 0, md: 4 } : 4}
      mb={inColumn ? 6 : 10}
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
    >
      <Box
        borderRadius="lg"
        overflow="hidden"
        // Subtle shadow instead of 'xl' to prevent alignment optics issues
        boxShadow="md"
        bg="blackAlpha.50"
        mb={3}
        width="100%"
        maxW={inColumn ? "280px" : "100%"}
      >
        {/* Render both; toggle with CSS so server and client markup are identical (no hydration mismatch) */}
        <Box display={{ base: 'block', md: 'none' }}>
          <img
            src={thumbnailUrl}
            alt={fileTitle}
            style={{
              width: '100%',
              height: '400px',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </Box>
        <Box display={{ base: 'none', md: 'block' }}>
          <object
            data={fileUrl}
            type="application/pdf"
            width="100%"
            // CHANGE THIS VALUE for desktop (e.g., '800px' or '90vh')
            height="460px"
          >
            <Box p={4}>Preview not supported.</Box>
          </object>
        </Box>
      </Box>

      <Button
        as="a"
        href={fileUrl}
        target="_blank"
        size="sm"
        w="100%"
        maxW={inColumn ? "280px" : "400px"}
        bg={btnBg}
        _hover={{ bg: btnHoverBg }}
      >
        Open PDF
      </Button>
    </Box>
  )
}
