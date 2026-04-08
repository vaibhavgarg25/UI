import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { TooltipProvider } from "@/components/ui/tooltip"
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#8b7355',
  colorScheme: 'light dark',
}

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Interactive Calendar | Planning Made Beautiful',
  description: 'A modern, interactive wall calendar with date range selection, dynamic theming, and integrated notes.',
  generator: 'v0.app',
  openGraph: {
    title: 'Interactive Calendar',
    description: 'A modern, interactive wall calendar with date range selection, dynamic theming, and integrated notes.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${geistMono.className} font-sans antialiased`}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}