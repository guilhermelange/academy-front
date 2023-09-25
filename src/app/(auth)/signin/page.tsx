'use client'

import { AuthContext } from '@/common/context/AuthContext';
import CustomButton from '@/components/button'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Link,
  useToast,
} from '@chakra-ui/react'
import { useContext, useState } from 'react';

export default function SignIn() {
  const toast = useToast();
  const { signIn } = useContext(AuthContext);
  const [state, setState] = useState({email: '', password: ''});

  const handleSubmit = async () => {
    const { email, password } = state;
    
    try {
      console.log('Passo1')
      await signIn({ email, password });
      console.log('Passo2')
      toast({
        title: 'Conectado',
        description: 'Login efetuado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Oops...',
        description: 'Algo deu errado!',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  };

  return (
    <Flex
      minH={'80vh'}
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={6} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Efetue login na sua conta!</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={'white'}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input type="email" value={state.email} onChange={(e) => {setState({...state, email: e.target.value})}}/>
            </FormControl>
            <FormControl id="password">
              <FormLabel>Senha</FormLabel>
              <Input type="password" value={state.password} onChange={(e) => {setState({...state, password: e.target.value})}} />
            </FormControl>
            <Stack spacing={10}>
              <CustomButton callback={handleSubmit}>Login</CustomButton>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'} fontSize={'sm'}>
                Ainda não possui uma conta? <Link fontWeight={'bold'} color={'black'} href='/signup'>Cadastro</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}