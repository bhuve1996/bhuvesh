'use client';

import { motion } from 'framer-motion';
import React from 'react';

import type { DataVisualizationProps } from '@/types';

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  title,
  data,
  type = 'bar',
  className = '',
}) => {
  const maxValue = Math.max(...data.map(item => item.value));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getColor = (index: number, customColor?: string) => {
    if (customColor) return customColor;

    const colors = [
      'from-cyan-400 to-blue-500',
      'from-purple-400 to-pink-500',
      'from-green-400 to-emerald-500',
      'from-yellow-400 to-orange-500',
      'from-red-400 to-pink-500',
      'from-indigo-400 to-purple-500',
    ];
    return colors[index % colors.length];
  };

  if (type === 'radial') {
    return (
      <motion.div
        className={`p-6 ${className}`}
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <h3 className='text-xl font-bold mb-6 text-foreground'>{title}</h3>
        <div className='grid grid-cols-3 gap-4'>
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              className='relative'
              variants={itemVariants}
            >
              <div className='relative w-24 h-24 mx-auto'>
                <svg
                  className='w-full h-full transform -rotate-90'
                  viewBox='0 0 100 100'
                >
                  <circle
                    cx='50'
                    cy='50'
                    r='40'
                    stroke='rgba(255, 255, 255, 0.1)'
                    strokeWidth='8'
                    fill='none'
                  />
                  <motion.circle
                    cx='50'
                    cy='50'
                    r='40'
                    stroke={`url(#gradient-${index})`}
                    strokeWidth='8'
                    fill='none'
                    strokeLinecap='round'
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: item.value / 100 }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                  />
                  <defs>
                    <linearGradient
                      id={`gradient-${index}`}
                      x1='0%'
                      y1='0%'
                      x2='100%'
                      y2='100%'
                    >
                      <stop offset='0%' stopColor='rgb(6, 182, 212)' />
                      <stop offset='100%' stopColor='rgb(59, 130, 246)' />
                    </linearGradient>
                  </defs>
                </svg>
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <span className='text-lg font-bold text-foreground'>
                    {item.value}%
                  </span>
                </div>
              </div>
              <p className='text-center text-sm text-muted-foreground mt-2'>
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (type === 'donut') {
    return (
      <motion.div
        className={`p-6 ${className}`}
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <h3 className='text-xl font-bold mb-6 text-foreground'>{title}</h3>
        <div className='relative w-48 h-48 mx-auto'>
          <svg
            className='w-full h-full transform -rotate-90'
            viewBox='0 0 100 100'
          >
            {data.map((item, index) => {
              const startAngle = data
                .slice(0, index)
                .reduce(
                  (sum, d) =>
                    sum +
                    (d.value / data.reduce((s, d) => s + d.value, 0)) * 360,
                  0
                );
              const endAngle =
                startAngle +
                (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 360;

              return (
                <motion.path
                  key={item.label}
                  d={`M 50,50 L ${50 + 40 * Math.cos(((startAngle - 90) * Math.PI) / 180)},${50 + 40 * Math.sin(((startAngle - 90) * Math.PI) / 180)} A 40,40 0 ${endAngle - startAngle > 180 ? 1 : 0},1 ${50 + 40 * Math.cos(((endAngle - 90) * Math.PI) / 180)},${50 + 40 * Math.sin(((endAngle - 90) * Math.PI) / 180)} Z`}
                  fill={`url(#gradient-${index})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                />
              );
            })}
            {data.map((_, index) => (
              <defs key={index}>
                <linearGradient
                  id={`gradient-${index}`}
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='rgb(6, 182, 212)' />
                  <stop offset='100%' stopColor='rgb(59, 130, 246)' />
                </linearGradient>
              </defs>
            ))}
          </svg>
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <span className='text-2xl font-bold text-foreground'>
              {data.reduce((sum, item) => sum + item.value, 0)}
            </span>
            <span className='text-sm text-muted-foreground'>Total</span>
          </div>
        </div>
        <div className='mt-6 space-y-2'>
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              className='flex items-center justify-between'
              variants={itemVariants}
            >
              <div className='flex items-center space-x-2'>
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${getColor(index)}`}
                />
                <span className='text-muted-foreground'>{item.label}</span>
              </div>
              <span className='text-foreground font-medium'>{item.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Default bar chart
  return (
    <motion.div
      className={`p-6 ${className}`}
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <h3 className='text-xl font-bold mb-6 text-foreground'>{title}</h3>
      <div className='space-y-4'>
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            className='space-y-2'
            variants={itemVariants}
          >
            <div className='flex justify-between items-center'>
              <div className='flex items-center space-x-2'>
                {item.icon && <span className='text-lg'>{item.icon}</span>}
                <span className='text-muted-foreground font-medium'>
                  {item.label}
                </span>
              </div>
              <span className='text-foreground font-bold'>{item.value}</span>
            </div>
            <div className='w-full bg-muted/30 rounded-full h-3 overflow-hidden'>
              <motion.div
                className={`h-full bg-gradient-to-r ${getColor(index, item.color)} rounded-full relative`}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              >
                <motion.div
                  className='absolute inset-0 bg-white/20'
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DataVisualization;
