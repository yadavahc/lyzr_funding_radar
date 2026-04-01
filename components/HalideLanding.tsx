'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface HalideLandingProps {
  title?: string;
  ctaText?: string;
  ctaLink?: string;
}

const HalideLanding: React.FC<HalideLandingProps> = ({
  title = 'LYZR\nFUNDING',
  ctaText = 'EXPLORE STARTUPS',
  ctaLink = '/startups',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mouse Parallax Logic
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.pageX) / 25;
      const y = (window.innerHeight / 2 - e.pageY) / 25;

      // Rotate the 3D Canvas
      canvas.style.transform = `rotateX(${55 + y / 2}deg) rotateZ(${-25 + x / 2}deg)`;

      // Apply depth shift to layers
      layersRef.current.forEach((layer, index) => {
        if (!layer) return;
        const depth = (index + 1) * 15;
        const moveX = x * (index + 1) * 0.2;
        const moveY = y * (index + 1) * 0.2;
        layer.style.transform = `translateZ(${depth}px) translate(${moveX}px, ${moveY}px)`;
      });
    };

    // Entrance Animation
    canvas.style.opacity = '0';
    canvas.style.transform = 'rotateX(90deg) rotateZ(0deg) scale(0.8)';

    const timeout = setTimeout(() => {
      canvas.style.transition = 'all 2.5s cubic-bezier(0.16, 1, 0.3, 1)';
      canvas.style.opacity = '1';
      canvas.style.transform = 'rotateX(55deg) rotateZ(-25deg) scale(1)';
    }, 300);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --bg: #0a0a0a;
          --silver: #e0e0e0;
          --accent: #ff3c00;
          --grain-opacity: 0.15;
        }

        .halide-body {
          background-color: var(--bg);
          color: var(--silver);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          overflow: hidden;
          height: 100vh;
          width: 100vw;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .halide-grain {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 100;
          opacity: var(--grain-opacity);
        }

        .viewport {
          perspective: 2000px;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .canvas-3d {
          position: relative;
          width: 800px;
          height: 500px;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .layer {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(224, 224, 224, 0.1);
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease;
        }

        .layer-1 {
          background-image: url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(1) contrast(1.2) brightness(0.5);
        }

        .layer-2 {
          background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(1) contrast(1.1) brightness(0.7);
          opacity: 0.6;
          mix-blend-mode: screen;
        }

        .layer-3 {
          background-image: url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(1) contrast(1.3) brightness(0.8);
          opacity: 0.4;
          mix-blend-mode: overlay;
        }

        .contours {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background-image: repeating-radial-gradient(
            circle at 50% 50%,
            transparent 0,
            transparent 40px,
            rgba(255, 255, 255, 0.05) 41px,
            transparent 42px
          );
          transform: translateZ(120px);
          pointer-events: none;
        }

        .interface-grid {
          position: fixed;
          inset: 0;
          padding: 2rem 4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto 1fr auto;
          z-index: 10;
          pointer-events: none;
        }

        .header-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .header-left {
          letter-spacing: 1px;
        }

        .header-right {
          font-family: 'Courier New', monospace;
          color: var(--accent);
          text-align: right;
        }

        .hero-title {
          grid-column: 1 / -1;
          align-self: center;
          font-size: clamp(3rem, 10vw, 8rem);
          line-height: 0.85;
          letter-spacing: -0.04em;
          mix-blend-mode: difference;
          font-weight: 900;
          text-transform: uppercase;
          margin: 2rem 0;
        }

        .footer-section {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
        }

        .footer-text {
          font-family: 'Courier New', monospace;
          font-size: 0.75rem;
          line-height: 1.6;
        }

        .cta-button {
          pointer-events: auto;
          background: var(--silver);
          color: var(--bg);
          padding: 1rem 2.5rem;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 1px;
          clip-path: polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          cursor: pointer;
          border: none;
        }

        .cta-button:hover {
          background: var(--accent);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 60, 0, 0.3);
        }

        .scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, var(--silver), transparent);
          animation: flow 2s infinite ease-in-out;
          transform: translateX(-50%);
        }

        @keyframes flow {
          0%,
          100% {
            transform: translateX(-50%) scaleY(0);
            transform-origin: top;
          }
          50% {
            transform: translateX(-50%) scaleY(1);
            transform-origin: top;
          }
          51% {
            transform: translateX(-50%) scaleY(1);
            transform-origin: bottom;
          }
        }

        @media (max-width: 768px) {
          .interface-grid {
            padding: 1rem 2rem;
            grid-template-rows: auto auto 1fr auto;
          }

          .hero-title {
            font-size: clamp(2rem, 8vw, 4rem);
            grid-column: 1 / -1;
            margin: 1.5rem 0;
          }

          .canvas-3d {
            width: 100%;
            max-width: 600px;
            height: 350px;
          }

          .footer-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .cta-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="halide-body">
        {/* SVG Filter for Grain */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
        </svg>

        <div className="halide-grain" style={{ filter: 'url(#grain)' }}></div>

        <div className="interface-grid">
          {/* Header */}
          <div className="header-info">
            <div className="header-left">LYZR_CORE</div>
            <div className="header-right">
              <div>AI FUNDING TRACKER</div>
              <div>REAL-TIME INSIGHTS</div>
            </div>
          </div>

          {/* Hero Title */}
          <h1 className="hero-title">{title}</h1>

          {/* Footer */}
          <div className="footer-section">
            <div className="footer-text">
              <p>[ STARTUP DISCOVERY ]</p>
              <p>DISCOVER FUNDED AI DEVELOPER TOOLS</p>
              <p>EXTRACT INSIGHTS & ANALYZE TRENDS</p>
            </div>
            <a href={ctaLink} className="cta-button">
              {ctaText}
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* 3D Parallax Canvas */}
        <div className="viewport">
          <div className="canvas-3d" ref={canvasRef}>
            <div className="layer layer-1" ref={(el) => { if (el) layersRef.current[0] = el; }}></div>
            <div className="layer layer-2" ref={(el) => { if (el) layersRef.current[1] = el; }}></div>
            <div className="layer layer-3" ref={(el) => { if (el) layersRef.current[2] = el; }}></div>
            <div className="contours"></div>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="scroll-hint"></div>
      </div>
    </>
  );
};

export default HalideLanding;
