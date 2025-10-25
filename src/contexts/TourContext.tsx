'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface TourStep {
  id: string;
  target: string; // CSS selector for the element to highlight
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'scroll' | 'wait';
  actionText?: string;
  skipable?: boolean;
}

export interface TourConfig {
  id: string;
  name: string;
  description: string;
  steps: TourStep[];
  autoStart?: boolean;
  showProgress?: boolean;
}

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  currentTour: TourConfig | null;
  hasCompletedTour: (tourId: string) => boolean;
  startTour: (tourId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  registerTour: (tour: TourConfig) => void;
  getAvailableTours: () => TourConfig[];
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

interface TourProviderProps {
  children: React.ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTour, setCurrentTour] = useState<TourConfig | null>(null);
  const [tours, setTours] = useState<Map<string, TourConfig>>(new Map());
  const [completedTours, setCompletedTours] = useState<Set<string>>(new Set());

  // Load completed tours from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('completed-tours');
    if (saved) {
      try {
        const completed = JSON.parse(saved);
        setCompletedTours(new Set(completed));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Save completed tours to localStorage
  const saveCompletedTours = (completed: Set<string>) => {
    localStorage.setItem('completed-tours', JSON.stringify([...completed]));
  };

  const hasCompletedTour = useCallback(
    (tourId: string): boolean => {
      return completedTours.has(tourId);
    },
    [completedTours]
  );

  const startTour = useCallback(
    (tourId: string) => {
      const tour = tours.get(tourId);
      if (tour) {
        setCurrentTour(tour);
        setCurrentStep(0);
        setIsActive(true);
      }
    },
    [tours]
  );

  const nextStep = useCallback(() => {
    if (currentTour && currentStep < currentTour.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  }, [currentTour, currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setCurrentTour(null);
    setCurrentStep(0);
  }, []);

  const completeTour = useCallback(() => {
    if (currentTour) {
      const newCompleted = new Set(completedTours);
      newCompleted.add(currentTour.id);
      setCompletedTours(newCompleted);
      saveCompletedTours(newCompleted);
    }
    setIsActive(false);
    setCurrentTour(null);
    setCurrentStep(0);
  }, [currentTour, completedTours]);

  const registerTour = useCallback((tour: TourConfig) => {
    setTours(prev => new Map(prev).set(tour.id, tour));
  }, []);

  const getAvailableTours = useCallback((): TourConfig[] => {
    return Array.from(tours.values());
  }, [tours]);

  const value: TourContextType = {
    isActive,
    currentStep,
    currentTour,
    hasCompletedTour,
    startTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    registerTour,
    getAvailableTours,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};
