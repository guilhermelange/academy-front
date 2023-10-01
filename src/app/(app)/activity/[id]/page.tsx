'use client'

import { Box, Container, FormControl, FormLabel, Heading, Input, Select, Stack, Text, useToast } from "@chakra-ui/react"
import { api } from "@/common/service/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/button";

interface ActivityEdit {
  params: { id: number }
}

export default function Activity({ params: { id } }: ActivityEdit) {
  const toast = useToast();
  const router = useRouter();
  const [activity, setActivity] = useState({
    id: id,
    name: ''
  })

  useEffect(() => {
    if (id > 0) {
      api.get(`/activity/${id}`).then(item => {
        const activityData = item.data;
        setActivity({ ...activityData })
      })
    }
  }, [])

  const handleReturn = async () => { router.push("/activity") }

  const handleUpdate = async () => {
    api.put(`/activity/${id}`, {
      name: activity.name,
    })
      .then(e => {
        toast({
          title: 'Atividade atualizado com sucesso!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        handleReturn();
      })
      .catch(e => {
        toast({
          title: 'Algo deu errado!',
          status: 'error',
          duration: 2000,
          description: e.response?.data?.message || 'Erro interno',
          isClosable: true,
        })
      });
  }

  const handleCreate = async () => {
    api.post(`/activity`, {
      name: activity.name,
    })
      .then(e => {
        toast({
          title: `Atividade ${e.data?.id} criada com sucesso!`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        handleReturn();
      })
      .catch(e => {
        toast({
          title: 'Algo deu errado!',
          status: 'error',
          duration: 2000,
          description: e.response?.data?.message || 'Erro interno',
          isClosable: true,
        })
      });
  }

  const handleDelete = async () => {
    api.delete(`/activity/${id}`)
      .then(e => {
        toast({
          title: 'Atividade deletada com sucesso!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        handleReturn();
      })
      .catch(e => {
        toast({
          title: 'Algo deu errado!',
          status: 'error',
          duration: 2000,
          description: e.response?.data?.message || 'Erro interno',
          isClosable: true,
        })
      });
  }

  return (
    <Container maxW="container.sm" py={8}>
      <Heading size="lg" mb={4} display={'flex'}>
        <Text>{id > 0 ? 'Editar Produto' : 'Novo Produto'}</Text>
      </Heading>
      <Box display="flex" flexDirection={{ base: 'column', md: 'row' }}>
        <Box flex="1" mr={{ md: 4 }}>
          {id > 0 &&
            <FormControl mb={4}>
              <FormLabel htmlFor="id">ID</FormLabel>
              <Input colorScheme={'blackAlpha'} id="id" name="id" placeholder="ID" isReadOnly value={id} />
            </FormControl>}
          <FormControl mb={4}>
            <FormLabel htmlFor="name">Nome</FormLabel>
            <Input id="name" name="name" placeholder="Nome" value={activity?.name}
              onChange={e => { setActivity({ ...activity, name: e.target.value }) }} />
          </FormControl>
          <FormControl mb={4}>
            <Stack direction={'row'}>
              <CustomButton callback={id > 0 ? handleUpdate : handleCreate}>Confirmar</CustomButton>
              {id > 0 && <CustomButton callback={handleDelete} variant="outline" colorSchema="red">Deletar</CustomButton>}
              <CustomButton variant="outline" colorSchema="blackAlpha" callback={handleReturn}>Voltar</CustomButton>
            </Stack>
          </FormControl>
        </Box>
      </Box>
    </Container>
  )
}