'use client'

import { Box, Flex, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";

export default function HeaderPublic() {
    return (
        <Flex
            minH={'56px'}
            bg={'blackAlpha.900'}
            py={{ base: 2 }}
            px={{ base: 4 }}
            borderBottom={1}
            h={'full'} 
            verticalAlign={'center'}
            borderStyle={'solid'}
            borderColor={'gray.200'}>
            <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} >
                <Text
                    textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                    fontFamily={'heading'}
                    color={useColorModeValue('white', 'white')}>
                    Logo
                </Text>
            </Flex>
        </Flex>
    )
}