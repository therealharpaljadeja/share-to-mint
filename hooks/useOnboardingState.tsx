"use client";

import { useState, useEffect } from "react";
import { useFrame } from "@/components/farcaster-provider";
import { hasUserCompletedMinting } from "@/lib/database";

export function useOnboardingState() {
  const { context } = useFrame();
  const [hasCompletedMinting, setHasCompletedMinting] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkMintingStatus() {
      if (!context?.user?.fid) {
        setIsLoading(false);
        return;
      }

      try {
        // Check database for user's minting history
        const hasMinted = await hasUserCompletedMinting(context.user.fid);
        console.log("hasMinted", hasMinted);
        setHasCompletedMinting(hasMinted);
      } catch (error) {
        console.error('Error checking minting status:', error);
        // Fall back to localStorage on error
        const localMintingCompleted = localStorage.getItem('hasCompletedMinting') === 'true';
        setHasCompletedMinting(localMintingCompleted);
      } finally {
        setIsLoading(false);
      }
    }

    checkMintingStatus();
  }, [context?.user?.fid]);

  const markMintingCompleted = () => {
    // This function is now called from useCoinMint after successful database insert
    // but we still update local state for immediate UI feedback
    setHasCompletedMinting(true);
    // Keep localStorage as backup
    localStorage.setItem('hasCompletedMinting', 'true');
  };

  const resetOnboardingState = () => {
    setHasCompletedMinting(false);
    localStorage.removeItem('hasCompletedMinting');
    // Note: This doesn't delete from database - you might want to add that functionality
  };

  return {
    hasCompletedMinting,
    markMintingCompleted,
    resetOnboardingState,
    shouldShowTutorial: hasCompletedMinting === false,
    isLoading,
  };
} 