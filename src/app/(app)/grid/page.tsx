'use client'

import { Box, Container, SimpleGrid, Text, useBreakpointValue } from "@chakra-ui/react"

export default function SimpleCard() {
    const products = {data: [{
        id: 1,
        name: 'Teste GLL Diversos',
        price: 15.15
    },
    {
        id: 1,
        name: 'Teste GLL Diversos',
        price: 15.15
    },
    {
        id: 1,
        name: 'Teste GLL Diversos',
        price: 15.15
    }]}

    const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4, xl: 5 });

    return (
        <Container maxW="container.xl" py={8}>
        <SimpleGrid columns={columns} spacing={6}>
          {products.data && products.data.map((product) => (
            <Box key={product.id} 
                 borderWidth="1px" 
                 borderColor={"blackAlpha.200"} 
                 borderRadius="lg" 
                 overflow="hidden" 
                 cursor={'pointer'}
                 backgroundColor={"whiteAlpha.500"}
                //  onClick={() => {handleClick(product.id)}}
                 >
              <Box p="6">
                <Box display="flex" alignItems="baseline">
                  <Text fontWeight="semibold" fontSize="sm" letterSpacing="wide">
                    {product.name}
                  </Text>
                  <Text fontSize="sm" color="blackAlpha.700">
                    {product.price}
                  </Text>
                </Box>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    )
}