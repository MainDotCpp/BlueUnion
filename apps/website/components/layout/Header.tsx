'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: '首页', href: '/' },
    { name: '服务', href: '#services' },
    { name: '案例', href: '#cases' },
    { name: '关于', href: '#about' },
    { name: '商店', href: '/shop' },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-blue-900/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 md:px-12">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? 'h-16 md:h-18' : 'h-20 md:h-24'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="relative group z-50">
            <div className="flex items-center gap-2.5">
              {/* Animated Logo Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 blur-lg rounded-full group-hover:bg-blue-500/30 transition-all duration-500" />
                <div
                  className={`relative rounded-xl bg-white flex items-center justify-center shadow-lg shadow-blue-600/50 group-hover:shadow-blue-500/70 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 overflow-hidden ${
                    isScrolled
                      ? 'w-8 h-8 md:w-9 md:h-9'
                      : 'w-10 h-10 md:w-11 md:h-11'
                  }`}
                >
                  <img
                    src="/logo.png"
                    alt="BlueUnion Logo"
                    className={`transition-all duration-500 ${
                      isScrolled ? 'w-full h-full' : 'w-full h-full'
                    }`}
                  />
                </div>
              </div>

              {/* Logo Text */}
              <div className="flex flex-col">
                <span
                  className={`font-black text-white tracking-tight group-hover:text-blue-400 transition-all duration-300 ${
                    isScrolled ? 'text-base md:text-lg' : 'text-xl md:text-2xl'
                  }`}
                >
                  蓝聚出海
                </span>
                <span
                  className={`font-bold uppercase tracking-[0.3em] text-blue-400/60 transition-all duration-300 ${
                    isScrolled
                      ? 'text-[7px] md:text-[8px]'
                      : 'text-[8px] md:text-[9px]'
                  }`}
                >
                  BlueUnion HK
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`group relative text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white transition-all duration-300 ${
                  isScrolled ? 'px-4 py-2' : 'px-5 py-2.5'
                }`}
              >
                <span className="relative z-10">{item.name}</span>

                {/* Hover Background */}
                <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Animated Border */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 group-hover:w-3/4 transition-all duration-500" />
              </Link>
            ))}

            {/* CTA Button */}
            <Link
              href="/contact"
              className={`group relative ml-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-full overflow-hidden shadow-lg shadow-blue-600/50 hover:shadow-blue-500/70 transition-all duration-500 hover:scale-105 ${
                isScrolled ? 'px-6 py-2' : 'px-7 py-2.5'
              }`}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                联系我们
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>

              {/* Animated Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden relative z-50 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300 ${
              isScrolled ? 'w-10 h-10' : 'w-11 h-11'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X
                className={`text-white transition-all duration-300 ${isScrolled ? 'w-5 h-5' : 'w-5.5 h-5.5'}`}
              />
            ) : (
              <Menu
                className={`text-white transition-all duration-300 ${isScrolled ? 'w-5 h-5' : 'w-5.5 h-5.5'}`}
              />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-0 bg-slate-950/95 backdrop-blur-2xl transition-all duration-500 ${
            isMobileMenuOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
          style={{ top: '0' }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="group relative text-4xl font-black text-white/80 hover:text-white transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isMobileMenuOpen
                    ? 'slideInUp 0.6s ease-out forwards'
                    : 'none',
                }}
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 group-hover:w-full transition-all duration-500" />
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-8 px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-black uppercase tracking-wider rounded-full shadow-2xl shadow-blue-600/50 hover:shadow-blue-500/70 transition-all duration-500 hover:scale-105"
            >
              联系我们
            </Link>
          </div>

          {/* Decorative Background */}
          <div className="absolute bottom-10 right-10 text-[15vw] font-black text-white/[0.02] leading-none pointer-events-none select-none">
            蓝聚
            <br />
            国际
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}
