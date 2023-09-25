'use client'

import { Box, Container, Heading, IconButton, Skeleton, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack } from "@chakra-ui/react"
import { FaTrash, FaRegEdit, FaPlus } from "react-icons/fa";
import { formatDate } from "../../../utils/viewUtils";
import useSWR, { useSWRConfig } from "swr";
import { api } from "@/common/service/api";
import { useState } from "react";
import { swrResponse } from "@/common/constants";
import Pagination from "@/components/pagination";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function Professional() {
  const page = useState(0);
  const router = useRouter();
  const { mutate } = useSWRConfig()

  const { data: professionals, error, isLoading }: swrResponse = useSWR("/professional", api);

  if (error) {
    return <div></div>
  }
  if (isLoading) return <Loading></Loading>

  const { ContentPagination, currentData } = Pagination({ data: professionals.data, page });

  const handleEdit = (id: any) => {
    router.push(`professional/${id}`)
  }

  const handleDelete = async (id: any) => {
    await api.delete(`/professional/${id}`);
    mutate("/professional");
  }

  const handleNewProduct = async () => {
    router.push('/professional/0');
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Box textAlign="center" fontSize="xl">
        <Stack direction={'row'} verticalAlign={'center'} w={'full'} justifyContent={'space-between'}>
          <Heading size="lg">
            Funcionários
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
                  <Th>Data Nascimento</Th>
                  <Th>Formação</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentData && currentData.map((profissional: any) => (
                  <Tr key={profissional.id}>
                    <Td>{profissional.id}</Td>
                    <Td>{profissional.name}</Td>
                    <Td>{profissional.birth_date ? formatDate(new Date(profissional.birth_date)) : ''}</Td>
                    <Td>{profissional.academic_education}</Td>
                    <Td textAlign={'right'}>
                      <IconButton
                        variant="outline"
                        colorScheme="blackAlpha"
                        aria-label="Edit item"
                        icon={<FaRegEdit />}
                        ml="2"
                        onClick={() => {handleEdit(profissional.id)}}
                      />
                      <IconButton
                        variant="outline"
                        colorScheme="red"
                        aria-label="Remove item"
                        icon={<FaTrash />}
                        ml="2"
                        onClick={() => {handleDelete(profissional.id)}}
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