'use client'

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
import { ChakraProvider } from '@chakra-ui/react'
import Header from './components/header/header';
import Footer from './components/footer/footer';

// export const metadata = {
//   title: 'Bimbo Shop',
//   description: 'New way to shop for IT girls',
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ChakraProvider>
        <body className={inter.className}>
          <div className='mainContainer'>
            <Header />
            <div className='mainContent'>
              {children}
            </div>
            <Footer />
          </div>
        </body>
      </ChakraProvider>
    </html>
  )
}
