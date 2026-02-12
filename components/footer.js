import { Box } from '@chakra-ui/react'
//import 'rc-footer/assets/index.css'; // import 'rc-footer/asssets/index.less';

const Footer = () => {
  return (
    <Box align="center" opacity={0.4} fontSize="11px" paddingTop="25px">
      &copy; {new Date().getFullYear()} Michael Keates. All Rights Reserved.
    </Box>
  )
}

export default Footer
