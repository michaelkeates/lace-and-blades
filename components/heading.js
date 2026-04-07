import { Heading, Text, Box, useColorModeValue } from '@chakra-ui/react';

const LogoHeading = ({
  title = "Lace & Blades",
  ...props // This contains any styles passed from the parent
}) => {
  const textColor = useColorModeValue('black.100', 'whiteAlpha.900');
  const tmColor = useColorModeValue('black.100', 'whiteAlpha.900');

  return (
    <Heading
      as="h1"
      fontFamily="CartaMarina"
      textAlign="center"
      lineHeight="1.1"
      {...props}       // 1. Spread props FIRST
      color={textColor} // 2. Apply theme color SECOND to ensure it overrides
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
          color={tmColor}
        >
          TM
        </Text>
      </Box>
    </Heading>
  );
};

export default LogoHeading;