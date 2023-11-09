"use client";
import Loading from "@/components/loading";
import { formatDateTime } from "@/utils/viewUtils";
import { Box, Container, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentTime(new Date());

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    setLoading(false);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <main>
      {loading && <Loading></Loading>}
      {!loading && (
        <Container maxW="container.xl" py={10}>
          <Box textAlign="center" fontSize="xl">
            <Heading>Seja bem vindo!</Heading>
            <Heading>{currentTime && formatDateTime(currentTime)}</Heading>
          </Box>
        </Container>
      )}
    </main>
  );
}
