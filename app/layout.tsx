import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from '@/components/ui/sonner'
import { CartProvider } from '@/hooks/use-cart'
import { SITE_URL } from '@/constants/client'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Facelo', template: '%s | Facelo' },
  description: 'Shop products recommended by creators you trust.',
  metadataBase: new URL(SITE_URL),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="bg-background text-foreground min-h-full">
        <NextTopLoader color="#7C3AED" height={3} showSpinner={false} shadow="0 0 8px #7C3AED" />
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
