import { Box, Button, useColorModeValue } from '@chakra-ui/react'

export const WPPdf = ({ fileUrl, fileTitle, isMobile, inColumn }) => {
  const btnBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const thumbnailUrl = fileUrl.replace(/\.pdf$/i, '-pdf.jpg')

  return (
    <Box 
      // CRITICAL: Remove top margin on mobile if in a column to prevent "the push"
      mt={isMobile && inColumn ? 0 : 4} 
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
        {isMobile ? (
          <img
            src={thumbnailUrl}
            alt={fileTitle}
            style={{ 
              width: '100%', 
              height: 'auto', 
              display: 'block',
              margin: '0 auto'
            }}
          />
        ) : (
          <object data={fileUrl} type="application/pdf" width="100%" height="500px">
            <Box p={4}>Preview not supported.</Box>
          </object>
        )}
      </Box>
      
      <Button
        as="a"
        href={fileUrl}
        target="_blank"
        size="sm"
        w="100%"
        maxW={inColumn ? "280px" : "400px"}
        bg={btnBg}
        _hover={{ bg: useColorModeValue('gray.100', 'whiteAlpha.300') }}
      >
        Open PDF
      </Button>
    </Box>
  )
}