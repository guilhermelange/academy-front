'use client'
import { formatDateTime } from "@/utils/viewUtils";
import { Box, Container, Heading } from "@chakra-ui/react";
import {useState, useEffect} from "react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState<Date|null>(null);
  useEffect(() => {
    setCurrentTime(new Date());
    
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [])

  return (
    <main>
      <Container maxW="container.xl" py={10}>
        <Box textAlign="center" fontSize="xl">
          <Heading>Seja bem vindo!</Heading>
          <Heading>{currentTime && formatDateTime(currentTime)}</Heading>
        </Box>
      </Container>
    </main>
  )
}
