import { Box, Image } from '@chakra-ui/react'

export const WPImage = ({ attribs, parentAttribs, inColumn }) => {
  const figureClass = parentAttribs?.class || '';
  
  // Differentiate based on the classes you provided
  const isFeatured = figureClass.includes('featured-prayer-image');
  const isDevotional = figureClass.includes('devotional-image');

  // Logic for sizing
  // If it's the featured prayer one, let's make it wider (e.g., 500px or full)
  // Otherwise, keep your standard 256px
  const widthValue = isFeatured ? "auto" : "100%";
  const heightValue = isFeatured ? "auto" : "512px";

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      width="100%" 
      my={inColumn ? 2 : 6}
      mt={inColumn ? 2 : 6}
  mb={inColumn ? 0 : 6}
    >
      <Image
        src={attribs.src}
        alt={attribs.alt || ''}
        title={attribs.title}
        width={widthValue}
        height={heightValue}
        maxW="100%"
        borderRadius="md"
        objectFit="contain"
        // Use the aspect ratio from WordPress if it exists
        style={{ aspectRatio: attribs.style?.match(/aspect-ratio:([^;]+)/)?.[1] }}
      />
    </Box>
  )
}