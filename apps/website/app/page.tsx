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
  const magneticBtnRef = useRef<HTMLAnchorElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Reveal Animation with Enhanced Timing
      const tl = gsap.timeline();
      tl.from('.hero-heading span', {
        y: 120,
        skewY: 7,
        stagger: 0.1,
        duration: 1.5,
        ease: 'power4.out'
      })
      .from('.hero-meta-item', {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out'
      }, '-=1');

      // 2. Statistical Counters with Bounce Effect
      const stats = gsap.utils.toArray('.stat-number');
      stats.forEach((stat: any) => {
        const endValue = parseInt(stat.innerText);
        gsap.from(stat, {
          textContent: 0,
          duration: 2.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: stat,
            start: 'top 95%',
          },
          snap: { textContent: 1 },
          onUpdate: function() {
            stat.innerHTML = Math.ceil(stat.textContent) + (stat.dataset.suffix || '');
          }
        });

        // Add scale bounce effect
        gsap.from(stat, {
          scale: 0.5,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: stat,
            start: 'top 95%',
          }
        });
      });

      // 3. Magnetic Button with Enhanced Interaction
      const mBtn = magneticBtnRef.current;
      if (mBtn) {
        const mText = mBtn.querySelector('span');
        mBtn.addEventListener('mousemove', (e) => {
          const rect = mBtn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(mBtn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.6,
            ease: 'power2.out'
          });
          if (mText) {
            gsap.to(mText, {
              x: x * 0.15,
              y: y * 0.15,
              duration: 0.6,
              ease: 'power2.out'
            });
          }
        });

        mBtn.addEventListener('mouseleave', () => {
          gsap.to([mBtn, mText], {
            x: 0,
            y: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
          });
        });
      }

      // 4. Custom Cursor Trail Effect
      const handleMouseMove = (e: MouseEvent) => {
        if (spotlightRef.current) {
          gsap.to(spotlightRef.current, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.8,
            ease: 'power2.out'
          });
        }

        if (cursorDotRef.current) {
          gsap.to(cursorDotRef.current, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: 'power2.out'
          });
        }
      };
      window.addEventListener('mousemove', handleMouseMove);

      // 5. Background Video & Elements Parallax
      gsap.to('.hero-video', {
        scale: 1.2,
        scrollTrigger: {
          trigger: '.hero-video',
          start: 'top top',
          scrub: true
        }
      });

      gsap.to('.parallax-orb', {
        yPercent: -50,
        xPercent: 20,
        scrollTrigger: {
          trigger: containerRef.current,
          scrub: 1.5
        }
      });

      // 6. Horizontal Scroll Section with Progress Indicator
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
            end: () => `+=${horizontalRef.current?.offsetWidth || 2000}`,
            onUpdate: (self) => {
              // Update progress indicator if exists
              const progress = document.querySelector('.scroll-progress');
              if (progress) {
                gsap.to(progress, { scaleX: self.progress, duration: 0.1 });
              }
            }
          }
        });
      }

      // 7. Grid & Content Reveal with Stagger
      gsap.utils.toArray('.reveal-text, .bento-card').forEach((elem: any) => {
        gsap.from(elem, {
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
          },
          y: 80,
          opacity: 0,
          rotationX: -10,
          duration: 1.5,
          ease: 'expo.out'
        });
      });

      // 8. Bento Card 3D Tilt Effect
      const bentoCards = gsap.utils.toArray('.bento-card');
      bentoCards.forEach((card: any) => {
        card.addEventListener('mousemove', (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: 1000
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)'
          });
        });
      });

      // 9. Process Step Icon Animation
      gsap.utils.toArray('.process-step-icon').forEach((icon: any) => {
        gsap.from(icon, {
          scrollTrigger: {
            trigger: icon,
            start: 'top 90%',
          },
          rotation: -180,
          scale: 0,
          duration: 1.2,
          ease: 'back.out(1.7)'
        });
      });

      // 10. Image Parallax Effects
      gsap.utils.toArray('.parallax-image').forEach((img: any) => {
        gsap.to(img, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      });

      // 11. Floating Animation for Decorative Elements
      gsap.to('.floating-element', {
        y: -30,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.5
      });

      // 12. Text Reveal with Split Effect
      gsap.utils.toArray('.split-text').forEach((text: any) => {
        const chars = text.textContent.split('');
        text.innerHTML = chars.map((char: string) =>
          `<span style="display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        gsap.from(text.children, {
          scrollTrigger: {
            trigger: text,
            start: 'top 85%',
          },
          opacity: 0,
          y: 50,
          rotationX: -90,
          stagger: 0.02,
          duration: 0.8,
          ease: 'back.out(1.7)'
        });
      });

      // 13. Expertise Item Slide-In Animation
      gsap.utils.toArray('.expertise-item').forEach((item: any, index: number) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
          },
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out'
        });
      });

      // 14. Tag Cloud Scatter Animation
      gsap.utils.toArray('.tag-item').forEach((tag: any) => {
        gsap.from(tag, {
          scrollTrigger: {
            trigger: tag,
            start: 'top 95%',
          },
          scale: 0,
          rotation: 360,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: 0.1
        });
      });

      // 15. Scroll Progress Line
      gsap.to('.progress-line', {
        scaleX: 1,
        transformOrigin: 'left',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5
        }
      });

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white text-[#0a0a0a] overflow-x-hidden">

      {/* --- HERO: CINEMATIC VIDEO ARCHITECTURE --- */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 overflow-hidden bg-[#0a0a0a]">
        {/* Spotlight Overlay */}
        <div ref={spotlightRef} className="fixed top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-10 -translate-x-1/2 -translate-y-1/2" />

        {/* Video Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hero-video absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
            style={{ filter: 'grayscale(0.3) brightness(0.6)' }}
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Advanced Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-transparent to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0a0a0a_100%)] opacity-70" />

          {/* Decorative Parallax Orbs */}
          <div className="parallax-orb absolute top-[20%] right-[10%] w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full" />
          <div className="parallax-orb absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-blue-900/10 blur-[150px] rounded-full" />
        </div>

        <div className="container mx-auto relative z-20 pt-20 pb-16 md:pb-24 lg:pb-32">
          <div className="hero-meta-item mb-10 md:mb-16">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-white/70">Intelligence Systems / 01</span>
            </div>
          </div>

          <div className="max-w-full">
            <h1 className="hero-heading flex flex-col font-black tracking-tighter leading-[0.95] mb-12 md:mb-20 text-white">
              <div className="overflow-hidden py-1">
                <span className="block text-2xl md:text-[3vw] italic font-light text-blue-400/80 tracking-[0.2em] uppercase mb-2">
                  Architecting
                </span>
              </div>
              <div className="overflow-hidden py-1">
                <span className="block text-[14vw] md:text-[9vw] lg:text-[8.5vw] leading-none uppercase">
                  全球资源
                </span>
              </div>
              <div className="overflow-hidden py-1">
                <span className="block text-[16vw] md:text-[11vw] lg:text-[10.5vw] text-blue-500 leading-none mix-blend-lighten uppercase">
                  聚合增长
                </span>
              </div>
            </h1>
          </div>

          <div className="hero-meta-item grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-end">
            <div className="lg:col-span-7">
              <p className="text-lg md:text-3xl font-medium leading-tight text-white/80 max-w-2xl text-balance">
                蓝聚出海（BlueUnion）专注于全球数字营销与深度增长。
                <span className="text-white/30 block md:inline mt-2 md:mt-0">我们构建的不仅是流量，更是驱动业务跨越国界的生命力体系。</span>
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col items-start md:items-end gap-10">
              <Link
                ref={magneticBtnRef}
                href="/contact"
                className="group relative w-full md:w-auto px-10 py-6 md:px-14 md:py-8 bg-white text-[#0a0a0a] rounded-full font-bold text-lg md:text-xl overflow-hidden transition-all duration-500 shadow-[0_20px_50px_rgba(59,130,246,0.3)] text-center"
              >
                <span className="relative z-10 flex items-center justify-center">
                  开启增长架构咨询
                  <ArrowUpRight className="ml-3 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                </span>
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
              </Link>

              <div className="flex items-center space-x-8 md:space-x-12 divide-x divide-white/10">
                <div className="flex flex-col">
                  <span className="stat-number text-2xl md:text-4xl font-black tabular-nums text-white" data-suffix="B+">7</span>
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/40 font-bold mt-1 text-nowrap">Global Reach</span>
                </div>
                <div className="flex flex-col pl-8 md:pl-12">
                  <span className="stat-number text-2xl md:text-4xl font-black tabular-nums text-white" data-suffix="+">200</span>
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/40 font-bold mt-1 text-nowrap">Regions</span>
                </div>
                <div className="flex flex-col pl-8 md:pl-12">
                  <span className="stat-number text-2xl md:text-4xl font-black tabular-nums text-white" data-suffix="Y+">5</span>
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/40 font-bold mt-1 text-nowrap">Expertise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION: BENTO GRID REFINEMENT --- */}
      <section id="services" className="py-24 md:py-48 bg-white relative">
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
              <div className="bento-card md:col-span-2 group relative p-10 md:p-16 bg-slate-50 rounded-[3rem] md:rounded-[4rem] border border-slate-100 hover:bg-white hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] transition-all duration-1000 overflow-hidden flex flex-col justify-between min-h-[400px] md:min-h-[500px]">
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

              <div className="bento-card p-10 md:p-16 bg-[#0a0a0a] text-white rounded-[3rem] md:rounded-[4rem] flex flex-col justify-between group relative overflow-hidden">
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

      {/* --- GLOBAL PARTNERS: REFINED SHOWCASE --- */}
      <section id="platforms" className="relative py-32 md:py-48 bg-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="reveal-text max-w-4xl mb-24 md:mb-32">
            <div className="inline-block mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Official Partners</span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.1] text-slate-900 mb-8">
              全球顶级<br />营销平台
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 font-light leading-relaxed max-w-2xl">
              与全球领先的广告平台深度合作，为您的业务提供最优质的流量入口。
            </p>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

            {/* Google */}
            <div className="bento-card group relative bg-white border border-slate-200/60 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] hover:border-slate-300">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-12 md:p-14 flex flex-col items-start min-h-[420px]">
                <div className="mb-auto">
                  <div className="mb-8 transform group-hover:scale-105 transition-transform duration-500">
                    <img src="/google_logo.png" alt="Google" className="h-10 md:h-12 object-contain" />
                  </div>

                  <h3 className="text-sm font-medium text-slate-600 mb-3">Google Ads Platform</h3>
                  <p className="text-base text-slate-500 leading-relaxed font-light">
                    全球最大的搜索与展示广告网络，覆盖 90% 以上互联网用户。
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 w-full">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light text-slate-900">90%+</span>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">市场份额</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="bento-card group relative bg-white border border-slate-200/60 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] hover:border-slate-300">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-12 md:p-14 flex flex-col items-start min-h-[420px]">
                <div className="mb-auto">
                  <div className="mb-8 transform group-hover:scale-105 transition-transform duration-500">
                    <img src="/meta_logo.png" alt="Meta" className="h-10 md:h-12 object-contain" />
                  </div>

                  <h3 className="text-sm font-medium text-slate-600 mb-3">Meta Business Suite</h3>
                  <p className="text-base text-slate-500 leading-relaxed font-light">
                    整合 Facebook 与 Instagram，打造社交媒体营销生态闭环。
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 w-full">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light text-slate-900">3.9B+</span>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">月活用户</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TikTok */}
            <div className="bento-card group relative bg-white border border-slate-200/60 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] hover:border-slate-300">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-12 md:p-14 flex flex-col items-start min-h-[420px]">
                <div className="mb-auto">
                  <div className="mb-8 transform group-hover:scale-105 transition-transform duration-500">
                    <img src="/tiktok_logo.png" alt="TikTok" className="h-10 md:h-12 object-contain" />
                  </div>

                  <h3 className="text-sm font-medium text-slate-600 mb-3">TikTok For Business</h3>
                  <p className="text-base text-slate-500 leading-relaxed font-light">
                    短视频营销领导者，助力品牌触达年轻消费群体。
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 w-full">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light text-slate-900">1.6B+</span>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">全球用户</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Tagline */}
          <div className="reveal-text mt-24 md:mt-32 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-medium">
              Trusted by global brands
            </p>
          </div>
        </div>
      </section>

      {/* --- HORIZONTAL SCROLL: CINEMATIC LUXURY EDITION --- */}
      <section id="cases" ref={horizontalRef} className="relative overflow-hidden bg-[#0a0a0a] text-white">
        {/* Scroll Progress Indicator */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-slate-900 z-50">
          <div className="scroll-progress h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 origin-left scale-x-0" />
        </div>

        {/* Ambient Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-[20%] left-[10%] w-96 h-96 bg-blue-600/5 blur-[150px] rounded-full" />
          <div className="floating-element absolute bottom-[30%] right-[15%] w-[500px] h-[500px] bg-purple-600/5 blur-[180px] rounded-full" />
        </div>

        <div className="flex h-screen w-[300vw]">
          {/* Slide 1 - Growth Model */}
          <div className="h-section w-screen h-full flex items-center justify-center px-6 md:px-32 relative">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-center w-full max-w-7xl">
              <div className="reveal-text">
                <span className="text-blue-500 font-black tracking-[0.4em] uppercase text-[10px] mb-8 md:mb-10 block inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-blue-500" />
                  System 01 / Scaling Model
                </span>
                <h2 className="split-text text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] mb-8 md:mb-12 py-1 md:py-2 bg-gradient-to-br from-white via-white to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                  增长模型
                </h2>
                <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-xl mb-10">
                  我们通过精细化运营与扩量逻辑，协助业务在全球不同市场快速落地。
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3">
                  {['AI优化', '实时分析', '多市场'].map((tag, i) => (
                    <span key={i} className="tag-item px-5 py-2.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Enhanced Stats Card */}
              <div className="relative aspect-[4/5] bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-[4rem] overflow-hidden border border-slate-800/50 flex flex-col group backdrop-blur-xl shadow-2xl shadow-blue-900/20">
                {/* Background Image with Parallax */}
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" alt="Strategy" className="parallax-image absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-[4s] ease-out" />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                {/* Animated Corner Accents */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 blur-[100px] group-hover:blur-[80px] transition-all duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[120px]" />

                <div className="relative z-10 p-10 md:p-12 h-full flex flex-col">
                  {/* Header Stats */}
                  <div className="flex justify-between items-start mb-12 md:mb-16">
                    <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl border-2 border-slate-700/50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-950/30 transition-all duration-700 shadow-lg">
                      <Zap className="h-7 w-7 md:h-8 md:w-8 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="text-right">
                      <div className="text-5xl md:text-6xl font-black bg-gradient-to-br from-white to-blue-400 bg-clip-text text-transparent mb-2">+240%</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">Efficiency Lift</div>
                    </div>
                  </div>

                  {/* Animated Data Bars */}
                  <div className="flex-1 flex flex-col justify-end space-y-5 md:space-y-6">
                    {[
                      { width: '75%', label: 'ROI' },
                      { width: '60%', label: 'Conversion' },
                      { width: '85%', label: 'Reach' }
                    ].map((bar, i) => (
                      <div key={i} className="relative">
                        <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full relative overflow-hidden"
                            style={{ width: bar.width }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-600 uppercase tracking-wider font-bold mt-1.5 block">{bar.label}</span>
                      </div>
                    ))}

                    {/* Featured Metric Card */}
                    <div className="h-36 md:h-40 w-full bg-gradient-to-br from-blue-600/20 to-blue-900/20 rounded-3xl border border-blue-500/30 relative overflow-hidden backdrop-blur-md shadow-xl mt-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent animate-pulse" />
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-[60px]" />
                      <div className="relative p-6 h-full flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-400" />
                          <span className="text-[9px] uppercase tracking-widest text-blue-400/80 font-black">Live Performance</span>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-3xl md:text-4xl font-black text-white mb-1">7.2M</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Active Users</div>
                          </div>
                          <LineChart className="h-12 w-12 md:h-16 md:w-16 text-blue-500/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2 - Technical Edge */}
          <div className="h-section w-screen h-full flex items-center justify-center px-6 md:px-32 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 relative overflow-hidden">
            {/* Animated Patterns */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[length:40px_40px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_0%,_#1e40af_100%)] opacity-30" />

            {/* Floating Orbs */}
            <div className="floating-element absolute top-[15%] left-[10%] w-72 h-72 bg-white/5 rounded-full blur-[100px]" />
            <div className="floating-element absolute bottom-[20%] right-[12%] w-96 h-96 bg-white/5 rounded-full blur-[120px]" />

            <div className="max-w-6xl text-center relative z-10">
              <span className="text-white/50 font-black tracking-[0.4em] uppercase text-[10px] mb-10 md:mb-12 block inline-flex items-center gap-3 mx-auto">
                <span className="h-px w-12 bg-white/30" />
                System 02 / Technical Edge
                <span className="h-px w-12 bg-white/30" />
              </span>

              <h2 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[1.05] mb-16 md:mb-20 py-2 md:py-4 uppercase">
                <span className="block">技术驱动</span>
                <span className="block bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent drop-shadow-2xl">深度洞察</span>
              </h2>

              {/* Enhanced Feature Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
                {[
                  { icon: Cpu, label: 'AI Intelligence', metric: '99.9%' },
                  { icon: Target, label: 'Precision Targeting', metric: '70B+' },
                  { icon: BarChart4, label: 'Real-time Analytics', metric: '< 100ms' },
                  { icon: Compass, label: 'Smart Navigation', metric: '200+' }
                ].map((item, i) => (
                  <div key={i} className="expertise-item flex flex-col items-center group">
                    <div className="h-24 w-24 md:h-28 md:w-28 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 shadow-xl">
                      <item.icon className="h-10 w-10 md:h-12 md:w-12 text-white" />
                    </div>
                    <span className="text-2xl md:text-3xl font-black text-white mb-2">{item.metric}</span>
                    <span className="text-[10px] font-black tracking-widest uppercase text-white/60">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap justify-center gap-4">
                {['Machine Learning', 'Big Data', 'Cloud Native', 'Real-time Processing'].map((tech, i) => (
                  <span key={i} className="tag-item px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-wider hover:bg-white/20 transition-all duration-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Slide 3 - Global Reach */}
          <div className="h-section w-screen h-full flex items-center justify-center px-6 md:px-32 relative">
            {/* Dynamic Grid */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:6rem_6rem]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center w-full max-w-7xl">
              <div className="lg:col-span-7 order-2 lg:order-1">
                {/* Enhanced Globe Card */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-900/90 to-slate-950/90 rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-white/10 group backdrop-blur-xl shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Global Network" className="parallax-image absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-125 transition-transform duration-[5s]" />

                  {/* Gradient Layers */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                  {/* Animated Scan Lines */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="h-full w-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#3b82f6_2px,#3b82f6_4px)] animate-pulse" />
                  </div>

                  <div className="relative z-10 p-12 md:p-16 h-full flex flex-col justify-between">
                    {/* Top Stats */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-2 w-32 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50" />
                        <span className="text-blue-400 text-xs font-black uppercase tracking-wider">Active</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-2 w-48 bg-slate-800 rounded-full" />
                        <span className="text-slate-600 text-xs font-black uppercase tracking-wider">Expanding</span>
                      </div>
                    </div>

                    {/* Floating Globe Icon */}
                    <Globe className="floating-element h-48 w-48 md:h-64 md:w-64 text-blue-600/20 absolute -right-12 -bottom-12 group-hover:text-blue-500/30 transition-colors duration-1000" />

                    {/* Bottom Content */}
                    <div className="relative z-10">
                      <div className="text-6xl md:text-7xl font-black mb-4 tracking-tighter uppercase bg-gradient-to-br from-white to-blue-400 bg-clip-text text-transparent">
                        GLOBAL
                      </div>
                      <div className="text-sm md:text-base font-bold text-slate-500 tracking-widest uppercase flex items-center gap-3">
                        <span className="h-px w-8 bg-slate-700" />
                        Reach without limits
                      </div>

                      {/* Region Pills */}
                      <div className="flex flex-wrap gap-2 mt-8">
                        {['APAC', 'EMEA', 'AMER'].map((region, i) => (
                          <span key={i} className="tag-item px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700/50 text-slate-400 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2 reveal-text">
                <span className="text-blue-500 font-black tracking-[0.4em] uppercase text-[10px] mb-8 md:mb-10 block inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-blue-500" />
                  System 03 / Global Resource
                </span>
                <h2 className="split-text text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] mb-8 md:mb-12 py-2 md:py-4 uppercase bg-gradient-to-br from-white via-white to-blue-400 bg-clip-text text-transparent">
                  全球足迹
                </h2>
                <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed mb-10">
                  覆盖主流媒体平台与新兴流量枢纽。我们的资源池帮助您打破地域限制。
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '200+', label: 'Countries' },
                    { value: '7B+', label: 'Devices' },
                    { value: '50+', label: 'Platforms' },
                    { value: '24/7', label: 'Support' }
                  ].map((stat, i) => (
                    <div key={i} className="expertise-item p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm">
                      <div className="text-3xl md:text-4xl font-black text-white mb-2">{stat.value}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{stat.label}</div>
                    </div>
                  ))}
                </div>
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
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-12 uppercase">
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
      <section id="about" className="py-32 md:py-64 bg-slate-50">
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
              <span className="text-blue-600 block uppercase">增长为结果</span>
            </h2>
            <Link href="/contact" className="inline-flex items-center gap-4 md:gap-8 px-10 py-6 md:px-20 md:py-10 bg-white text-[#0a0a0a] rounded-full text-xl md:text-3xl font-black hover:bg-blue-600 hover:text-white transition-all duration-700 hover:scale-105 active:scale-95 group shadow-[0_30px_100px_rgba(37,99,235,0.3)] uppercase">
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
