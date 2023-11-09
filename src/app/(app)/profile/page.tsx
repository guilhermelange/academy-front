"use client";

import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { api } from "@/common/service/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/button";
import Loading from "@/components/loading";

export default function Professional() {
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    api
      .get(`/user`)
      .then((item) => {
        const profiletData = item.data;
        setProfile({ ...profiletData });
        setLoading(false);
      })
      .catch((error) => {
        router.push("/");
        setLoading(false);
      });
  }, []);

  const handleReturn = async () => {
    router.back();
  };

  const handleUpdate = async () => {
    api
      .put(`/user`, {
        name: profile.name,
        email: profile.email,
      })
      .then((e) => {
        toast({
          title: "Usuário atualizado com sucesso!",
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
            <Text>Editar Perfil</Text>
          </Heading>
          <Box display="flex" flexDirection={{ base: "column", md: "row" }}>
            <Box flex="1" mr={{ md: 4 }}>
              <FormControl mb={4}>
                <FormLabel htmlFor="name">Nome</FormLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nome"
                  value={profile?.name}
                  onChange={(e) => {
                    setProfile({ ...profile, name: e.target.value });
                  }}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  isReadOnly
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={profile?.email}
                  onChange={(e) => {
                    setProfile({ ...profile, email: e.target.value });
                  }}
                />
              </FormControl>
              <FormControl mb={4}>
                <Stack direction={"row"}>
                  <CustomButton callback={handleUpdate}>Confirmar</CustomButton>
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
