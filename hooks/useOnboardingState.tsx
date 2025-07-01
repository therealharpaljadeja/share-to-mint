"use client";

import { useState, useEffect } from "react";

export function useOnboardingState() {
  // This will be done based on the minting history of the user from the backend
  const [hasCompletedMinting, setHasCompletedMinting] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage for minting history
    const mintingCompleted = localStorage.getItem('hasCompletedMinting') === 'true';
    
    setHasCompletedMinting(mintingCompleted);
  }, []);

  const markMintingCompleted = () => {
    localStorage.setItem('hasCompletedMinting', 'true');
    setHasCompletedMinting(true);
  };

  const resetOnboardingState = () => {
    localStorage.removeItem('hasCompletedMinting');
    setHasCompletedMinting(false);
  };

  return {
    hasCompletedMinting,
    markMintingCompleted,
    resetOnboardingState,
    shouldShowTutorial: hasCompletedMinting === false,
    isLoading: hasCompletedMinting === null,
  };
} 