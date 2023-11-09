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

interface ProductEdit {
  params: { id: number };
}

export default function Product({ params: { id } }: ProductEdit) {
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    id: id,
    name: "",
    description: "",
    value: 0.0,
    type: "bar",
  });

  useEffect(() => {
    if (id > 0) {
      api.get(`/product/${id}`).then((item) => {
        const productData = item.data;
        setProduct({ ...productData });
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleReturn = async () => {
    router.push("/product");
  };

  const handleUpdate = async () => {
    api
      .put(`/product/${id}`, {
        name: product.name,
        description: product.description,
        value: product.value,
        type: product.type,
      })
      .then((e) => {
        toast({
          title: "Produto atualizado com sucesso!",
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
      .post(`/product`, {
        name: product.name,
        description: product.description,
        value: product.value,
        type: product.type,
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
      .delete(`/product/${id}`)
      .then((e) => {
        toast({
          title: "Produto deletado com sucesso!",
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
            <Text>{id > 0 ? "Editar Produto" : "Novo Produto"}</Text>
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
                  value={product?.name}
                  onChange={(e) => {
                    setProduct({ ...product, name: e.target.value });
                  }}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel htmlFor="description">Descrição</FormLabel>
                <Input
                  id="description"
                  name="description"
                  placeholder="Descrição"
                  value={product?.description}
                  onChange={(e) => {
                    setProduct({ ...product, description: e.target.value });
                  }}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel htmlFor="value">Valor</FormLabel>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  placeholder="Valor"
                  value={product?.value}
                  onChange={(e) => {
                    setProduct({ ...product, value: +e.target.value });
                  }}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel htmlFor="type">Tipo</FormLabel>
                <Select
                  placeholder="Selecione o Tipo"
                  value={product.type}
                  onChange={(e) => {
                    setProduct({ ...product, type: e.target.value });
                  }}
                >
                  <option value="store">Loja</option>
                  <option value="bar">Bar</option>
                </Select>
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
