'use client'

import { Box, Container, Heading, IconButton, Skeleton, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr, VStack, useToast } from "@chakra-ui/react"
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
  const toast = useToast();

  const { data: activities, error, isLoading }: swrResponse = useSWR("/activity", api);

  if (error) return <div></div>
  if (isLoading) return <Loading></Loading>

  const { ContentPagination, currentData } = Pagination({ data: activities.data, page });

  const handleEdit = (id: any) => {
    router.push(`activity/${id}`)
  }

  const handleDelete = async (id: any) => {
    api.delete(`/activity/${id}`)
      .then(item => {
        toast({
          title: "Atividade deletada com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        mutate("/activity");
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
  }

  const handleNew = async () => {
    router.push('/activity/0');
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Box textAlign="center" fontSize="xl">
        <Stack direction={'row'} verticalAlign={'center'} w={'full'} justifyContent={'space-between'}>
          <Heading size="lg">
            Atividades
          </Heading>
          <Tooltip label="Novo">
            <IconButton
              variant="outline"
              colorScheme="green"
              aria-label="Add item"
              icon={<FaPlus />}
              ml="2"
              onClick={handleNew}
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
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentData && currentData.sort((a: any, b: any) => b.id - a.id).map((activity: any) => (
                  <Tr key={activity.id}>
                    <Td>{activity.id}</Td>
                    <Td>{activity.name}</Td>
                    <Td textAlign={'right'}>
                      <Tooltip label="Editar">
                        <IconButton
                          variant="outline"
                          colorScheme="blackAlpha"
                          aria-label="Edit item"
                          icon={<FaRegEdit />}
                          ml="2"
                          onClick={() => { handleEdit(activity.id) }}
                        />
                      </Tooltip>
                      <Tooltip label="Remover">
                        <IconButton
                          variant="outline"
                          colorScheme="red"
                          aria-label="Remove item"
                          icon={<FaTrash />}
                          ml="2"
                          onClick={() => { handleDelete(activity.id) }}
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