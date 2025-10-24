'use client';

import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { Card } from '@/components/ui/Card';
import { ProgressSteps } from '@/components/ui/ProgressSteps';

export const ProgressDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const steps = [
    {
      id: 'upload',
      title: 'Uploading',
      description: 'Processing your resume file',
      icon: '📄',
      status: 'pending' as const,
    },
    {
      id: 'parsing',
      title: 'Parsing',
      description: 'Extracting content and structure',
      icon: '🔍',
      status: 'pending' as const,
    },
    {
      id: 'analyzing',
      title: 'Analyzing',
      description: 'Running ATS compatibility check',
      icon: '⚡',
      status: 'pending' as const,
    },
    {
      id: 'results',
      title: 'Results',
      description: 'Generating your analysis report',
      icon: '📊',
      status: 'pending' as const,
    },
  ];

  const runDemo = async () => {
    setIsRunning(true);
    setCurrentStep(0);

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(i + 1);
    }

    setIsRunning(false);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsRunning(false);
  };

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      <Card className='p-6'>
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold text-white mb-2'>
            ATS Analysis Progress Demo
          </h2>
          <p className='text-gray-400'>
            Watch the cool progress steps in action!
          </p>
        </div>

        <ProgressSteps
          steps={steps.map((step, index) => ({
            ...step,
            status:
              index < currentStep
                ? 'completed'
                : index === currentStep
                  ? 'active'
                  : 'pending',
          }))}
          currentStep={currentStep}
          className='mb-6'
        />

        <div className='flex justify-center space-x-4'>
          <Button onClick={runDemo} disabled={isRunning} className='px-6 py-3'>
            {isRunning ? 'Running Demo...' : 'Start Demo'}
          </Button>

          <Button
            onClick={resetDemo}
            disabled={isRunning}
            variant='secondary'
            className='px-6 py-3'
          >
            Reset
          </Button>
        </div>

        {isRunning && (
          <div className='mt-6 text-center'>
            <div className='w-full bg-gray-700 rounded-full h-2 mb-2'>
              <div
                className='bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500'
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
            <p className='text-sm text-gray-400'>
              {steps[currentStep - 1]?.description || 'Starting...'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProgressDemo;
