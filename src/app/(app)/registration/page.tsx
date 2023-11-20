"use client";

import {
  Box,
  Container,
  Heading,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { FaTrash, FaRegEdit, FaPlus } from "react-icons/fa";
import { formatDate, formatTime, formatValue } from "../../../utils/viewUtils";
import useSWR, { useSWRConfig } from "swr";
import { api } from "@/common/service/api";
import { useState } from "react";
import { swrResponse } from "@/common/constants";
import Pagination from "@/components/pagination";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

interface RegistrationList {
  params: { userId?: number };
}

export default function Registration({ params: { userId } }: RegistrationList) {
  const page = useState(0);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const idUser = userId ?? 0;
  const apiUrl = idUser > 0 ? `/registration?student_id=${idUser}` : "/registration";
  const { data: registrations, error, isLoading }: swrResponse = useSWR(apiUrl, api);

  if (error) return <div></div>;
  if (isLoading) return <Loading></Loading>;

  const { ContentPagination, currentData } = Pagination({ data: registrations.data, page });

  const handleEdit = (id: any) => {
    router.push(`/registration/${id}`);
  };

  const handleDelete = async (id: any) => {
    await api.delete(`/registration/${id}`);
    mutate("/registration");
  };

  const handleNew = async () => {
    router.push("/registration/0");
  };

  return (
    <Container maxW="container.xl" py={idUser > 0 ? 0 : 10}>
      <Box textAlign="center" fontSize="xl">
        <Stack direction={"row"} verticalAlign={"center"} w={"full"} justifyContent={"space-between"}>
          <Heading size="lg">Matrículas</Heading>
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
          <TableContainer w={"full"}>
            <Table variant="striped" size="sm" colorScheme={"blackAlpha"}>
              <Thead>
                <Tr>
                  {!(idUser > 0) && (
                    <>
                      <Th>Id</Th>
                      <Th>Aluno</Th>
                    </>
                  )}
                  <Th>Atividade</Th>
                  <Th>Professor</Th>
                  <Th>Status</Th>
                  <Th>Período</Th>
                  <Th>Validade</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentData &&
                  currentData.sort((a: any, b: any) => b.id - a.id).map((registration: any) => (
                    <Tr key={registration.id}>
                      {!(idUser > 0) && (
                        <>
                          <Td>{registration.id}</Td>
                          <Td>{registration.student.name}</Td>
                        </>
                      )}
                      <Td>{registration.activity.name}</Td>
                      <Td>{registration.professional.name}</Td>
                      <Td>{registration.status ? "Ativo" : "Inativo"}</Td>
                      <Td>{`${formatTime(new Date(registration.start_time))} - ${formatTime(
                        new Date(registration.end_time)
                      )}`}</Td>
                      <Td color={new Date(registration.expiration) > new Date(Date.now()) ? "green" : "red"}>
                        {formatDate(new Date(registration.expiration))}
                      </Td>
                      <Td textAlign={"right"}>
                        <IconButton
                          variant="outline"
                          colorScheme="blackAlpha"
                          aria-label="Edit item"
                          icon={<FaRegEdit />}
                          ml="2"
                          onClick={() => {
                            handleEdit(registration.id);
                          }}
                        />
                        <IconButton
                          variant="outline"
                          colorScheme="red"
                          aria-label="Remove item"
                          icon={<FaTrash />}
                          ml="2"
                          onClick={() => {
                            handleDelete(registration.id);
                          }}
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
  );
}
