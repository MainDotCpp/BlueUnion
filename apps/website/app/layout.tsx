'use client';

import { useEffect } from 'react';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="zh" className="scroll-smooth">
      <body className="antialiased selection:bg-blue-600 selection:text-white">
        <div className="grain-overlay" />
        <div className="flex min-h-screen flex-col relative z-10">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
