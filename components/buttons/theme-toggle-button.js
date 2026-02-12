import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { IconButton, useColorMode, useColorModeValue, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { GET_ALL_POSTS } from '/lib/queries'; // Import your GraphQL query

const ThemeToggleButton = () => {
  const { toggleColorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Use Apollo Client's useQuery hook to fetch data
  const { loading: gqlLoading } = useQuery(GET_ALL_POSTS);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
    };
  }, [router]);

  return (
    <IconButton
      aria-label="Toggle theme"
      bg={useColorModeValue('orange.200', 'whiteAlpha.200')}
      _hover={{
        bg: useColorModeValue('orange.300', 'whiteAlpha.300'),
        transform: 'none', //disable zoom effect on hover
      }}
      css={{ backdropFilter: 'blur(10px)' }}
      padding="10px"
      boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
      color={useColorModeValue('blackAlpha.900', 'whiteAlpha.600')}
      onClick={toggleColorMode}
    >
      {loading || gqlLoading ? (
        <Spinner size="sm" />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ marginTop: '-1.5px' }} // Adjust marginTop value as needed
        >
          {useColorModeValue(<MoonIcon />, <SunIcon />)}
        </motion.div>
      )}
    </IconButton>
  );
};

export default ThemeToggleButton;
