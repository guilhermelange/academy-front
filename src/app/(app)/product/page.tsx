'use client'

import { Box, Container, Heading, IconButton, Skeleton, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack } from "@chakra-ui/react"
import { FaTrash, FaRegEdit, FaPlus } from "react-icons/fa";
import { formatDate, formatValue } from "../../../utils/viewUtils";
import useSWR, { useSWRConfig } from "swr";
import { api } from "@/common/service/api";
import { useState } from "react";
import { swrResponse } from "@/common/constants";
import Pagination from "@/components/pagination";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function Product() {
  const page = useState(0);
  const router = useRouter();
  const { mutate } = useSWRConfig()

  const { data: products, error, isLoading }: swrResponse = useSWR("/product", api);

  if (error) return <div></div>
  if (isLoading) return <Loading></Loading>

  const { ContentPagination, currentData } = Pagination({ data: products.data, page });

  const handleEdit = (id: any) => {
    router.push(`product/${id}`)
  }

  const handleDelete = async (id: any) => {
    await api.delete(`/product/${id}`);
    mutate("/product");
  }

  const handleNewProduct = async () => {
    router.push('/product/0');
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Box textAlign="center" fontSize="xl">
        <Stack direction={'row'} verticalAlign={'center'} w={'full'} justifyContent={'space-between'}>
          <Heading size="lg">
            Produtos
          </Heading>
          <IconButton
            variant="outline"
            colorScheme="green"
            aria-label="Add item"
            icon={<FaPlus />}
            ml="2"
            onClick={handleNewProduct}
          />
        </Stack>

        <VStack spacing={8} pt={4}>
          <TableContainer w={'full'}>
            <Table variant="striped" size='sm' colorScheme={'blackAlpha'}>
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Nome</Th>
                  <Th>Descrição</Th>
                  <Th>Valor</Th>
                  <Th>Tipo</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentData && currentData.sort((a: any, b: any) => b.id - a.id).map((product: any) => (
                  <Tr key={product.id}>
                    <Td>{product.id}</Td>
                    <Td>{product.name}</Td>
                    <Td>{product.description}</Td>
                    <Td>{formatValue(Number.parseFloat(product.value))}</Td>
                    <Td>{product.type == 'bar' ? 'Bar' : 'Loja'}</Td>
                    <Td textAlign={'right'}>
                      <IconButton
                        variant="outline"
                        colorScheme="blackAlpha"
                        aria-label="Edit item"
                        icon={<FaRegEdit />}
                        ml="2"
                        onClick={() => {handleEdit(product.id)}}
                      />
                      <IconButton
                        variant="outline"
                        colorScheme="red"
                        aria-label="Remove item"
                        icon={<FaTrash />}
                        ml="2"
                        onClick={() => {handleDelete(product.id)}}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          {ContentPagination}
        </VStack>
      </Box>
    </Container>
  )
}