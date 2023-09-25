'use client'

import { Box, Checkbox, Container, Divider, Flex, FormControl, FormLabel, Heading, Input, Select, Stack, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text, useToast } from "@chakra-ui/react"
import { api } from "@/common/service/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/button";

interface ProductEdit {
  params: { id: number }
}

export default function Student({ params: { id } }: ProductEdit) {
  const toast = useToast();
  const router = useRouter();
  const [student, setStudent] = useState({
    id: id,
    name: '',
    birth_date: '',
    gender: '',
    status: false,
    phone: '',
    email: '',
    city: '',
    uf: '',
    cep: '',
    street: '',
    number: '',
    district: '',
  })

  useEffect(() => {
    if (id > 0) {
      api.get(`/student/${id}`).then(item => {
        const studentData = item.data;
        setStudent({ ...studentData })
      })
    }
  }, [])

  const handleReturn = async () => { router.push("/student") }

  const handleUpdate = async () => {
    // api.put(`/product/${id}`, {
    //   name: product.name,
    //   description: product.description,
    //   value: product.value,
    //   type: product.type
    // })
    //   .then(e => {
    //     toast({
    //       title: 'Produto atualizado com sucesso!',
    //       status: 'success',
    //       duration: 2000,
    //       isClosable: true,
    //     })
    //     handleReturn();
    //   })
    //   .catch(e => {
    //     toast({
    //       title: 'Algo deu errado!',
    //       status: 'error',
    //       duration: 2000,
    //       description: e.response?.data?.message || 'Erro interno',
    //       isClosable: true,
    //     })
    //   });
  }

  const handleCreate = async () => {
    // api.post(`/product`, {
    //   name: product.name,
    //   description: product.description,
    //   value: product.value,
    //   type: product.type
    // })
    //   .then(e => {
    //     toast({
    //       title: `Funcionário ${e.data?.id} criado com sucesso!`,
    //       status: 'success',
    //       duration: 2000,
    //       isClosable: true,
    //     })
    //     handleReturn();
    //   })
    //   .catch(e => {
    //     toast({
    //       title: 'Algo deu errado!',
    //       status: 'error',
    //       duration: 2000,
    //       description: e.response?.data?.message || 'Erro interno',
    //       isClosable: true,
    //     })
    //   });
  }

  const handleDelete = async () => {
    // api.delete(`/product/${id}`)
    //   .then(e => {
    //     toast({
    //       title: 'Produto deletado com sucesso!',
    //       status: 'success',
    //       duration: 2000,
    //       isClosable: true,
    //     })
    //     handleReturn();
    //   })
    //   .catch(e => {
    //     toast({
    //       title: 'Algo deu errado!',
    //       status: 'error',
    //       duration: 2000,
    //       description: e.response?.data?.message || 'Erro interno',
    //       isClosable: true,
    //     })
    //   });
  }

  return (
    <Container maxW="container.sm" py={8}>
      <Tabs variant='unstyled'>
        <TabList mb='1em'>
          <Tab _selected={{ fontWeight: 'bold' }}>Dados Pessoais</Tab>
          <Tab _selected={{ fontWeight: 'bold' }}>Questionário</Tab>
        </TabList>
        <TabIndicator
          mt="-10.5px"
          height="2px"
          bg="black"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel>
            <Box display="flex" flexDirection={{ base: 'column', md: 'row' }}>
              <Box flex="1" mr={{ md: 4 }}>
                <Flex justifyContent={'space-between'}>
                  {id > 0 &&
                    <>
                      <FormControl mb={4} mr="5%" minW={'85%'}>
                        <FormLabel htmlFor="id">ID</FormLabel>
                        <Input colorScheme={'blackAlpha'} id="id" name="id" placeholder="ID" isReadOnly value={id} />
                      </FormControl>
                      <FormControl mb={4} >
                        <FormLabel htmlFor="status">Status</FormLabel>
                        <Checkbox id="status" name="status" placeholder="Status" isChecked={student.status}
                          borderColor={'black'}
                          onChange={e => { setStudent({ ...student, status: !student.status }) }}></Checkbox>
                      </FormControl>
                    </>}
                </Flex>
                <FormControl mb={4}>
                  <FormLabel htmlFor="name">Nome</FormLabel>
                  <Input id="name" name="name" placeholder="Nome" value={student?.name}
                    onChange={e => { setStudent({ ...student, name: e.target.value }) }} />
                </FormControl>
                <Flex justifyContent={'space-between'}>
                  <FormControl mb={4} mr="3%">
                    <FormLabel htmlFor="birth_date">Data de Nascimento</FormLabel>
                    <Input type="date" id="birth_date" name="birth_date" placeholder="Data Nascimento" value={student?.birth_date}
                      onChange={e => { setStudent({ ...student, birth_date: e.target.value }) }} />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="gender">Gênero</FormLabel>
                    <Select placeholder='Selecione o Gênero' value={student.gender} onChange={e => { setStudent({ ...student, gender: e.target.value }) }}>
                      <option value='M'>Masculino</option>
                      <option value='F'>Feminino</option>
                    </Select>
                  </FormControl>
                </Flex>
                <Divider mb={4} />
                <FormControl mb={4}>
                  <FormLabel htmlFor="contact">Contato:</FormLabel>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="phone">Telefone</FormLabel>
                    <Input id="phone" name="phone" placeholder="Telefone" value={student?.phone}
                      onChange={e => { setStudent({ ...student, phone: e.target.value }) }} />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input id="email" name="email" placeholder="Email" value={student?.email}
                      onChange={e => { setStudent({ ...student, email: e.target.value }) }} />
                  </FormControl>
                </FormControl>
                <Divider mb={4} />
                <FormControl mb={4}>
                  <FormLabel htmlFor="address">Endereço:</FormLabel>
                  <Box paddingLeft={1}>
                    <Flex justifyContent={'space-between'}>
                      <FormControl mb={4} mr="3%" maxW={'30%'}>
                        <FormLabel htmlFor="uf">UF</FormLabel>
                        <Input id="uf" name="uf" placeholder="UF" value={student?.uf}
                          onChange={e => { setStudent({ ...student, uf: e.target.value }) }} />
                      </FormControl>
                      <FormControl mb={4}>
                        <FormLabel htmlFor="cep">CEP</FormLabel>
                        <Input id="cep" name="cep" placeholder="CEP" value={student?.cep}
                          onChange={e => { setStudent({ ...student, cep: e.target.value }) }} />
                      </FormControl>
                    </Flex>
                    <FormControl mb={4}>
                      <FormLabel htmlFor="city">Cidade</FormLabel>
                      <Input id="city" name="city" placeholder="Cidade" value={student?.city}
                        onChange={e => { setStudent({ ...student, city: e.target.value }) }} />
                    </FormControl>
                    <FormControl mb={4}>
                      <FormLabel htmlFor="street">Logradouro</FormLabel>
                      <Input id="street" name="street" placeholder="Logradouro" value={student?.street}
                        onChange={e => { setStudent({ ...student, street: e.target.value }) }} />
                    </FormControl>
                    <Flex justifyContent={'space-between'}>
                      <FormControl mb={4} mr={'3%'} maxW={'30%'}>
                        <FormLabel htmlFor="number">Número</FormLabel>
                        <Input id="number" name="number" placeholder="Número" value={student?.number}
                          onChange={e => { setStudent({ ...student, number: e.target.value }) }} />
                      </FormControl>
                      <FormControl mb={4}>
                        <FormLabel htmlFor="district">Bairro</FormLabel>
                        <Input id="district" name="district" placeholder="Bairro" value={student?.district}
                          onChange={e => { setStudent({ ...student, district: e.target.value }) }} />
                      </FormControl>
                    </Flex>
                  </Box>
                </FormControl>
                <FormControl mb={4}>
                  <Stack direction={'row'}>
                    <CustomButton callback={id > 0 ? handleUpdate : handleCreate}>Confirmar</CustomButton>
                    <CustomButton callback={handleDelete} variant="outline" colorSchema="red">Deletar</CustomButton>
                    <CustomButton variant="outline" colorSchema="blackAlpha" callback={handleReturn}>Voltar</CustomButton>
                  </Stack>
                </FormControl>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>

          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  )
}