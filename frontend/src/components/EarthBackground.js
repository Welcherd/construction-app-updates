import React, { useState, useEffect, useRef } from "react";

// CSS-based animated Earth background with stars
// This avoids Three.js/R3F compatibility issues while still looking impressive

function Stars() {
  const stars = useRef(
    Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            width: star.size + "px",
            height: star.size + "px",
            left: star.x + "%",
            top: star.y + "%",
            opacity: star.opacity,
            animationDuration: star.duration + "s",
            animationDelay: star.delay + "s",
          }}
        />
      ))}
    </div>
  );
}

function AnimatedGlobe() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative">
        {/* Main globe */}
        <div 
          className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full animate-globe-rotate"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, 
                rgba(74, 144, 226, 0.3) 0%, 
                rgba(30, 64, 175, 0.2) 30%, 
                rgba(15, 23, 42, 0.8) 70%,
                rgba(0, 0, 0, 0.95) 100%
              )
            `,
            boxShadow: `
              inset -30px -30px 80px rgba(0, 0, 0, 0.8),
              inset 20px 20px 60px rgba(74, 144, 226, 0.15),
              0 0 100px rgba(74, 144, 226, 0.2),
              0 0 200px rgba(74, 144, 226, 0.1)
            `,
          }}
        >
          {/* Continental highlights - animated */}
          <div 
            className="absolute inset-0 rounded-full animate-continents"
            style={{
              background: `
                radial-gradient(ellipse 25% 15% at 25% 35%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse 30% 20% at 60% 40%, rgba(34, 197, 94, 0.12) 0%, transparent 50%),
                radial-gradient(ellipse 20% 25% at 45% 55%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse 15% 10% at 75% 30%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse 18% 12% at 35% 65%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)
              `,
            }}
          />
          
          {/* Atmosphere glow */}
          <div 
            className="absolute -inset-4 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 50% 50%, 
                  transparent 45%,
                  rgba(74, 144, 226, 0.05) 50%,
                  rgba(74, 144, 226, 0.1) 55%,
                  transparent 60%
                )
              `,
            }}
          />
          
          {/* Sun reflection highlight */}
          <div 
            className="absolute top-[15%] left-[20%] w-[30%] h-[25%] rounded-full"
            style={{
              background: `
                radial-gradient(ellipse at center, 
                  rgba(255, 255, 255, 0.15) 0%, 
                  transparent 70%
                )
              `,
              filter: "blur(10px)",
            }}
          />
        </div>
        
        {/* Orbital rings */}
        <div 
          className="absolute inset-[-20px] rounded-full border border-primary/10 animate-orbit"
          style={{ animationDuration: "20s" }}
        />
        <div 
          className="absolute inset-[-50px] rounded-full border border-primary/5 animate-orbit-reverse"
          style={{ animationDuration: "30s" }}
        />
        
        {/* Connection dots around globe */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary animate-pulse"
            style={{
              left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 280}px)`,
              top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 280}px)`,
              transform: "translate(-50%, -50%)",
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function EarthBackground() {
  return (
    <div 
      className="fixed inset-0 z-0 bg-[#030712] overflow-hidden" 
      aria-hidden="true" 
      data-testid="earth-background"
    >
      {/* Gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, 
              rgba(15, 23, 42, 1) 0%, 
              rgba(3, 7, 18, 1) 50%,
              rgba(0, 0, 0, 1) 100%
            )
          `,
        }}
      />
      
      {/* Stars */}
      <Stars />
      
      {/* Animated Globe */}
      <AnimatedGlobe />
      
      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, 
              transparent 30%, 
              rgba(0, 0, 0, 0.4) 70%,
              rgba(0, 0, 0, 0.8) 100%
            )
          `,
        }}
      />
      
      {/* Inline styles for animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes globe-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes continents {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        
        @keyframes orbit {
          0% { transform: rotateX(60deg) rotateZ(0deg); }
          100% { transform: rotateX(60deg) rotateZ(360deg); }
        }
        
        @keyframes orbit-reverse {
          0% { transform: rotateX(75deg) rotateZ(0deg); }
          100% { transform: rotateX(75deg) rotateZ(-360deg); }
        }
        
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
        
        .animate-globe-rotate {
          animation: globe-rotate 60s linear infinite;
        }
        
        .animate-continents {
          animation: continents 60s linear infinite;
        }
        
        .animate-orbit {
          animation: orbit linear infinite;
          transform-style: preserve-3d;
        }
        
        .animate-orbit-reverse {
          animation: orbit-reverse linear infinite;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
