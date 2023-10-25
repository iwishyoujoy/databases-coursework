'use client'

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
import { ChakraProvider } from '@chakra-ui/react'
import Header from './components/header/header'

// export const metadata = {
//   title: 'Bimbo Shop',
//   description: 'New way to shop for IT girls',
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ChakraProvider>
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </ChakraProvider>
    </html>
  )
}
