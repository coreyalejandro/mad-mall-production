import { cn } from '@repo/design-system/lib/utils';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';

/**
 * MADMall Typography — from ZMUX_MAD_MALL.html
 *
 * Space Grotesk: Primary font for headings and body (clean, modern, warm)
 * JetBrains Mono: Data labels, status pills, clinical UI elements
 * Geist Sans/Mono: Fallback system fonts from next-forge base
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['200', '500'],
});

export const fonts = cn(
  GeistSans.variable,
  GeistMono.variable,
  spaceGrotesk.variable,
  jetbrainsMono.variable,
  'touch-manipulation font-sans antialiased'
);
