'use client';

import Lottie from 'lottie-react';

const loadingAnim = {
  v: "5.5.7", fr: 60, ip: 0, op: 60, w: 100, h: 100, nm: "Loading", ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: "Circle", sr: 1, ks: {
      o: { a: 0, k: 100 }, r: { a: 1, k: [{ i: { x: [0.6], y: [1] }, o: { x: [0.4], y: [0] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
      p: { a: 0, k: [50, 50, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] }
    },
    shapes: [{
      ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [60, 60] }
    }, {
      ty: "st", c: { a: 0, k: [0.788, 0.658, 0.298, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 6 }, lc: 2, lj: 2
    }], ip: 0, op: 60, st: 0
  }]
};

const successAnim = {
  v: "5.5.7", fr: 60, ip: 0, op: 60, w: 100, h: 100, nm: "Success", ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: "Check", sr: 1, ks: {
      o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
      p: { a: 0, k: [50, 50, 0] }, a: { a: 1, k: [{ i: { x: [0.6], y: [1] }, o: { x: [0.4], y: [0] }, t: 0, s: [80, 80, 100] }, { t: 30, s: [100, 100, 100] }] }
    },
    shapes: [{
      ty: "sh", ks: { a: 0, k: { i: [[0,0],[0,0],[0,0]], o: [[0,0],[0,0],[0,0]], v: [[-20,0],[-5,15],[25,-15]], closed: false } }
    }, {
      ty: "st", c: { a: 0, k: [0.788, 0.658, 0.298, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 8 }, lc: 2, lj: 2
    }], ip: 0, op: 60, st: 0
  }]
};

const errorAnim = {
  v: "5.5.7", fr: 60, ip: 0, op: 60, w: 100, h: 100, nm: "Error", ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: "X", sr: 1, ks: {
      o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
      p: { a: 0, k: [50, 50, 0] }, a: { a: 1, k: [{ i: { x: [0.6], y: [1] }, o: { x: [0.4], y: [0] }, t: 0, s: [80, 80, 100] }, { t: 30, s: [100, 100, 100] }] }
    },
    shapes: [{
      ty: "sh", ks: { a: 0, k: { i: [[0,0],[0,0]], o: [[0,0],[0,0]], v: [[-20,-20],[20,20]], closed: false } }
    }, {
      ty: "sh", ks: { a: 0, k: { i: [[0,0],[0,0]], o: [[0,0],[0,0]], v: [[20,-20],[-20,20]], closed: false } }
    }, {
      ty: "st", c: { a: 0, k: [0.702, 0.149, 0.118, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 8 }, lc: 2, lj: 2
    }], ip: 0, op: 60, st: 0
  }]
};

interface LottieStateProps {
  type: 'loading' | 'success' | 'empty' | 'error';
  className?: string;
  size?: number;
}

export function LottieState({ type, className = "w-24 h-24 mx-auto", size = 96 }: LottieStateProps) {
  let animData: any = loadingAnim;
  if (type === 'success') animData = successAnim;
  else if (type === 'error') animData = errorAnim;
  // 'empty' يبقى بنفس دائرة loadingAnim بصريًا لكن بدون تكرار (loop=false) — راجع أسفل

  return (
    <div className={className} style={{ width: size, height: size, opacity: type === 'empty' ? 0.4 : 1 }}>
      <Lottie animationData={animData} loop={type === 'loading'} autoplay={true} />
    </div>
  );
}
