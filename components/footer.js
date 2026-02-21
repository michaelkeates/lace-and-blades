import { Box } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box
      align="center"
      opacity={0.4}
      fontSize="11px"
      paddingTop="25px"
      paddingBottom="35px"
      fontFamily="footer"
    >
      &copy; {new Date().getFullYear()} Michael Keates. All Rights Reserved.
    </Box>
  )
}

export default Footer
