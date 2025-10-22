'use client';

import React from 'react';

interface OrbitingElementProps {
  size: number;
  color: string;
  orbitRadius: number;
  speed: number;
  delay: number;
  children?: React.ReactNode;
}

const OrbitingElement: React.FC<OrbitingElementProps> = ({
  size,
  color,
  orbitRadius,
  speed,
  delay,
  children,
}) => {
  return (
    <div
      className='absolute'
      style={{
        width: `${orbitRadius * 2}px`,
        height: `${orbitRadius * 2}px`,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        animation: `orbit ${speed}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <div
        className='absolute rounded-full opacity-20 hover:opacity-40 transition-opacity duration-300'
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          left: `${orbitRadius - size / 2}px`,
          top: `${orbitRadius - size / 2}px`,
          boxShadow: `0 0 ${size}px ${color}`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const OrbitingElements: React.FC = () => {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {/* Large orbiting elements */}
      <OrbitingElement
        size={20}
        color='#06b6d4'
        orbitRadius={300}
        speed={20}
        delay={0}
      />
      <OrbitingElement
        size={16}
        color='#3b82f6'
        orbitRadius={400}
        speed={25}
        delay={5}
      />
      <OrbitingElement
        size={12}
        color='#8b5cf6'
        orbitRadius={500}
        speed={30}
        delay={10}
      />

      {/* Medium orbiting elements */}
      <OrbitingElement
        size={8}
        color='#10b981'
        orbitRadius={200}
        speed={15}
        delay={2}
      />
      <OrbitingElement
        size={10}
        color='#f59e0b'
        orbitRadius={350}
        speed={18}
        delay={7}
      />

      {/* Small orbiting elements */}
      <OrbitingElement
        size={6}
        color='#ef4444'
        orbitRadius={150}
        speed={12}
        delay={3}
      />
      <OrbitingElement
        size={4}
        color='#ec4899'
        orbitRadius={250}
        speed={14}
        delay={8}
      />

      {/* Floating particles */}
      <div className='absolute inset-0'>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-white/10 rounded-full animate-pulse'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
