import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bellota - Admin Panel',
  description: 'Panel de administración web centralizado para Bellota',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-stone-50 text-stone-900`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
