"use client";

import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  Select as Select2,
  Checkbox,
  Flex,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
  IconButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import { api } from "@/common/service/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/button";
import { Select } from "chakra-react-select";
import { formatDate, formatValue } from "@/utils/viewUtils";
import { TbExternalLink } from "react-icons/tb";
import Loading from "@/components/loading";
import { FaTrash } from "react-icons/fa";

interface RegistrationEdit {
  params: { id: number };
}

export default function Registration({ params: { id } }: RegistrationEdit) {
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const naturalAllDays = [
    { label: "Segunda", value: 1 },
    { label: "Domingo", value: 0 },
    { label: "Terça", value: 2 },
    { label: "Quarta", value: 3 },
    { label: "Quinta", value: 4 },
    { label: "Sexta", value: 5 },
    { label: "Sábado", value: 6 },
  ];
  const [allDays, setAllDays] = useState([] as any[]);
  const [studentSelect, setStudentSelect] = useState([] as any[]);
  const [activities, setActivities] = useState([] as any[]);
  const [professionals, setProfessionals] = useState([] as any[]);
  const [purchases, setPurchases] = useState([] as any[]);
  const [presences, setPresences] = useState([] as any[]);
  const [presenceState, setPresenceState] = useState({
    presence_date: ""
  })
  const [purchase, setPurchase] = useState({
    amount: 1,
    payment_type: "",
    type: "registration",
    value: 0.0 as number,
    status: "pending",
    expiration: "",
  });
  const [registration, setRegistration] = useState({
    id: id,
    student_id: 0,
    activity_id: 0,
    professional_id: 0,
    status: true,
    day_of_week: [] as number[],
    start_time: "",
    end_time: "",
    expiration: "",
    student: {
      name: "",
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenPresence, onOpen: onOpenPresence, onClose: onClosePresence } = useDisclosure();

  useEffect(() => {
    if (id > 0) {
      api.get(`/registration/${id}`).then((item) => {
        const registrationData = item.data;

        setRegistration({
          ...registrationData,
          start_time: registrationData.start_time.substring(11, 16),
          end_time: registrationData.end_time.substring(11, 16),
          expiration: registrationData.expiration.substring(0, 10),
        });

        setPurchases(registrationData.purchases);
        setPresences(registrationData.presence);

        setAllDays(naturalAllDays.filter((item) => registrationData.day_of_week.includes(item.value)));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    api.get("activity").then((item) => {
      setActivities(item.data);
    });

    api.get("professional").then((item) => {
      setProfessionals(item.data);
    });
  }, []);

  const handleReturn = async () => {
    router.push("/registration");
  };

  const handleRenovate = async () => {
    api
      .post(`/registration/${id}/renovate`, {
        amount: purchase.amount,
        value: purchase.value,
        payment_type: purchase.payment_type,
        expiration: purchase.expiration,
      })
      .then((item) => {
        toast({
          title: "Matrícula atualizado com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
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
        onClose();
      });
  };

  const handleUpdate = async () => {
    const [hoursIni, mimIni] = registration.start_time.split(":");
    const iniDate = new Date();
    iniDate.setUTCHours(+hoursIni, +mimIni, 0);

    const [hoursFim, mimFim] = registration.end_time.split(":");
    const endDate = new Date();
    endDate.setUTCHours(+hoursFim, +mimFim, 0);

    api
      .put(`/registration/${id}`, {
        professional_id: registration.professional_id,
        day_of_week: registration.day_of_week,
        status: registration.status,
        start_time: iniDate,
        end_time: endDate,
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
    const [hoursIni, mimIni] = registration.start_time.split(":");
    const iniDate = new Date();
    iniDate.setUTCHours(+hoursIni, +mimIni, 0);

    const [hoursFim, mimFim] = registration.end_time.split(":");
    const endDate = new Date();
    endDate.setUTCHours(+hoursFim, +mimFim, 0);

    api
      .post(`/registration`, {
        ...purchase,
        ...registration,
        start_time: iniDate,
        end_time: endDate,
      })
      .then((e) => {
        toast({
          title: `Matrícula ${e.data?.id} criada com sucesso!`,
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
      .delete(`/registration/${id}`)
      .then((e) => {
        toast({
          title: "Matrícula deletada com sucesso!",
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

  const handlePresence = async () => {
    api
      .post(`/presence`, {
        registration_id: id,
        presence_date: presenceState.presence_date
      })
      .then((e) => {
        toast({
          title: "Presença adicionada com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        
        setPresences([...presences, {
          id: e.data.id,
          registration_id: id,
          presence_date: e.data.presence_date.substring(0, 10)
        }])
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

  let timeout: any;
  function handleLoadStudent(inputValue: any) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (inputValue) {
        api.get(`/student?name=${inputValue}`).then((item) => {
          const studentData = item.data;
          const labels = [] as any[];
          studentData.forEach((element: any) => {
            labels.push({
              label: element.name,
              value: element.id,
            });
          });

          setStudentSelect(labels);
        });
      }
    }, 500);
  }

  function handleClickDeletePresence(itemId: number){
    api.delete(`/presence/${itemId}`)
      .then(item => {
        setPresences(presences.filter(item => item.id != itemId));
        toast({
          title: "Presença removida com sucesso!",
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
      })
  }

  return (
    <>
      <Container maxW="container.sm" py={8}>
        {loading && <Loading></Loading>}
        {!loading && (
          <>
            <Heading size="lg" mb={4} display={"flex"}>
              <Text>{id > 0 ? "Editar Matrícula" : "Nova Matrícula"}</Text>
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
                  <FormLabel htmlFor="name">Aluno</FormLabel>
                  {!(id > 0) && (
                    <Select
                      placeholder="Selecione o Aluno"
                      onInputChange={handleLoadStudent}
                      options={studentSelect}
                      onChange={(e: any) => {
                        setRegistration({ ...registration, student_id: e.value });
                      }}
                    />
                  )}
                  {id > 0 && <Input colorScheme={"blackAlpha"} isReadOnly value={registration.student.name} />}
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel htmlFor="activity">Atividade</FormLabel>
                  <Select2
                    placeholder="Selecione a Atividade"
                    value={registration.activity_id}
                    onChange={(e) => {
                      setRegistration({ ...registration, activity_id: +e.target.value });
                    }}
                  >
                    {activities &&
                      activities.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </Select2>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel htmlFor="professional">Professor</FormLabel>
                  <Select2
                    placeholder="Selecione o professor"
                    value={registration.professional_id}
                    onChange={(e) => {
                      setRegistration({ ...registration, professional_id: +e.target.value });
                    }}
                  >
                    {professionals &&
                      professionals.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </Select2>
                </FormControl>
                <Flex justifyContent={"space-between"}>
                  <FormControl mb={4} mr="3%">
                    <FormLabel htmlFor="day">Dias</FormLabel>
                    <Select
                      isMulti
                      placeholder="Selecione os Dias"
                      options={naturalAllDays}
                      value={allDays}
                      onChange={(e: any) => {
                        setRegistration({ ...registration, day_of_week: e.map((item: any) => item.value) });
                        setAllDays(
                          naturalAllDays.filter((item) => e.map((aux: any) => aux.value).includes(item.value))
                        );
                      }}
                    />
                  </FormControl>
                  <FormControl mb={4} maxW={"12%"}>
                    <FormLabel htmlFor="status">Status</FormLabel>
                    <Checkbox
                      id="status"
                      name="status"
                      placeholder="Status"
                      isChecked={registration.status}
                      borderColor={"black"}
                      onChange={(e) => {
                        setRegistration({ ...registration, status: !registration.status });
                      }}
                    ></Checkbox>
                  </FormControl>
                </Flex>
                <Flex justifyContent={"space-between"}>
                  <FormControl mb={4} mr="3%">
                    <FormLabel htmlFor="start_time">Hora Início</FormLabel>
                    <Input
                      type="time"
                      id="start_time"
                      name="start_time"
                      placeholder="Hora Início"
                      value={registration?.start_time}
                      onChange={(e) => {
                        setRegistration({ ...registration, start_time: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="end_time">Hora Fim</FormLabel>
                    <Input
                      type="time"
                      id="end_time"
                      name="end_time"
                      placeholder="Hora fim"
                      value={registration?.end_time}
                      onChange={(e) => {
                        setRegistration({ ...registration, end_time: e.target.value });
                      }}
                    />
                  </FormControl>
                </Flex>
                <FormControl mb={4}>
                  <FormLabel htmlFor="expiration">Data de Expiração</FormLabel>
                  <Input
                    type="date"
                    id="expiration"
                    name="expiration"
                    placeholder="Data de Expiração"
                    readOnly={id > 0 ? true : false}
                    value={registration?.expiration}
                    onChange={(e) => {
                      setRegistration({ ...registration, expiration: e.target.value });
                    }}
                  />
                </FormControl>

                {id > 0 && (
                  <>
                    <FormControl mb={4}>
                      <Divider></Divider>
                    </FormControl>
                    <FormControl mb={8}>
                      <Tabs variant="unstyled">
                        <TabList mb="1em">
                          <Tab _selected={{ fontWeight: "bold" }}>Compras Relacionadas</Tab>
                          <Tab _selected={{ fontWeight: "bold" }}>Presença</Tab>
                        </TabList>
                        <TabIndicator mt="-10.5px" height="2px" bg="black" borderRadius="1px" />
                        <TabPanels>
                          <TabPanel>
                            <TableContainer w={"full"}>
                              <Table variant="striped" size="sm" colorScheme={"blackAlpha"}>
                                <Thead>
                                  <Tr>
                                    <Th>Id</Th>
                                    <Th>Valor</Th>
                                    <Th>Status</Th>
                                    <Th>Data Criação</Th>
                                    <Th></Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {purchases &&
                                    purchases?.sort((a: any, b: any) => b.id - a.id).map((item: any) => (
                                      <Tr key={item.id}>
                                        <Td>{item.id}</Td>
                                        <Td>{formatValue(+item.value)}</Td>
                                        <Td>
                                          {item.status == "pending"
                                            ? "Pendente"
                                            : item.status == "paid"
                                              ? "Pago"
                                              : "Cancelado"}
                                        </Td>
                                        <Td>{formatDate(new Date(item.creation_date))}</Td>
                                        <Td>
                                          <Link href={`/purchase/${item.id}`}>
                                            <IconButton
                                              variant="outline"
                                              textAlign={"right"}
                                              aria-label="Link"
                                              icon={<TbExternalLink />}
                                              ml="2"
                                              onClick={undefined}
                                            />
                                          </Link>
                                        </Td>
                                      </Tr>
                                    ))}
                                </Tbody>
                              </Table>
                            </TableContainer>
                          </TabPanel>
                          <TabPanel>
                            <TableContainer w={"full"}>
                              <Table variant="striped" size="sm" colorScheme={"blackAlpha"}>
                                <Thead>
                                  <Tr>
                                    <Th>Id</Th>
                                    <Th>Data</Th>
                                    <Th></Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {presences &&
                                    presences?.sort((a: any, b: any) => b.id - a.id).map((item: any) => (
                                      <Tr key={item.id}>
                                        <Td>{item.id}</Td>
                                        <Td>{formatDate(new Date(item.presence_date))}</Td>
                                        <Td>
                                          <IconButton
                                            variant="outline"
                                            textAlign={"right"}
                                            aria-label="Deletar item"
                                            colorScheme="red"
                                            icon={<FaTrash />}
                                            ml="2"
                                            onClick={() => {handleClickDeletePresence(item.id) }}
                                          />
                                        </Td>
                                      </Tr>
                                    ))}
                                </Tbody>
                              </Table>
                            </TableContainer>
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                      {/* <FormLabel>Compras Relacionadas</FormLabel> */}
                    </FormControl>
                  </>
                )}
                <FormControl mb={4}>
                  <Stack direction={"row"}>
                    {id > 0 && <CustomButton callback={handleUpdate}>{"Continuar"}</CustomButton>}
                    <CustomButton callback={onOpen}>{id > 0 ? "Renovar" : "Continuar"}</CustomButton>
                    {id > 0 && (
                      <CustomButton callback={onOpenPresence}>
                        Presença
                      </CustomButton>
                    )}
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selecione os meios de Pagamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel htmlFor="type">Tipo Pagamento</FormLabel>
              <Select2
                placeholder="Selecione o Tipo"
                value={purchase.payment_type}
                onChange={(e) => {
                  setPurchase({ ...purchase, payment_type: e.target.value });
                }}
              >
                <option value="cash">A Vista</option>
                <option value="term">Parcelado</option>
              </Select2>
            </FormControl>
            {purchase.payment_type == "term" && (
              <FormControl mb={4}>
                <FormLabel htmlFor="amount">Quantidade Parc.</FormLabel>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Quantidade Parc."
                  value={purchase.amount}
                  onChange={(e) => {
                    setPurchase({ ...purchase, amount: +e.target.value });
                  }}
                />
              </FormControl>
            )}
            <FormControl mb={4}>
              <FormLabel htmlFor="value">Valor</FormLabel>
              <Input
                id="value"
                name="value"
                type="number"
                placeholder="Valor"
                value={purchase?.value}
                onChange={(e) => {
                  setPurchase({ ...purchase, value: +e.target.value });
                }}
              />
            </FormControl>
            {id > 0 && (
              <FormControl mb={4}>
                <FormLabel htmlFor="expiration">Data de Expiração</FormLabel>
                <Input
                  type="date"
                  id="expiration"
                  name="expiration"
                  placeholder="Data de Expiração"
                  value={purchase?.expiration}
                  onChange={(e) => {
                    setPurchase({ ...purchase, expiration: e.target.value });
                  }}
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <CustomButton callback={id > 0 ? handleRenovate : handleCreate}>Confirmar</CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Modal isOpen={isOpenPresence} onClose={onClosePresence}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Presença</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel htmlFor="presence_date">Data</FormLabel>
              <Input
                type="date"
                id="presence_date"
                name="presence_date"
                placeholder="Data da Presença"
                value={presenceState?.presence_date}
                onChange={(e) => {
                  setPresenceState({ ...presenceState, presence_date: e.target.value });
                }}
              />
            </FormControl>
            
          </ModalBody>
          <ModalFooter>
            <CustomButton callback={handlePresence}>Confirmar</CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
