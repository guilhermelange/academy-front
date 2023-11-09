"use client";

import { Box, Container, FormControl, FormLabel, Heading, Input, Stack, Text, useToast } from "@chakra-ui/react";
import { api } from "@/common/service/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/button";
import Loading from "@/components/loading";

interface ProfessionalEdit {
  params: { id: number };
}

export default function Professional({ params: { id } }: ProfessionalEdit) {
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState({
    id: id,
    name: "",
    birth_date: "",
    academic_education: "",
  });

  useEffect(() => {
    if (id > 0) {
      api.get(`/professional/${id}`).then((item) => {
        const professionalData = item.data;
        setProfessional({ ...professionalData, birth_date: professionalData?.birth_date.substring(0, 10) });
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleReturn = async () => {
    router.push("/professional");
  };

  const handleUpdate = async () => {
    api
      .put(`/professional/${id}`, {
        name: professional.name,
        birth_date: professional.birth_date,
        academic_education: professional.academic_education,
      })
      .then((e) => {
        toast({
          title: "Funcionário atualizado com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        handleReturn();
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

  const handleCreate = async () => {
    api
      .post(`/professional`, {
        name: professional.name,
        birth_date: professional.birth_date,
        academic_education: professional.academic_education,
      })
      .then((e) => {
        toast({
          title: `Funcionário ${e.data?.id} criado com sucesso!`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        handleReturn();
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

  const handleDelete = async () => {
    api
      .delete(`/professional/${id}`)
      .then((e) => {
        toast({
          title: "Funcionário deletado com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        handleReturn();
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

  return (
    <Container maxW="container.sm" py={8}>
      {loading && <Loading></Loading>}
      {!loading && (
        <>
          <Heading size="lg" mb={4} display={"flex"}>
            <Text>{id > 0 ? "Editar Funcionário" : "Novo Funcionário"}</Text>
          </Heading>
          <Box display="flex" flexDirection={{ base: "column", md: "row" }}>
            <Box flex="1" mr={{ md: 4 }}>
              {id > 0 && (
                <FormControl mb={4}>
                  <FormLabel htmlFor="id">ID</FormLabel>
                  <Input colorScheme={"blackAlpha"} id="id" name="id" placeholder="ID" isReadOnly value={id} />
                </FormControl>
              )}
              <FormControl mb={4}>
                <FormLabel htmlFor="name">Nome</FormLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nome"
                  value={professional?.name}
                  onChange={(e) => {
                    setProfessional({ ...professional, name: e.target.value });
                  }}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel htmlFor="birth_date">Data de Nascimento</FormLabel>
                <Input
                  type="date"
                  id="birth_date"
                  name="birth_date"
                  placeholder="Data Nascimento"
                  value={professional?.birth_date}
                  onChange={(e) => {
                    setProfessional({ ...professional, birth_date: e.target.value });
                  }}
                />
              </FormControl>
              <FormControl mb={8}>
                <FormLabel htmlFor="academic_education">Formação</FormLabel>
                <Input
                  id="academic_education"
                  name="academic_education"
                  placeholder="Formação"
                  value={professional?.academic_education}
                  onChange={(e) => {
                    setProfessional({ ...professional, academic_education: e.target.value });
                  }}
                />
              </FormControl>
              <FormControl mb={4}>
                <Stack direction={"row"}>
                  <CustomButton callback={id > 0 ? handleUpdate : handleCreate}>Confirmar</CustomButton>
                  {id > 0 && (
                    <CustomButton callback={handleDelete} variant="outline" colorSchema="red">
                      Deletar
                    </CustomButton>
                  )}
                  <CustomButton variant="outline" colorSchema="blackAlpha" callback={handleReturn}>
                    Voltar
                  </CustomButton>
                </Stack>
              </FormControl>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}
