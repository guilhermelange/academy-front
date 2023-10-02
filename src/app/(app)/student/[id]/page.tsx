'use client'

import { Box, Checkbox, Container, Divider, Flex, FormControl, FormLabel, Heading, IconButton, Input, Select, Stack, Switch, Tab, TabIndicator, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Text, Th, Thead, Tr, VStack, useToast } from "@chakra-ui/react"
import { api } from "@/common/service/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/button";

interface ProductEdit {
  params: { id: number }
}

interface studentDto {
  id?: number,
  name: string,
  birth_date: string,
  gender: string,
  status: boolean,
  phone: string,
  email: string,
  city: string,
  uf: string,
  cep: string,
  street: string,
  number: string,
  district: string,
}

export default function Student({ params: { id } }: ProductEdit) {
  const toast = useToast();
  const router = useRouter();
  const [student, setStudent] = useState<studentDto>({
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
  const [quiz, setQuiz] = useState({
    health_insurance: false,
    health_insurance_text: '',
    other_sport: false,
    other_sport_text: '',
    why_do: [] as number[],
    why_do_text: '',
    how_know: [] as number[],
    how_know_text: ''
  });

  useEffect(() => {
    if (id > 0) {
      api.get(`/student/${id}`).then(item => {
        const studentData = item.data;
        setStudent({ ...studentData, birth_date: studentData?.birth_date.substring(0, 10) })

        if (studentData?.quiz) {
          const quizData = JSON.parse(studentData.quiz)
          setQuiz(quizData);
        }
      })
    }
  }, [])

  const question1Options = [
    { id: 1, name: 'Aprender a nadar' },
    { id: 2, name: 'Bronquite' },
    { id: 3, name: 'Coluna' },
    { id: 4, name: 'Obesidade' },
    { id: 5, name: 'Treinar' },
    { id: 6, name: 'Manter a forma' },
    { id: 7, name: 'Gestante' },
    { id: 8, name: 'Conselho médico' },
    { id: 9, name: 'Outro' },
  ]

  const question2Options = [
    { id: 1, name: 'Jornal' },
    { id: 2, name: 'Placa' },
    { id: 3, name: 'Cartaz' },
    { id: 4, name: 'Panfleto' },
    { id: 5, name: 'Amigos' },
    { id: 6, name: 'Outdoor' },
    { id: 7, name: 'Internet' },
    { id: 8, name: 'Passando em Frente' },
    { id: 9, name: 'Outros' },
  ]

  const handleReturn = async () => { router.push("/student") }

  const handleUpdate = async () => {
    console.log(JSON.stringify(quiz))
    api.put(`/student/${id}`, { ...student, quiz: JSON.stringify(quiz) })
      .then(e => {
        toast({
          title: 'Aluno atualizado com sucesso!',
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
    const newObject = { ...student, quiz: JSON.stringify(quiz) };
    delete newObject.id;

    api.post(`/student`, newObject)
      .then(e => {
        toast({
          title: `Aluno ${e.data?.id} criado com sucesso!`,
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
    api.delete(`/student/${id}`)
      .then(e => {
        toast({
          title: 'Aluno deletado com sucesso!',
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
    <Container maxW="container.md" py={8}>
      <Tabs variant='unstyled'>
        <TabList mb='1em'>
          <Tab _selected={{ fontWeight: 'bold' }}>Dados Pessoais</Tab>
          <Tab _selected={{ fontWeight: 'bold' }}>Questionário</Tab>
          {/* <Tab _selected={{ fontWeight: 'bold' }}>Matrículas</Tab> */}
        </TabList>
        <TabIndicator
          mt="-10.5px"
          height="2px"
          bg="black"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel >
            <Box display="flex" flexDirection={{ base: 'column', md: 'row' }}>
              <Box flex="1" mr={{ md: 4 }}>
                <Flex justifyContent={'space-between'}>
                  <FormControl mb={4} mr="5%" minW={'85%'}>
                    <FormLabel htmlFor="name">Nome</FormLabel>
                    <Input id="name" name="name" placeholder="Nome" value={student?.name}
                      onChange={e => { setStudent({ ...student, name: e.target.value }) }} />
                  </FormControl>
                  <FormControl mb={4} >
                    <FormLabel htmlFor="status">Status</FormLabel>
                    <Checkbox id="status" name="status" placeholder="Status" isChecked={student.status}
                      borderColor={'black'}
                      onChange={e => { setStudent({ ...student, status: !student.status }) }}></Checkbox>
                  </FormControl>
                </Flex>
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
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} maxW={"container.sm"}>
              <Box flex="1" mr={{ md: 4 }}>
                <FormControl mb={4} display={'flex'}>
                  <FormLabel htmlFor="student">Aluno:</FormLabel>
                  {student?.name}
                </FormControl>

                <FormControl display='flex' alignItems='center' mb={4}>
                  <FormLabel htmlFor='planosaude' minW={'28%'} >
                    Possui plano de Saúde?
                  </FormLabel>
                  <Switch id='planosaude' mr={4} isChecked={quiz?.health_insurance}
                    onChange={e => { setQuiz({ ...quiz, health_insurance: !quiz.health_insurance }) }} />
                  {quiz.health_insurance &&
                    <Input id="planosaude_text" name="planosaude_text" placeholder="" value={quiz?.health_insurance_text}
                      onChange={e => { setQuiz({ ...quiz, health_insurance_text: e.target.value }) }} />}
                </FormControl>
                <FormControl display='flex' alignItems='center' mb={4}>
                  <FormLabel htmlFor='praticaesporte' minW={'28%'} >
                    Pratica outro esporte?
                  </FormLabel>
                  <Switch id='praticaesporte' mr={4} isChecked={quiz?.other_sport}
                    onChange={e => { setQuiz({ ...quiz, other_sport: !quiz.other_sport }) }} />
                  {quiz.other_sport &&
                    <Input id="praticaesporte_text" name="praticaesporte_text" placeholder="" value={quiz?.other_sport_text}
                      onChange={e => { setQuiz({ ...quiz, other_sport_text: e.target.value }) }} />}
                </FormControl>
                <FormLabel htmlFor='porque' minW={'31%'} >
                  Porque faz academia?
                </FormLabel>
                <FormControl display='flex' alignItems='center' mb={4} justifyContent={'flex-start'} flexWrap={'wrap'} gap={4}>
                  {quiz?.why_do && question1Options.map(item => (
                    <Checkbox key={item.id} borderColor={'black'} isChecked={quiz?.why_do.includes(item?.id)}
                      onChange={e => {
                        setQuiz({
                          ...quiz, why_do: quiz?.why_do.includes(item?.id) ?
                            quiz?.why_do.filter(aux => aux !== item.id) :
                            [...quiz?.why_do, item.id]
                        })
                      }}
                    >
                      {item.name}
                    </Checkbox>
                  ))}
                  {quiz?.why_do.includes(9) &&
                    <Input id="porque" name="porque_text" placeholder="" value={quiz?.why_do_text}
                      onChange={e => { setQuiz({ ...quiz, why_do_text: e.target.value }) }} />}
                </FormControl>
                <FormLabel htmlFor='como' minW={'31%'} >
                  Como soube da academia?
                </FormLabel>
                <FormControl display='flex' alignItems='center' mb={4} justifyContent={'flex-start'} flexWrap={'wrap'} gap={4}>
                  {question2Options.map(item => (
                    <Checkbox key={item.id} borderColor={'black'} isChecked={quiz?.how_know.includes(item?.id)}
                      onChange={e => {
                        setQuiz({
                          ...quiz, how_know: quiz?.how_know.includes(item?.id) ?
                            quiz?.how_know.filter(aux => aux !== item.id) :
                            [...quiz?.how_know, item.id]
                        })
                      }}>
                      {item.name}
                    </Checkbox>
                  ))}
                  {quiz?.how_know.includes(9) && <Input id="como" name="como_text" placeholder="" value={quiz?.how_know_text}
                    onChange={e => { setQuiz({ ...quiz, how_know_text: e.target.value }) }} />}

                </FormControl>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} maxW={"container.lg"}>
              <Box textAlign="center" fontSize="xl">
                
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <FormControl mb={4}>
        <Stack direction={'row'}>
          <CustomButton callback={id > 0 ? handleUpdate : handleCreate}>Confirmar</CustomButton>
          {id > 0 && <CustomButton callback={handleDelete} variant="outline" colorSchema="red">Deletar</CustomButton>}
          <CustomButton variant="outline" colorSchema="blackAlpha" callback={handleReturn}>Voltar</CustomButton>
        </Stack>
      </FormControl>
    </Container>
  )
}