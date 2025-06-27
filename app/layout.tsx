import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Providers } from '@/components/providers'
import { Navbar } from '@/components/Navbar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://share-to-mint.vercel.app'),
  title: 'Monad Farcaster MiniApp Template',
  description: 'A template for building mini-apps on Farcaster and Monad',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} pt-8`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
