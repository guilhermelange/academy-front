'use client'

import { useDisclosure, Box, Container, FormControl, FormLabel, Heading, Input, Stack, Text, useToast, Select as Select2, TableContainer, Table, Thead, Tr, Th, Tbody, Td, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Link } from "@chakra-ui/react"
import { api } from "@/common/service/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/button";
import { Select } from "chakra-react-select";
import { FaAngleDown, FaAngleUp, FaPlus, FaTrash } from "react-icons/fa";
import { formatDate, formatValue } from "@/utils/viewUtils";

interface PurchaseEdit {
  params: { id: number }
}

export default function Purchase({ params: { id } }: PurchaseEdit) {
  const toast = useToast();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [allProducts, setAllProducts] = useState([] as any[]);
  const [studentSelect, setStudentSelect] = useState([] as any[]);
  const [installments, setInstallments] = useState([] as any[]);
  const [purchase, setPurchase] = useState({
    student: {
      name: '',
    },
    id: id,
    student_id: 0,
    registration_id: 0,
    amount: 1,
    payment_type: '',
    creation_date: '',
    type: '',
    value: 0.00 as number,
    status: ''
  })
  const [products, setProducts] = useState([] as any[]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (id > 0) {
      api.get(`/purchase/${id}`).then(item => {
        const purchaseData = item.data;
        setPurchase({ ...purchaseData, creation_date: purchaseData?.creation_date.substring(0, 10) })

        setProducts(purchaseData?.purchase_item.map((item: any) => {
          return {
            id: item.id,
            amount: item.amount,
            value: item.product.value,
            name: item.product.name,
          }
        }))

        setInstallments(purchaseData.installment)
      })
    }

    api.get('/product').then(item => {
      setAllProducts(item.data)
    })
  }, [])

  const handleReturn = async () => { router.push("/purchase") }

  const handleCreate = async () => {
    api.post(`/purchase`, {
      student_id: purchase.student_id,
      registration_id: purchase.registration_id,
      amount: purchase.payment_type == 'cash' ? 1 : purchase.amount,
      payment_type: purchase.payment_type,
      type: purchase.type,
      value: purchase.value,
      status: 'pending',
      item: products.map(item => { return { product_id: item.id, amount: item.amount } })
    })
      .then(e => {
        toast({
          title: `Compra ${e.data?.id} criada com sucesso!`,
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

  const handleUpdate = async () => {
    api.put(`/purchase/${id}`, {
      status: purchase.status
    })
      .then(e => {
        toast({
          title: 'Compra atualizada com sucesso!',
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

  useEffect(() => {
    if (purchase.type == 'registration') {
    } else {
      if (products && products.length > 0) {
        const newValue = products.map(item => item.value * item.amount).reduce((total, current) => (total + current))
        setPurchase({ ...purchase, value: newValue });
      } else {
        setPurchase({ ...purchase, value: 0 });
      }
    }

  }, [products])

  let timeout: any;
  function handleLoadStudent(inputValue: any) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (inputValue) {
        api.get(`/student?name=${inputValue}`).then(item => {
          const purchaseData = item.data;
          const labels = [] as any[];
          purchaseData.forEach((element: any) => {
            labels.push({
              label: element.name,
              value: element.id
            })
          });

          setStudentSelect(labels);
        })
      }
    }, 500);
  }

  const productsIds = products?.map(item => item.id)

  function handleAddProduct() {
    if (!productsIds.includes(selectedProduct)) {
      const currentProduct = allProducts.find(item => item.id == selectedProduct);
      setProducts([...products, {
        id: selectedProduct,
        name: currentProduct.name,
        amount: 1,
        value: currentProduct.value,
      }])
    }

    onClose();
  }

  function handleUpdateInstallmentStatus(id: number, status: string) {
    api.put(`/purchase/installment/${id}`, {
      status
    }).then(item => {
      setInstallments(installments.map(item => {
        if (+item.id == id) {
          return { ...item, status: status }
        }
        return item
      }))
    }).catch(error => {
      toast({
        title: 'Algo deu errado!',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    })
  }

  const handleDelete = async () => {
    api.delete(`/purchase/${id}`)
      .then(e => {
        toast({
          title: 'Compra deletada com sucesso!',
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
    <>
      <Container maxW="container.sm" py={8}>
        <Heading size="lg" mb={4} display={'flex'}>
          <Text>{id > 0 ? 'Editar Compra' : 'Nova Compra'}</Text>
        </Heading>
        <Box display="flex" flexDirection={{ base: 'column', md: 'row' }}>
          <Box flex="1" mr={{ md: 4 }}>
            {id > 0 &&
              <FormControl mb={4}>
                <FormLabel htmlFor="id">ID</FormLabel>
                <Input colorScheme={'blackAlpha'} id="id" name="id" placeholder="ID" isReadOnly value={id} />
              </FormControl>}
            <FormControl mb={4}>
              <FormLabel htmlFor="name">Aluno</FormLabel>
              {!(id > 0) &&
                <Select placeholder='Selecione o Aluno' onInputChange={handleLoadStudent} options={studentSelect}
                  onChange={(e: any) => { setPurchase({ ...purchase, student_id: e.value }) }} />}
              {id > 0 &&
                <Input colorScheme={'blackAlpha'} isReadOnly value={purchase.student.name} />}
            </FormControl>
            {id > 0 && purchase.registration_id > 0 && <FormControl mb={4}>
              <FormLabel htmlFor="registration_id">Matrícula</FormLabel>
              <Link href={`/registration/${purchase.registration_id}`}>
                <Input cursor={'pointer'} id="registration_id" name="registration_id" type="number" placeholder="Matrícula" value={purchase.registration_id} isReadOnly />
              </Link>
            </FormControl>}
            <FormControl mb={4}>
              <FormLabel htmlFor="type">Tipo Pagamento</FormLabel>
              {!(id > 0) && <Select2 placeholder='Selecione o Tipo' value={purchase.payment_type} onChange={e => { setPurchase({ ...purchase, payment_type: e.target.value }) }}>
                <option value='cash'>A Vista</option>
                <option value='term'>Parcelado</option>
              </Select2>}
              {id > 0 &&
                <Input colorScheme={'blackAlpha'} isReadOnly value={purchase.payment_type == 'cash' ? 'A Vista' : 'Parcelado'} />}
            </FormControl>
            {purchase.payment_type == 'term' && <FormControl mb={4}>
              <FormLabel htmlFor="amount">Quantidade Parc.</FormLabel>
              <Input id="amount" name="amount" type="number" placeholder="Quantidade Parc." value={purchase.amount}
                onChange={e => { setPurchase({ ...purchase, amount: +e.target.value }) }} />
            </FormControl>}
            <FormControl mb={4}>
              <FormLabel htmlFor="type">Tipo</FormLabel>
              {!(id > 0) && <Select2 placeholder='Selecione o Tipo' value={purchase.type} onChange={e => { setPurchase({ ...purchase, type: e.target.value }) }} isReadOnly={!(id > 0)}>
                <option value='bar'>Bar</option>
                <option value='store'>Loja</option>
                {id > 0 && <option value='registration'>Matrícula</option>}
              </Select2>}
              {id > 0 &&
                <Input colorScheme={'blackAlpha'} isReadOnly value={purchase.type == 'bar' ? 'Bar' : 'Loja'} />}
            </FormControl>
            {id > 0 && <FormControl mb={4}>
              <FormLabel htmlFor="creation_date">Data Criação</FormLabel>
              <Input type="date" id="creation_date" name="creation_date" placeholder="Data Criação" value={purchase.creation_date}
                onChange={e => { setPurchase({ ...purchase, creation_date: e.target.value }) }} isReadOnly />
            </FormControl>}
            <FormControl mb={4}>
              <FormLabel htmlFor="value">Valor</FormLabel>
              <Input id="value" name="value" type="number" placeholder="Valor" value={purchase?.value} isReadOnly
              // onChange={e => { setPurchase({ ...purchase, value: +e.target.value }) }}
              />
            </FormControl>
            {id > 0 && <FormControl mb={4}>
              <FormLabel htmlFor="status">Status</FormLabel>
              <Select2 placeholder='Selecione o Status' value={purchase.status} onChange={e => { setPurchase({ ...purchase, status: e.target.value }) }}>
                <option value='pending'>Pendente</option>
                <option value='paid'>Pago</option>
                <option value='canceled'>Cancelado</option>
              </Select2>
            </FormControl>}
            <FormControl mb={12}>
              <FormLabel>Itens</FormLabel>
              <TableContainer w={'full'}>
                <Table variant="striped" size='sm' colorScheme={'blackAlpha'}>
                  <Thead>
                    <Tr>
                      <Th>Produto</Th>
                      <Th>Quantidade</Th>
                      <Th>Valor</Th>
                      {!(id > 0) && <Th textAlign={'right'}><IconButton
                        variant="outline"
                        colorScheme="green"
                        aria-label="Add item"
                        icon={<FaPlus />}
                        ml="2"
                        onClick={onOpen}
                      /></Th>}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {products && products?.map((product: any) => (
                      <Tr key={product.id}>
                        <Td>{product.name}</Td>
                        <Td>{product.amount}</Td>
                        <Td>{formatValue(+(product.amount * product.value))}</Td>
                        {!(id > 0) && <Td textAlign={'right'}>
                          <IconButton
                            variant={'outline'}
                            aria-label="Minus"
                            icon={<FaAngleDown />}
                            ml="2"
                            onClick={() => {
                              if (product.amount > 1)
                                setProducts(products.map(object => {
                                  if (object.id == product.id) {
                                    return { ...object, amount: product.amount - 1 }
                                  }
                                  return object;
                                }))
                            }}
                          />
                          <IconButton
                            variant={'outline'}
                            aria-label="Plus"
                            icon={<FaAngleUp />}
                            ml="2"
                            onClick={() => {
                              if (product.amount < 50)
                                setProducts(products.map(object => {
                                  if (object.id == product.id) {
                                    return { ...object, amount: product.amount + 1 }
                                  }
                                  return object;
                                }))
                            }}
                          />
                          <IconButton
                            variant="outline"
                            colorScheme="red"
                            aria-label="Remove item"
                            icon={<FaTrash />}
                            ml="2"
                            onClick={() => { setProducts(products.filter(aux => aux.id !== product.id)) }}
                          /></Td>}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </FormControl>
            {id > 0 &&
              <FormControl mb={8}>
                <FormLabel>Parcelas</FormLabel>
                <TableContainer w={'full'}>
                  <Table variant="striped" size='sm' colorScheme={'blackAlpha'}>
                    <Thead>
                      <Tr>
                        <Th>Vencimento</Th>
                        <Th>Valor</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {installments && installments?.map((installment: any) => (
                        <Tr key={installment.id}>
                          <Td>{formatDate(new Date(installment.due_date))}</Td>
                          <Td>{formatValue(+installment.value)}</Td>
                          <Td>
                            <Select2 size={'sm'} variant={'unstyled'} value={installment.status} onChange={e => { handleUpdateInstallmentStatus(installment.id, e.target.value) }}>
                              <option value='pending'>Pendente</option>
                              <option value='paid'>Pago</option>
                              <option value='canceled'>Cancelado</option>
                            </Select2>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </FormControl>}
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selecione o Produto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Select placeholder='Selecione o Produto' options={allProducts.filter(item => !productsIds.includes(item.id)).map(item => {
                return { label: item.name, value: item.id }
              })}
                onChange={(e: any) => { setSelectedProduct(e.value); }} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <CustomButton callback={handleAddProduct}>Confirmar</CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}