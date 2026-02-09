'use client';

import Link from 'next/link';
import { ArrowUpRight, MessageCircle, Send as Telegram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <footer className="relative bg-slate-950 text-white pt-32 pb-12 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 blur-[180px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-20 mb-20">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/30 blur-xl rounded-full group-hover:bg-blue-500/40 transition-all duration-500" />
                <div className="relative w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-blue-600/50 overflow-hidden">
                  <img src="/logo.png" alt="BlueUnion Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight">BlueUnion</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-blue-400/60">Global Growth</span>
              </div>
            </Link>

            <h3 className="text-4xl md:text-5xl font-black leading-tight mb-8 bg-gradient-to-br from-white via-white to-blue-400 bg-clip-text text-transparent">
              连接全球资源<br />
              让增长超越边界
            </h3>

            <p className="text-lg text-slate-400 leading-relaxed max-w-md">
              我们不是中介，我们是您的全球增长架构师。通过深度的技术集成与媒体策略，构建您的数字帝国。
            </p>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            {/* Navigation */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-8">快速导航</h4>
              <ul className="space-y-4">
                <FooterLink href="/" label="首页" onClick={handleNavClick} />
                <FooterLink href="#services" label="服务" onClick={handleNavClick} />
                <FooterLink href="#cases" label="案例" onClick={handleNavClick} />
                <FooterLink href="#about" label="关于" onClick={handleNavClick} />
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-8">核心服务</h4>
              <ul className="space-y-4">
                <FooterLink href="#" label="品牌推广" onClick={handleNavClick} />
                <FooterLink href="#" label="电商增长" onClick={handleNavClick} />
                <FooterLink href="#" label="游戏发行" onClick={handleNavClick} />
                <FooterLink href="#" label="应用推广" onClick={handleNavClick} />
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-8">联系我们</h4>
              <div className="space-y-6">
                {/* WeChat QR Code */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-slate-300">微信咨询</span>
                  </div>
                  <div className="relative w-32 h-32 bg-white rounded-xl p-2 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                      二维码
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/852XXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/BlueUnionHQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
                >
                  <Telegram className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Telegram</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-sm font-medium">
              © {currentYear} BlueUnion Global. All rights reserved.
            </p>

            <div className="flex items-center gap-8">
              <Link href="#" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Line */}
        <div className="mt-10 pt-10 border-t border-white/5">
          <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
            <span className="h-px w-12 bg-slate-800" />
            <span>Powered by Innovation</span>
            <span className="h-px w-12 bg-slate-800" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label, onClick }: { href: string; label: string; onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <li>
      <Link
        href={href}
        onClick={(e) => onClick(e, href)}
        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300"
      >
        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </li>
  );
}
