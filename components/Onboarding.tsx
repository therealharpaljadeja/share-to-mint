"use client";

import { useFrame } from "@/components/farcaster-provider";
import { Button } from "@/components/ui/button";
import { sdk } from "@farcaster/frame-sdk";

export function Onboarding() {
  const { actions, context } = useFrame();

  const addFrame = () => {
    sdk.haptics.impactOccurred('heavy');
    actions?.addFrame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {context?.client.added ? (
          <div className="text-center">
            <p className="text-lg font-medium text-green-600">You're all set!</p>
            <p className="mt-2 text-gray-600">
              You can now use this Mini App within Farcaster.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
              <p className="mt-2 text-gray-600">
                To get started, add this Mini App using the button below and refresh the mini app.
              </p>
            </div>
            <Button
              onClick={addFrame}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Add Mini App
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
