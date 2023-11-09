import Header from '@/components/header';
import '../globals.css'
import { Providers } from "../providers";
import type { Metadata } from 'next'
import Footer from '@/components/footer';
import { Box, ColorModeScript } from '@chakra-ui/react';
import { AuthProvider } from '@/common/context/AuthContext';
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
            <Box minH={'100vh'} color={'black'}>
              <Header></Header>
              <Box bg={'gray.50'} minH={'84vh'}>
                {children}
              </Box>
              <Footer></Footer>
            </Box>
          </Providers>
        </AuthProvider>
      </body>
    </html >
  )
}
