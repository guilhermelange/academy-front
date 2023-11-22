'use client'

import { Box, Container, Heading, IconButton, Skeleton, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr, VStack, useToast } from "@chakra-ui/react"
import { FaTrash, FaRegEdit, FaPlus } from "react-icons/fa";
import useSWR, { useSWRConfig } from "swr";
import { api } from "@/common/service/api";
import { useState } from "react";
import { swrResponse } from "@/common/constants";
import Pagination from "@/components/pagination";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function Students() {
  const page = useState(0);
  const router = useRouter();
  const { mutate } = useSWRConfig()
  const toast = useToast();

  const { data: students, error, isLoading }: swrResponse = useSWR("/student", api);

  if (error) return <div></div>
  if (isLoading) return <Loading></Loading>

  const { ContentPagination, currentData } = Pagination({ data: students.data, page });

  const handleEdit = (id: any) => {
    router.push(`student/${id}`)
  }

  const handleDelete = async (id: any) => {
    api.delete(`/student/${id}`)
      .then(data => {
        toast({
          title: "Aluno deletado com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch(e => {
        toast({
          title: "Algo deu errado!",
          status: "error",
          duration: 2000,
          description: e.response?.data?.message || "Erro interno",
          isClosable: true,
        });
      });
    mutate("/student");
  }

  const handleNewProduct = async () => {
    router.push('/student/0');
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Box textAlign="center" fontSize="xl">
        <Stack direction={'row'} verticalAlign={'center'} w={'full'} justifyContent={'space-between'}>
          <Heading size="lg">
            Alunos
          </Heading>
          <Tooltip label='Novo'>
            <IconButton
              variant="outline"
              colorScheme="green"
              aria-label="Add item"
              icon={<FaPlus />}
              ml="2"
              onClick={handleNewProduct}
            />
          </Tooltip>
        </Stack>

        <VStack spacing={8} pt={4}>
          <TableContainer w={'full'}>
            <Table variant="striped" size='sm' colorScheme={'blackAlpha'}>
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Nome</Th>
                  <Th>Gênero</Th>
                  <Th>Telefone</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentData && currentData.sort((a: any, b: any) => b.id - a.id).map((student: any) => (
                  <Tr key={student.id}>
                    <Td>{student.id}</Td>
                    <Td>{student.name}</Td>
                    <Td>{student.gender}</Td>
                    <Td>{student.phone}</Td>
                    <Td>{student.status ? 'Ativo' : 'Inativo'}</Td>
                    <Td textAlign={'right'}>
                      <Tooltip label="Editar">
                        <IconButton
                          variant="outline"
                          colorScheme="blackAlpha"
                          aria-label="Edit item"
                          icon={<FaRegEdit />}
                          ml="2"
                          onClick={() => { handleEdit(student.id) }}
                        />
                      </Tooltip>
                      <Tooltip label="Remover">
                        <IconButton
                          variant="outline"
                          colorScheme="red"
                          aria-label="Remove item"
                          icon={<FaTrash />}
                          ml="2"
                          onClick={() => { handleDelete(student.id) }}
                        />
                      </Tooltip>
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