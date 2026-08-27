'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';


const SplineScene = dynamic(() => import('@/components/SplineScene'), { ssr: false });

export default function HeroSection() {
  const [sceneLoaded, setSceneLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setSceneLoaded(true);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center pt-32 pb-20"
      style={{ background: 'transparent' }}
    >
      
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)'
        }}
      >
        {!sceneLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: '#050816' }}>
            <div className="relative w-16 h-16">
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
                style={{ borderTopColor: '#00f0ff', borderRightColor: '#a200ff' }}
              />
            </div>
          </div>
        )}
        <div
          className="w-full h-full transition-opacity duration-1000"
          style={{ opacity: sceneLoaded ? 1 : 0 }}
        >
          <SplineScene
            scene="/scene.splinecode"
            className="w-full h-full"
            onLoad={handleLoad}
          />
        </div>
        
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            background: 'radial-gradient(circle at center, transparent 0%, rgba(5,8,22,0.6) 100%), linear-gradient(to bottom, rgba(5,8,22,0.3) 0%, rgba(5,8,22,0.8) 100%)' 
          }} 
        />
      </div>

      
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 flex flex-col items-center text-center mt-[-4rem]">
        


        
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight mb-6 drop-shadow-2xl"
          style={{ color: '#ffffff', textShadow: '0 0 40px rgba(255,255,255,0.3)' }}
        >
          Exploring The{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #a200ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.5))'
            }}
          >
            Universe
          </span>
          <br />Beyond Limits
        </h1>

        
        <div className="flex flex-col items-center gap-5 mb-12 max-w-4xl mx-auto">
          <p
            className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-relaxed text-center tracking-wide"
            style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
          >
            Welcome to <span style={{ color: '#00f0ff', textShadow: '0 0 20px rgba(0,240,255,0.8)' }}>AstroNITR</span>, the official Astronomy & Astrophysics club of NIT Rourkela.
          </p>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            href="/register"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00f0ff, #a200ff)',
              color: '#050816',
              boxShadow: '0 0 40px rgba(0,240,255,0.5)',
            }}
          >
            <span className="relative z-10">Join The Mission</span>
            <svg className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/events"
            className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 backdrop-blur-md hover:bg-[rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:border-[rgba(0,240,255,0.8)]"
            style={{
              border: '2px solid rgba(0,240,255,0.5)',
              color: '#ffffff',
              background: 'rgba(5,8,22,0.4)',
              boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
            }}
          >
            Explore Events
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>

      
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-10"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
