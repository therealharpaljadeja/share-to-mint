"use client";

import { useState, useEffect } from "react";
import { useFrame } from "@/components/farcaster-provider";
import { hasUserCompletedMinting } from "@/lib/database";

export function useOnboardingState() {
  const { context } = useFrame();
  const [shouldShowTutorial, setShouldShowTutorial] = useState<boolean>(false);
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
        setShouldShowTutorial(!hasMinted);
      } catch (error) {
        console.error('Error checking minting status:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkMintingStatus();
  }, [context?.user?.fid]);

  return {
    shouldShowTutorial,
    isLoading,
  };
} 