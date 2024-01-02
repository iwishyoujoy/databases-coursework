'use client'

import './globals.css'

import { ChakraProvider } from '@chakra-ui/react'
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Inter } from 'next/font/google'
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from './redux/storeProvider';

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Bimbo Shop',
//   description: 'New way to shop for IT girls',
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ChakraProvider>
      <Router>
        <StoreProvider>
          <body className={inter.className}>
            <div className='mainContainer'>
              <Header />
              <div className='mainContent'>
                {children}
              </div>
              <Footer />
            </div>
          </body>
        </StoreProvider>
      </Router>
      </ChakraProvider>
    </html>
  )
}
