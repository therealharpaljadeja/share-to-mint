"use client";

import { useState, useEffect } from "react";

export function useOnboardingState() {
  const [hasCompletedMinting, setHasCompletedMinting] = useState<boolean | null>(null);
  const [hasViewedTutorial, setHasViewedTutorial] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage for minting history
    const mintingCompleted = localStorage.getItem('hasCompletedMinting') === 'true';
    const tutorialViewed = localStorage.getItem('hasViewedTutorial') === 'true';
    
    setHasCompletedMinting(mintingCompleted);
    setHasViewedTutorial(tutorialViewed);
  }, []);

  const markMintingCompleted = () => {
    localStorage.setItem('hasCompletedMinting', 'true');
    setHasCompletedMinting(true);
  };

  const markTutorialViewed = () => {
    localStorage.setItem('hasViewedTutorial', 'true');
    setHasViewedTutorial(true);
  };

  const resetOnboardingState = () => {
    localStorage.removeItem('hasCompletedMinting');
    localStorage.removeItem('hasViewedTutorial');
    setHasCompletedMinting(false);
    setHasViewedTutorial(false);
  };

  return {
    hasCompletedMinting,
    hasViewedTutorial,
    markMintingCompleted,
    markTutorialViewed,
    resetOnboardingState,
    // Show tutorial if they haven't viewed it and haven't completed minting
    shouldShowTutorial: hasViewedTutorial === false && hasCompletedMinting === false,
    isLoading: hasCompletedMinting === null || hasViewedTutorial === null,
  };
} 