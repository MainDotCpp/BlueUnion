'use client';

import Link from 'next/link';
import { Mail, MessageCircle, MapPin, Globe, ChevronRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-white pt-32 pb-16 overflow-hidden border-t border-slate-50">
      <div className="container mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24">
          {/* Brand Vision */}
          <div className="lg:col-span-5">
            <div className="flex items-center space-x-3 mb-10">
              <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl rotate-12">B</div>
              <span className="text-3xl font-black tracking-tighter">BlueUnion</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-8">
              连接全球资源 <br /> 让增长超越边界。
            </h3>
            <p className="text-xl text-slate-400 font-light leading-relaxed max-w-md">
              我们不是中介，我们是您的全球增长架构师。通过深度的技术集成与媒体策略，构建您的数字帝国。
            </p>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-8">枢纽导航</h4>
              <ul className="space-y-4">
                <FooterLink href="#" label="首页" />
                <FooterLink href="#about" label="智慧数据" />
                <FooterLink href="#solutions" label="全方位方案" />
                <FooterLink href="#path" label="增长轨道" />
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-8">联系我们</h4>
              <ul className="space-y-6">
                <li className="text-slate-600 font-medium break-all">contact@blueunion.global</li>
                <li className="text-slate-600 font-medium">WeChat: BlueUnion_HQ</li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-8">全球足迹</h4>
              <p className="text-slate-500 font-medium leading-relaxed">
                中国 · 上海浦东 <br />
                全球数字营销中心
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-400 text-sm font-bold tracking-wider">
            © {new Date().getFullYear()} BLUEUNION GLOBAL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-10">
            <Link href="#" className="text-slate-400 hover:text-blue-600 text-sm font-bold">PRIVACY</Link>
            <Link href="#" className="text-slate-400 hover:text-blue-600 text-sm font-bold">TERMS</Link>
          </div>
        </div>
      </div>

      {/* Decorative Orb */}
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-50 blur-[100px] rounded-full opacity-50" />
    </footer>
  );
}

function FooterLink({ href, label }: { href: string, label: string }) {
  return (
    <li>
      <Link href={href} className="group flex items-center text-slate-500 hover:text-blue-600 transition-colors text-lg font-medium">
        <ChevronRight className="h-4 w-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
        {label}
      </Link>
    </li>
  );
}
