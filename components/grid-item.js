import NextLink from 'next/link'
import Image from 'next/image'
import { Box, Text, LinkBox, LinkOverlay } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import React from 'react';

export const GridItem = ({ children, href, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <LinkBox>
      <Image
        src={thumbnail}
        alt={title}
        className="grid-item-thumbnail"
        //placeholder="blur"
        //layout="responsive"
        height="220"
        width="320"
        loading="lazy"
      />
      <LinkOverlay href={href} target="_blank">
        <Text fontSize={18} mt={2}>
          {title}
        </Text>
      </LinkOverlay>
      <Text fontSize={11}>{children}</Text>
    </LinkBox>
  </Box>
)

export const GridItemStyle = () => (
  <Global
    styles={`
    .grid-item-thumbnail {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      /* Add other styles as needed */
      }
    `}
  />
)
