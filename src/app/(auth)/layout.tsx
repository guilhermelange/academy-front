import type { Metadata } from 'next'
import { Box, ColorModeScript } from '@chakra-ui/react';
import { Providers } from '../providers';
import HeaderPublic from '@/components/header-public';
import Footer from '@/components/footer';
import { AuthProvider } from '@/common/context/AuthContext';
import Loading from '@/components/loading';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Academy',
    description: 'Gerencie sua Academia',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <body>
                <AuthProvider>
                    <Providers>
                        <ColorModeScript initialColorMode={'light'} />
                        <Box minH={'100vh'} bg={'gray.50'} color={'black'}>
                            <Suspense fallback={<Loading></Loading>}>
                                <HeaderPublic></HeaderPublic>
                                {children}
                                <Footer></Footer>
                            </Suspense>
                        </Box>
                    </Providers>
                </AuthProvider>
            </body>
        </html >
    )
}
