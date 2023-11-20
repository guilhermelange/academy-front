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

  const { data: purchases, error, isLoading }: swrResponse = useSWR("/purchase", api);

  if (error) return <div></div>
  if (isLoading) return <Loading></Loading>

  const { ContentPagination, currentData } = Pagination({ data: purchases.data, page });

  const handleEdit = (id: any) => {
    router.push(`purchase/${id}`)
  }

  const handleDelete = async (id: any) => {
    await api.delete(`/purchase/${id}`);
    mutate("/purchase");
  }

  const handleNew = async () => {
    router.push('/purchase/0');
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Box textAlign="center" fontSize="xl">
        <Stack direction={'row'} verticalAlign={'center'} w={'full'} justifyContent={'space-between'}>
          <Heading size="lg">
            Compras
          </Heading>
          <IconButton
            variant="outline"
            colorScheme="green"
            aria-label="Add item"
            icon={<FaPlus />}
            ml="2"
            onClick={handleNew}
          />
        </Stack>

        <VStack spacing={8} pt={4}>
          <TableContainer w={'full'}>
            <Table variant="striped" size='sm' colorScheme={'blackAlpha'}>
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Aluno</Th>
                  <Th>Pagamento</Th>
                  <Th>Tipo</Th>
                  <Th>Data</Th>
                  <Th>Valor</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentData && currentData.sort((a: any, b: any) => b.id - a.id).map((purchase: any) => (
                  <Tr key={purchase.id}>
                    <Td>{purchase.id}</Td>
                    <Td>{purchase.student.name}</Td>
                    <Td>{purchase.payment_type == 'term' ? 'Parcelado' : 'A Vista'}</Td>
                    <Td>{purchase.type == 'registration' ? 'Matrícula' : purchase.type == 'bar' ? 'Bar' : 'Loja'}</Td>
                    <Td>{formatDate(new Date(purchase.creation_date))}</Td>
                    <Td>{formatValue(+purchase.value)}</Td>
                    <Td>{purchase.status == 'pending' ? 'Pendente' : purchase.status == 'paid' ? 'Pago' : 'Cancelado'}</Td>
                    <Td textAlign={'right'}>
                      <IconButton
                        variant="outline"
                        colorScheme="blackAlpha"
                        aria-label="Edit item"
                        icon={<FaRegEdit />}
                        ml="2"
                        onClick={() => {handleEdit(purchase.id)}}
                      />
                      <IconButton
                        variant="outline"
                        colorScheme="red"
                        aria-label="Remove item"
                        icon={<FaTrash />}
                        ml="2"
                        onClick={() => {handleDelete(purchase.id)}}
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