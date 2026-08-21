import type {Metadata} from 'next';
import { Space_Grotesk, Sora } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
});

export const metadata: Metadata = {
  title: 'Brands & Beyond 2025',
  description: 'Ideas today. Impact tomorrow.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${sora.variable} scroll-smooth`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
