import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SafetyLayer } from '@repo/safety-layer'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MADMall | A Home Away From Home',
  description:
    'A governed cultural sanctuary for Black women navigating Graves' disease — retail, jazz, comedy, wellness, learning, community, and care.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SafetyLayer />
        {children}
      </body>
    </html>
  )
}

// Made with Bob
