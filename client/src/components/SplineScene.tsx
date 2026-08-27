'use client';

import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: (app: unknown) => void;
}

function SplineLoader() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: '#00f0ff', borderRightColor: '#a200ff' }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: '#a200ff',
            borderLeftColor: '#00f0ff',
            animationDirection: 'reverse',
            animationDuration: '0.8s',
          }}
        />
      </div>
      <p className="text-xs tracking-[0.2em] uppercase" style={{ color: '#00f0ff', opacity: 0.7 }}>
        Loading 3D Scene
      </p>
    </div>
  );
}

export default function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  return (
    <Suspense fallback={<SplineLoader />}>
      <Spline scene={scene} className={className} onLoad={onLoad as (spline: object) => void} />
    </Suspense>
  );
}
