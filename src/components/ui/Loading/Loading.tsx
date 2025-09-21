import React from 'react';

import { LoadingProps } from './types';

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading Portfolio',
  subMessage = 'Preparing amazing experience...',
}) => {
  return (
    <div className='min-h-screen bg-black flex items-center justify-center relative overflow-hidden'>
      {/* Animated background particles */}
      <div className='absolute inset-0'>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className='absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className='relative w-96 h-96 flex items-center justify-center'>
        {/* Outer orbital ring with loading segments */}
        <div className='absolute w-80 h-80 border-2 border-transparent rounded-full'>
          {/* Loading segments */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className='absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-orbit-pulse'
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 45}deg) translateX(160px) translateY(-4px)`,
                animationDelay: `${i * 0.25}s`,
              }}
            />
          ))}
        </div>

        {/* Middle orbital ring with rotating dots */}
        <div className='absolute w-64 h-64 border border-green-400/40 rounded-full animate-spin'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='absolute w-3 h-3 bg-green-400 rounded-full'
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 60}deg) translateX(128px) translateY(-6px)`,
              }}
            />
          ))}
        </div>

        {/* Inner orbital ring with pulsing segments */}
        <div
          className='absolute w-48 h-48 border border-red-400/40 rounded-full animate-spin'
          style={{ animationDuration: '3s', animationDirection: 'reverse' }}
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='absolute w-4 h-1 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse-glow'
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 90}deg) translateX(96px) translateY(-2px)`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* Core ring with data flow effect */}
        <div
          className='absolute w-32 h-32 border-2 border-white/60 rounded-full animate-spin'
          style={{ animationDuration: '4s' }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className='absolute w-1 h-1 bg-white rounded-full animate-data-flow'
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 30}deg) translateX(64px) translateY(-2px)`,
                opacity: i % 3 === 0 ? 1 : 0.3,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Center core with pulsing effect */}
        <div className='relative w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center'>
          <div className='w-8 h-8 bg-white rounded-full animate-pulse'></div>
          <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-20'></div>
        </div>

        {/* Loading progress ring */}
        <div className='absolute w-72 h-72 border-2 border-transparent rounded-full'>
          <div className='absolute inset-0 border-2 border-cyan-400 rounded-full animate-loading-progress'></div>
        </div>
      </div>

      {/* Loading text with typing effect */}
      <div className='absolute bottom-20 text-center'>
        <h2 className='text-2xl font-bold text-white mb-2 animate-pulse'>
          {message}
        </h2>
        <p
          className='text-cyan-400 text-lg animate-pulse'
          style={{ animationDelay: '0.5s' }}
        >
          {subMessage}
        </p>
        <div className='flex justify-center mt-4 space-x-1'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='w-2 h-2 bg-cyan-400 rounded-full animate-bounce'
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
