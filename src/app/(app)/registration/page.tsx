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
  Tooltip,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FaTrash, FaRegEdit, FaPlus, FaCheck } from "react-icons/fa";
import { formatDate, formatTime, formatValue, getCurrentDate } from "../../../utils/viewUtils";
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
  const toast = useToast();

  const idUser = userId ?? 0;
  const apiUrl = idUser > 0 ? `/registration?student_id=${idUser}` : "/registration";
  const { data: registrations, error, isLoading }: swrResponse = useSWR(apiUrl, api);

  if (error) return <div></div>;
  if (isLoading) return <Loading></Loading>;

  const { ContentPagination, currentData } = Pagination({ data: registrations.data, page });

  const handleEdit = (id: any) => {
    router.push(`/registration/${id}`);
  };

  const handlePresence = (id: any) => {
    api
      .post(`/presence`, {
        registration_id: id,
        presence_date: getCurrentDate()
      })
      .then((e) => {
        toast({
          title: "Presença adicionada com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        
      })
      .catch((e) => {
        toast({
          title: "Algo deu errado!",
          status: "error",
          duration: 2000,
          description: e.response?.data?.message || "Erro interno",
          isClosable: true,
        });
      });
  };

  const handleDelete = async (id: any) => {
    api.delete(`/registration/${id}`)
      .then(item => {
        toast({
          title: "Matrícula deletada com sucesso!",
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
          <Tooltip label='Novo'>
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
                        <Tooltip label='Adicionar Presença'>
                          <IconButton
                            variant="outline"
                            colorScheme="blackAlpha"
                            aria-label="Presença"
                            icon={<FaCheck />}
                            ml="2"
                            onClick={() => {
                              handlePresence(registration.id);
                            }}
                          />
                        </Tooltip>
                        <Tooltip label='Editar'>
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
                        </Tooltip>
                        <Tooltip label='Remover'>
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
  );
}
