'use client'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StoreProvider } from './redux/storeProvider';

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
      </Router>,
      </ChakraProvider>
    </html>
  )
}
