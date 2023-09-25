'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Link,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import CustomButton from '@/components/button'
import { api } from '@/common/service/api'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false)
  const [state, setState] = useState({email: '', password: '', name: ''});
  const router = useRouter();

  const handleSubmit = async () => {
    const { email, password, name } = state;
    
    try {
      await api.post('/user', { email, password, name })
      toast({
        title: 'Conectado',
        description: 'Usuário criado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      router.push('/signin')
    } catch (error) {
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
      align={'center'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Cadastre-se
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          boxShadow={'lg'}
          bg={'white'}
          p={8}>
          <Stack spacing={4} minW={'350px'}>
            <FormControl id="name" isRequired>
              <FormLabel>Nome</FormLabel>
              <Input type="text" value={state.name} onChange={(e) => {setState({...state, name: e.target.value})}}/>
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={state.email} onChange={(e) => {setState({...state, email: e.target.value})}}/>
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Senha</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} value={state.password} onChange={(e) => {setState({...state, password: e.target.value})}}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    _hover={{
                      bg: 'transparent'
                    }}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <CustomButton loadingText='Enviando' callback={handleSubmit}>Cadastrar</CustomButton>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'} fontSize={'sm'}>
                Já possui uma conta? <Link fontWeight={'bold'} color={'black'} href='/signin'>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}