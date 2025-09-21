import React from 'react';
import { LoadingProps } from '@/types';

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading Portfolio',
  subMessage = 'Preparing amazing experience...',
}) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Orbital rings */}
        <div
          className="absolute w-64 h-64 border border-blue-400/30 rounded-full animate-spin"
          style={{ animationDuration: '3s' }}
        ></div>
        <div
          className="absolute w-48 h-48 border border-green-400/30 rounded-full animate-spin"
          style={{ animationDuration: '2s', animationDirection: 'reverse' }}
        ></div>
        <div
          className="absolute w-36 h-36 border border-red-400/30 rounded-full animate-spin"
          style={{ animationDuration: '1s' }}
        ></div>
        <div
          className="absolute w-24 h-24 border-2 border-white rounded-full animate-spin"
          style={{ animationDuration: '10s', animationDirection: 'reverse' }}
        ></div>

        {/* Center pulsing dot */}
        <div
          className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse"
          style={{ animationDuration: '2s' }}
        ></div>
      </div>

      {/* Loading text */}
      <div className="absolute bottom-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
        <p className="text-cyan-400 text-lg">{subMessage}</p>
      </div>
    </div>
  );
};

export default Loading;
