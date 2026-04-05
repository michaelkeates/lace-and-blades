import { Heading, Text, Box } from '@chakra-ui/react';

const LogoHeading = ({ 
  title = "Lace & Blades", 
  ...props 
}) => {
  return (
    <Heading
      as="h1"
      fontFamily="CartaMarina"
      textAlign="center"
      lineHeight="1" // Tighter line height helps keeping the TM aligned
      {...props}
    >
      <Box as="span" position="relative" display="inline-block">
        {title}
        <Text
          as="span"
          fontFamily="'Roboto', sans-serif"
          fontSize="0.20em"
          fontWeight="bold"
          position="absolute"
          
          /* 1. Anchors it to the very end of the 's' */
          left="100%" 
          
          /* 2. Adjust this to bring it closer (e.g., -2px) or further (e.g., 5px) */
          ml="2px" 
          
          /* 3. Adjust vertical height */
          top="0.1em" 
          
          lineHeight="1"
          whiteSpace="nowrap"
        >
          TM
        </Text>
      </Box>
    </Heading>
  );
};

export default LogoHeading;