import { Heading, Text, Box, useColorModeValue } from '@chakra-ui/react';

const LogoHeading = ({
  title = "Lace &Blades",
  color, // Extract color from props
  ...props 
}) => {
  // Define our fallback theme colors
  const themeTextColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const themeTmColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  // Use the passed color if it exists, otherwise use themeTextColor
  const finalTextColor = color || themeTextColor;
  const finalTmColor = color || themeTmColor;

  return (
    <Heading
      as="h1"
      fontFamily="CartaMarina"
      textAlign="center"
      lineHeight="1.1"
      {...props}
      color={finalTextColor} // Now uses 'white' when you pass it!
    >
      <Box as="span" position="relative" display="inline">
        {title}
        <Text
          as="span"
          fontFamily="'Roboto', sans-serif"
          fontSize="0.22em"
          fontWeight="bold"
          position="relative"
          top="-1.2em"
          left="0.1em"
          marginLeft="0.5em"
          verticalAlign="middle"
          whiteSpace="nowrap"
          color={finalTmColor} 
        >
          TM
        </Text>
      </Box>
    </Heading>
  );
};

export default LogoHeading;