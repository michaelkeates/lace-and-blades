import NextLink from 'next/link'
import { Box, Link } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box
      align="center"
      opacity={0.4}
      fontSize="11px"
      paddingBottom="35px"
      fontFamily="footer"
    >
      &copy; {new Date().getFullYear()} Michael Keates.
      <NextLink href="/terms-transparency-privacy-affiliations" passHref>
        <Link ml={1}>Terms & Conditions.</Link>
      </NextLink>
      {" "}All Rights Reserved.
    </Box>
  )
}

export default Footer
