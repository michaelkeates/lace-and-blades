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
      lineHeight="1.1"
      {...props}
    >
      {/* Using a standard span (Box as span) keeps the TM 
        inline with the text flow. 
      */}
      <Box as="span" position="relative" display="inline">
        {title}
        <Text
          as="span"
          fontFamily="'Roboto', sans-serif"
          fontSize="0.22em"
          fontWeight="bold"
          position="relative" // Changed from absolute to relative
          top="-1.2em"        // Lifts it up like a superscript
          left="0.1em"        // Tucks it closer to the 's'
          marginLeft="0.5em"  // Ensures it doesn't overlap the 's'
          verticalAlign="middle"
          whiteSpace="nowrap" // Prevents TM from ever dropping to a 3rd line
        >
          TM
        </Text>
      </Box>
    </Heading>
  );
};

export default LogoHeading;