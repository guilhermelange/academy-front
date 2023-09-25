import { Container, Flex, Heading, Skeleton, Spinner, Stack, Text } from "@chakra-ui/react";

export default function Loading() {
    return (
        <>
            <Container maxW="container.xl" py={20}>
                <Flex alignItems={'center'} justifyContent={'center'} flexDirection={'column'} gap={4} marginBottom={4}>
                    <Heading>Carregando...</Heading>
                    <Spinner size='xl' />
                </Flex>
            </Container>
        </>
    )
}