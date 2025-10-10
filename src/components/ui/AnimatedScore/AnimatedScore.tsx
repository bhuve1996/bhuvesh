'use client';

import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import type { AnimatedScoreProps } from '@/types';

export const AnimatedScore: React.FC<AnimatedScoreProps> = ({
  score,
  size = 'lg',
  showGrade = true,
  className = '',
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const controls = useAnimation();

  const sizeClasses = {
    sm: 'w-20 h-20 text-2xl',
    md: 'w-24 h-24 text-3xl',
    lg: 'w-32 h-32 text-4xl',
    xl: 'w-40 h-40 text-5xl',
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green-500
    if (score >= 60) return '#f59e0b'; // yellow-500
    return '#ef4444'; // red-500
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      controls.start({
        pathLength: score / 100,
        transition: { duration: 2, ease: 'easeInOut' },
      });
    }, 500);

    // Animate the number
    let start = 0;
    const increment = score / 60; // 60 frames for smooth animation
    const counter = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(counter);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 33); // ~30fps

    return () => {
      clearTimeout(timer);
      clearInterval(counter);
    };
  }, [score, controls]);

  return (
    <div className={`relative ${className}`}>
      {/* Animated SVG Circle */}
      <motion.div
        className={`relative ${sizeClasses[size]} mx-auto`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
      >
        <svg
          className='w-full h-full transform -rotate-90'
          viewBox='0 0 100 100'
        >
          {/* Background circle */}
          <circle
            cx='50'
            cy='50'
            r='45'
            stroke='rgba(255, 255, 255, 0.1)'
            strokeWidth='8'
            fill='none'
          />

          {/* Animated progress circle */}
          <motion.circle
            cx='50'
            cy='50'
            r='45'
            stroke={getStrokeColor(score)}
            strokeWidth='8'
            fill='none'
            strokeLinecap='round'
            initial={{ pathLength: 0 }}
            animate={controls}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))',
            }}
          />
        </svg>

        {/* Score content */}
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <motion.span
            className={`font-bold ${getScoreColor(score)}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {displayScore}
          </motion.span>
          {showGrade && (
            <motion.span
              className={`text-sm font-medium ${getScoreColor(score)}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.3 }}
            >
              {getScoreGrade(score)}
            </motion.span>
          )}
        </div>

        {/* Floating particles */}
        {score >= 80 && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className='absolute w-1 h-1 bg-green-400 rounded-full'
                style={{
                  left: `${50 + 40 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                  top: `${50 + 40 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 ${getScoreBgColor(score)} rounded-full blur-xl opacity-50`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.3 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
    </div>
  );
};

export default AnimatedScore;
