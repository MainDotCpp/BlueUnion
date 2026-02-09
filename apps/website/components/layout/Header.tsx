'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: '首页', href: '/' },
    { name: '关于我们', href: '#about' },
    { name: '服务领域', href: '#solutions' },
    { name: '为什么选择我们', href: '#multiplier' },
  ];

  const handleMouseEnter = (index: number) => {
    const item = itemsRef.current[index];
    if (item && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = item;
      gsap.to(indicatorRef.current, {
        left: offsetLeft,
        width: offsetWidth,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  };

  const handleMouseLeave = () => {
    if (indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? 'py-4' : 'py-8'
      }`}
    >
      <nav
        ref={navRef}
        className={`mx-auto max-w-5xl flex items-center justify-between px-6 py-2 transition-all duration-500 ${
          isScrolled
            ? 'nav-capsule rounded-full mx-4 md:mx-auto border-white/20'
            : 'bg-transparent'
        }`}
      >
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center space-x-3 group relative z-50">
          <div className="relative h-9 w-9 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-600 rounded-lg rotate-45 group-hover:rotate-[135deg] transition-transform duration-700 ease-expo" />
            <span className="relative z-10 text-white font-bold text-lg">B</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-black tracking-tight leading-none transition-colors duration-500 ${
              isScrolled ? 'text-slate-900' : 'text-slate-900 md:text-white'
            }`}>
              BlueUnion
            </span>
            <span className="text-[8px] font-bold tracking-[0.4em] text-blue-500 uppercase">Intelligence</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div
          className="hidden md:flex items-center bg-slate-100/50 dark:bg-slate-800/20 rounded-full px-2 py-1 relative"
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={indicatorRef}
            className="indicator-pill opacity-0"
          />
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              ref={(el) => { itemsRef.current[index] = el; }}
              onMouseEnter={() => handleMouseEnter(index)}
              className={`nav-link-hover text-[12px] font-bold tracking-wider uppercase transition-colors duration-300 ${
                isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-200 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/contact"
            className={`group relative flex items-center gap-2 px-6 py-2 rounded-full text-[12px] font-bold transition-all duration-500 overflow-hidden ${
              isScrolled
                ? 'bg-slate-900 text-white hover:bg-blue-600'
                : 'bg-white text-slate-900 hover:bg-blue-50'
            }`}
          >
            <span className="relative z-10">开启咨询</span>
            <ArrowRight className="h-3.5 w-3.5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden p-2 relative z-50 transition-colors ${
            isScrolled ? 'text-slate-900' : 'text-white'
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-slate-900 z-40 transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="h-full flex flex-col justify-center px-12 space-y-8">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-4xl font-black text-white/40 hover:text-white transition-colors duration-300 tracking-tighter"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="text-blue-500 mr-4 text-xl">0{index + 1}</span>
              {item.name}
            </Link>
          ))}
          <div className="pt-8 border-t border-white/10 flex flex-col space-y-6">
            <Link
              href="/contact"
              className="inline-flex items-center gap-4 text-2xl font-black text-blue-500"
            >
              联系我们 <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Decorative background text for mobile menu */}
        <div className="absolute bottom-10 right-10 text-[15vw] font-black text-white/[0.02] leading-none pointer-events-none select-none">
          BLUE<br />UNION
        </div>
      </div>
    </header>
  );
}
