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

export const WorkGridItem = ({ children, id, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <NextLink href={`/qualificatons/${id}`} passHref scroll={false}>
      <LinkBox cursor="pointer">
        <Image
          src={thumbnail}
          alt={title}
          className="grid-item-thumbnail"
          height="256"
          width="256"
        />
        <LinkOverlay href={`/qualificatons/${id}`}>
          <Text mt={2} fontSize={15}>
            {title}
          </Text>
        </LinkOverlay>
        {/* Render all the children */}
        {React.Children.map(children, (child, index) => (
          <Text key={index} fontSize={9}>
            {child}
          </Text>
        ))}
      </LinkBox>
    </NextLink>
  </Box>
);

export const PortfolioGridItem = ({ children, id, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <NextLink href={`/portfolio/${id}`} passHref scroll={false}>
      <LinkBox cursor="pointer">
        <Image
          src={thumbnail}
          alt={title}
          className="grid-item-thumbnail"
          //placeholder="blur"
          height="100%"
          width="100%"
        />
        <LinkOverlay href={`/qualificatons/${id}`}>
          <Text mt={2} fontSize={14}>
            {title}
          </Text>
        </LinkOverlay>
        <Text fontSize={10}>{children}</Text>
      </LinkBox>
    </NextLink>
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
