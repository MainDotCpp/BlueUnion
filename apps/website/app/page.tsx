'use client';

import React, { useEffect, useRef } from 'react';
import {
  Shield,
  Layers,
  LineChart,
  Globe,
  ArrowUpRight,
  ChevronRight,
  Zap,
  Activity,
  Compass,
  Cpu,
  Target,
  BarChart4,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Reveal
      const tl = gsap.timeline();
      tl.from('.hero-heading span', {
        y: 120,
        skewY: 7,
        stagger: 0.1,
        duration: 1.5,
        ease: 'power4.out'
      })
      .from('.hero-meta', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out'
      }, '-=1');

      // 2. Horizontal Scroll Section
      if (horizontalRef.current) {
        const sections = gsap.utils.toArray('.h-section');
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: horizontalRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: () => `+=${horizontalRef.current?.offsetWidth || 2000}`
          }
        });
      }

      // 3. Reveal elements on scroll
      gsap.utils.toArray('.reveal-text').forEach((elem: any) => {
        gsap.from(elem, {
          scrollTrigger: {
            trigger: elem,
            start: 'top 90%',
          },
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out'
        });
      });

      // 4. Parallax Image effects
      gsap.to('.parallax-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.parallax-container',
          scrub: true
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white text-[#0a0a0a] overflow-x-hidden">

      {/* --- HERO: ATMOSPHERIC & KINETIC --- */}
      <section className="relative min-h-[90dvh] flex flex-col justify-center px-6 md:px-12 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-50/50 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[100px] rounded-full" />

          {/* Refined Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
               style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="hero-meta mb-16">
            <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full glass border border-slate-200/50 shadow-xl shadow-blue-500/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-800">Growth Architecture v2.0</span>
            </div>
          </div>

          <div className="max-w-[95vw]">
            <h1 className="hero-heading flex flex-col font-black tracking-tighter leading-[1.2] md:leading-[1.1] mb-12 md:mb-20">
              <div className="overflow-hidden py-2">
                <span className="block text-[4vw] md:text-[3vw] italic font-extralight text-slate-400 tracking-[0.3em] uppercase mb-2 md:mb-4">
                  Redefining
                </span>
              </div>
              <div className="overflow-hidden py-2 md:py-4">
                <span className="block text-[13vw] md:text-[8vw] lg:text-[7.5vw]">
                  全球资源
                </span>
              </div>
              <div className="overflow-hidden py-2 md:py-4">
                <span className="block text-[15vw] md:text-[10vw] lg:text-[9.5vw] text-blue-600">
                  聚合增长
                </span>
              </div>
            </h1>
          </div>

          <div className="hero-meta grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <p className="text-xl md:text-3xl font-medium leading-tight text-slate-600 max-w-2xl text-balance">
                蓝聚出海（BlueUnion）专注于全球数字营销与深度增长。
                <span className="text-slate-400">我们构建的不仅是流量，更是驱动业务跨越国界的生命力体系。</span>
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col md:items-end gap-10">
              <Link href="/contact" className="group relative px-14 py-7 bg-[#0a0a0a] text-white rounded-full font-bold text-xl overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-blue-900/20">
                <span className="relative z-10 flex items-center">
                  开启增长架构咨询
                  <ArrowUpRight className="ml-3 h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                </span>
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
              </Link>

              <div className="flex items-center space-x-10 md:space-x-12 divide-x divide-slate-200">
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-black tabular-nums">7B+</span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-1">Devices Reach</span>
                </div>
                <div className="flex flex-col pl-10 md:pl-12">
                  <span className="text-3xl md:text-4xl font-black tabular-nums">200+</span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-1">Regions Covered</span>
                </div>
                <div className="flex flex-col pl-10 md:pl-12">
                  <span className="text-3xl md:text-4xl font-black tabular-nums">5Y+</span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-1">Avg. Expertise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION: BENTO GRID REFINEMENT --- */}
      <section className="py-24 md:py-48 bg-white relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="reveal-text mb-20 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-10 md:gap-16">
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[1] md:leading-[0.95] py-2 md:py-4">
              账户能力 <br />
              <span className="text-slate-200 font-thin italic">Growth Space.</span>
            </h2>
            <div className="max-w-sm">
              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-8">
                蓝聚出海不仅提供投放，更提供成熟的媒体账户整合与管理能力。
              </p>
              <div className="h-1 w-20 bg-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
              <div className="md:col-span-2 group relative p-10 md:p-16 bg-slate-50 rounded-[3rem] md:rounded-[4rem] border border-slate-100 hover:bg-white hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] transition-all duration-1000 overflow-hidden flex flex-col justify-between min-h-[400px] md:min-h-[500px]">
                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000">
                  <img src="https://images.unsplash.com/photo-1551288049-bbda38a594a0?q=80&w=2070&auto=format&fit=crop" alt="Analytics" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-blue-600 flex items-center justify-center text-white mb-8 md:mb-12 group-hover:rotate-[10deg] transition-transform duration-700 shadow-xl shadow-blue-500/20">
                    <Shield className="h-8 w-8 md:h-10 md:w-10" />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 tracking-tight">稳定的媒体账户支持</h3>
                  <p className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-2xl font-medium">
                    深耕全球媒体生态，提供安全、高权重的官方代理资源，确保您的投放结构具备长效生命力。
                  </p>
                </div>
              <div className="relative z-10 flex flex-wrap gap-3 mt-12">
                {['Meta Business', 'Google Ads', 'TikTok Forge', 'KWAI Elite'].map(tag => (
                  <span key={tag} className="px-4 py-2 rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">{tag}</span>
                ))}
              </div>
              <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-50/50 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
            </div>

              <div className="p-10 md:p-16 bg-[#0a0a0a] text-white rounded-[3rem] md:rounded-[4rem] flex flex-col justify-between group relative overflow-hidden">
                <div className="relative z-10">
                  <Layers className="h-10 w-10 md:h-14 md:w-14 text-blue-500 mb-8 md:mb-12" />
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 leading-tight">结构化规划 <br/><span className="text-blue-500">Risk Mitigation.</span></h3>
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    定制化多层级账户策略，科学分配流量风险。
                  </p>
                </div>

                <Link href="#" className="relative z-10 h-16 w-16 md:h-20 md:w-20 rounded-full border border-slate-800 flex items-center justify-center group-hover:bg-white group-hover:border-white group-hover:text-black transition-all duration-700 mt-10">
                  <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
                </Link>

                <div className="absolute top-0 right-0 p-8">
                  <span className="text-6xl md:text-8xl font-black text-white/5">01</span>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* --- HORIZONTAL SCROLL: REFINED --- */}
      <section ref={horizontalRef} className="relative overflow-hidden bg-[#0a0a0a] text-white">
        <div className="flex h-screen w-[300vw]">
          {/* Slide 1 */}
          <div className="h-section w-screen h-full flex items-center justify-center px-6 md:px-32 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-32 items-center w-full max-w-7xl">
              <div>
                <span className="text-blue-500 font-black tracking-[0.4em] uppercase text-[10px] mb-8 md:mb-10 block">System 01 / Scaling Model</span>
                <h2 className="text-5xl md:text-[8vw] lg:text-[7vw] font-black tracking-tighter leading-[1.1] mb-8 md:mb-12 py-1 md:py-2">增长模型</h2>
                <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-xl">
                  我们通过精细化运营与扩量逻辑，协助业务在全球不同市场快速落地。
                </p>
              </div>
              <div className="relative aspect-[4/5] bg-slate-900/50 rounded-[4rem] overflow-hidden border border-slate-800 flex flex-col group">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" alt="Strategy" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-[3s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="relative z-10 p-12 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-12">
                    <div className="h-12 w-12 rounded-full border border-slate-700 glass flex items-center justify-center">
                      <Zap className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black">+240%</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Efficiency Lift</div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-px w-full bg-gradient-to-r from-blue-500/50 to-transparent" />
                    ))}
                    <div className="h-32 w-full bg-blue-600/10 rounded-3xl border border-blue-500/20 relative overflow-hidden backdrop-blur-md">
                      <div className="absolute inset-0 bg-blue-600/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="h-section w-screen h-full flex items-center justify-center px-6 md:px-32 bg-blue-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_0)] bg-[length:40px_40px]" />
            <div className="max-w-6xl text-center relative z-10">
              <span className="text-white/40 font-black tracking-[0.4em] uppercase text-[10px] mb-10 md:mb-12 block">System 02 / Technical Edge</span>
              <h2 className="text-5xl md:text-[10vw] lg:text-[9vw] font-black tracking-tighter leading-[1.1] mb-12 md:mb-16 py-2 md:py-4">技术驱动 <br /> <span className="text-slate-900">深度洞察</span></h2>
              <div className="flex flex-wrap justify-center gap-10 md:gap-20">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6">
                    <Cpu className="h-10 w-10 text-white" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-white/60">Automated Intelligence</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-white/60">Cross-Platform Sync</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="h-section w-screen h-full flex items-center justify-center px-6 md:px-32 relative">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center w-full max-w-7xl">
              <div className="lg:col-span-7 order-2 lg:order-1">
                <div className="relative aspect-video glass dark-glass rounded-[3rem] overflow-hidden border border-white/5 group">
                  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Global Network" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-125 transition-transform duration-[5s]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent" />
                  <div className="relative z-10 p-16 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="h-2 w-32 bg-blue-600 rounded-full" />
                      <div className="h-2 w-48 bg-slate-800 rounded-full" />
                    </div>
                    <Globe className="h-48 w-48 text-blue-600/20 absolute -right-12 -bottom-12" />
                    <div className="relative z-10">
                      <div className="text-6xl font-black mb-4 tracking-tighter">GLOBAL</div>
                      <div className="text-sm font-medium text-slate-500 tracking-widest uppercase">Reach without limits</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 order-1 lg:order-2">
                <span className="text-blue-500 font-black tracking-[0.4em] uppercase text-[10px] mb-8 md:mb-10 block">System 03 / Global Resource</span>
                <h2 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[1.1] mb-8 md:mb-12 py-2 md:py-4">全球足迹</h2>
                <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
                  覆盖主流媒体平台与新兴流量枢纽。我们的资源池帮助您打破地域限制。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GROWTH PROCESS: THE BLUEPRINT --- */}
      <section className="py-24 md:py-48 bg-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="reveal-text mb-20 md:mb-32">
            <span className="text-blue-600 font-black tracking-[0.4em] uppercase text-[10px] mb-8 block">Methodology / 04</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-12">
              出海增长 <br />
              <span className="text-slate-200 italic font-thin">Eight-Step Blueprint.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl">
              我们拒绝“水土不服”。通过严谨的八步闭环体系，确保您的每一分投入都能转化为实实在在的全球份额。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 md:gap-y-20">
            <ProcessStep num="01" title="需求诊断" desc="深挖产品基因，定位核心出海目标与痛点。" />
            <ProcessStep num="02" title="竞品分析" desc="深度解构海外竞品策略，寻找突围蓝海。" />
            <ProcessStep num="03" title="方案定制" desc="针对不同市场，制定差异化增长路径。" />
            <ProcessStep num="04" title="素材创作" desc="独家本地化内容生产，提升品牌共鸣。" />
            <ProcessStep num="05" title="精准投放" desc="多维度标签定向，触达 70亿+ 独立设备。" />
            <ProcessStep num="06" title="实时监测" desc="全天候数据追踪，确保获客成本可控。" />
            <ProcessStep num="07" title="模型调优" desc="动态优化投放算法，实现资产持续增值。" />
            <ProcessStep num="08" title="规模扩量" desc="多渠道协同引流，开启全球化爆发增长。" />
          </div>
        </div>
      </section>

      {/* --- EXPERTISE MATRIX: LUXURY REFINEMENT --- */}
      <section className="py-32 md:py-64 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="reveal-text grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 mb-20 md:mb-40">
            <div className="lg:col-span-8">
              <h2 className="text-5xl md:text-[9vw] lg:text-[8vw] font-black tracking-tighter leading-[1] uppercase py-2 md:py-4">
                核心 <span className="text-blue-600">服务</span> <br /> 矩阵
              </h2>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end">
              <p className="text-xl md:text-2xl text-slate-500 font-medium italic border-l-4 md:border-l-8 border-blue-600 pl-6 md:pl-10">
                “我们不是在管理广告，我们是在架构您的数字资产。”
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-24 md:gap-y-32">
            <ExpertiseItem
              num="01"
              title="品牌全球化推广"
              desc="构建海外品牌认知，打造长期品牌资产。通过内容营销、广告投放与多渠道曝光，提升品牌影响力。"
            />
            <ExpertiseItem
              num="02"
              title="跨境电商增长"
              desc="从冷启动到规模化增长，覆盖广告投放、转化优化、再营销与用户留存全流程服务。"
            />
            <ExpertiseItem
              num="03"
              title="游戏全球发行"
              desc="针对游戏生命周期制定推广策略，优化获客成本，提高留存与付费转化表现。"
            />
            <ExpertiseItem
              num="04"
              title="应用与工具推广"
              desc="精准触达目标用户群体，实现下载增长与商业转化的双重提升。"
            />
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION: CINEMATIC --- */}
      <section className="parallax-container relative h-screen flex items-center justify-center overflow-hidden">
        <div className="parallax-bg absolute inset-0 z-0 scale-110">
          <div className="absolute inset-0 bg-[#0a0a0a] opacity-80 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center">
          <div className="reveal-text max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-[10vw] lg:text-[9vw] font-black text-white tracking-tighter leading-[1.1] mb-12 md:mb-20 uppercase py-4 md:py-6">
              资源为基础 <br />
              <span className="text-blue-600 block">增长为结果</span>
            </h2>
            <Link href="/contact" className="inline-flex items-center gap-4 md:gap-8 px-10 py-6 md:px-20 md:py-10 bg-white text-[#0a0a0a] rounded-full text-xl md:text-3xl font-black hover:bg-blue-600 hover:text-white transition-all duration-700 hover:scale-105 active:scale-95 group shadow-[0_30px_100px_rgba(37,99,235,0.3)]">
              启动增长引擎 <ArrowUpRight className="h-6 w-6 md:h-12 md:w-12 group-hover:rotate-45 transition-transform duration-700" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- REPUTATION FOOTER TAG --- */}
      <footer className="py-24 border-t border-slate-100 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 text-[10px] font-black uppercase tracking-[0.6em] text-slate-300">
          <span>BlueUnion Global Intelligence</span>
          <div className="flex gap-16">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Shanghai</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Singapore</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">London</span>
          </div>
          <span>Est. 2024</span>
        </div>
      </footer>

    </div>
  );
}

function ProcessStep({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="reveal-text group relative">
      <div className="text-[12vw] md:text-[6vw] font-black text-slate-50 absolute -top-10 -left-4 -z-0 group-hover:text-blue-50 transition-colors duration-700">
        {num}
      </div>
      <div className="relative z-10 pt-4">
        <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-blue-600 transition-colors duration-500">{title}</h3>
        <p className="text-slate-500 font-medium leading-relaxed border-l-2 border-slate-100 pl-6 group-hover:border-blue-600 transition-colors duration-500">
          {desc}
        </p>
      </div>
    </div>
  );
}

function ExpertiseItem({ num, title, desc }: { num: string, title: string, desc: string }) {
  const images = {
    "01": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    "02": "https://images.unsplash.com/photo-1551288049-bbda38a594a0?q=80&w=2070&auto=format&fit=crop",
    "03": "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    "04": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
  };

  return (
    <div className="reveal-text group border-b border-slate-100 pb-16 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-32 h-32 opacity-0 group-hover:opacity-20 transition-all duration-700 translate-x-10 group-hover:translate-x-0 -z-0">
        <img src={images[num as keyof typeof images]} alt={title} className="w-full h-full object-cover rounded-full" />
      </div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <span className="text-sm font-black text-blue-600 tracking-widest">{num}</span>
          <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <h3 className="text-4xl font-bold mb-6 group-hover:translate-x-4 transition-transform duration-700">{title}</h3>
        <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-lg">
          {desc}
        </p>
      </div>
    </div>
  );
}
