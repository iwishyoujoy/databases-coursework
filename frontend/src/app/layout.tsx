'use client'

import './globals.css'

import React, { ReactNode } from 'react';

import { ChakraProvider } from '@chakra-ui/react'
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Inter } from 'next/font/google'
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from './redux/storeProvider';

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
 children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
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
