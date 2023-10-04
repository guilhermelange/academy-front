'use client'

import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'

import Image from "next/image"
import logo from "../../public/logo.png"

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('blackAlpha.900', 'gray.900')}
      color={useColorModeValue('white', 'gray.200')}
      top={'100vh'}
      position={'sticky'}
      >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'center' }}
        align={{ base: 'center', md: 'center' }}>
        <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            >
            <Image
              src={ logo }
              alt="logo"
              width={180}
              height={60}
            />
          </Text>
        <Text>© {(new Date()).getUTCFullYear()} Udesc. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
        </Stack>
      </Container>
    </Box>
  )
}