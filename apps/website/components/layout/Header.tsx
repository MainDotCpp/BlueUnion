'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: '首页', href: '#' },
    { name: '关于', href: '#about' },
    { name: '方案', href: '#solutions' },
    { name: '流程', href: '#path' },
    { name: '优势', href: '#multiplier' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 py-6 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <nav className={`mx-auto max-w-7xl flex items-center justify-between px-8 py-3 rounded-full transition-all duration-700 ${isScrolled ? 'glass-slab shadow-2xl shadow-blue-500/5' : 'bg-transparent border-transparent'}`}>
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative h-10 w-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-600 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            <span className="relative z-10 text-white font-black text-xl">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">BlueUnion</span>
            <span className="text-[9px] font-bold tracking-[0.3em] text-blue-500 uppercase">Intelligence</span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-12">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[13px] font-bold text-slate-500 hover:text-blue-600 transition-colors tracking-widest"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/contact"
            className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-blue-600 transition-all"
          >
            开启咨询 <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Toggle Placeholder */}
        <button className="md:hidden p-2 text-slate-900">
          <Menu className="h-6 w-6" />
        </button>
      </nav>
    </header>
  );
}
