"use client";

import { useFrame } from "@/components/farcaster-provider";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { Onboarding } from "./Onboarding";


export function MainApp() {
  const { 
    isSDKLoaded,
  } = useFrame();
  const { isLoading } = useOnboardingState();

  // Show loading state while checking contexts
  if (isSDKLoaded && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return <Onboarding />;
} 