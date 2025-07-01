"use client";

import { useState } from "react";
import { Stepper, type StepContent } from "@/components/ui/stepper";

interface MintingTutorialProps {
  onComplete: () => void;
}

const tutorialSteps: StepContent[] = [
  {
    title: "Select a Farcaster Cast",
    description: "You can select any cast posted by you and click on the 'Share' button.",
    media: {
      type: 'image',
      src: '/images/share_tutorial.gif',
      alt: 'How to share the cast'
    }
  },
  {
    title: "Enter coin details",
    description: "Give the coin a name and symbol.",
    media: {
      type: 'image',
      src: '/images/minting.gif',
      alt: 'Minting the coin'
    }
  },
  {
    title: "Share it with friends!",
    description: "Once the coin is minted, you can share it with your friends. They can then view or mint the coin on Zora!",
    // You can add a video or gif showing the minting form here
    media: {
      type: 'image',
      src: '/images/sharing.gif',
      alt: 'Sharing the coin'
    }
  }
];

export function MintingTutorial({ onComplete }: MintingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 px-8 mt-20">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          How to use Share to Mint
        </h1>
        <p className="text-gray-600">
          Learn how to turn Farcaster casts into collectible coins
        </p>
      </div>
      
      <Stepper
        steps={tutorialSteps}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        onComplete={handleComplete}
      />
    </div>
  );
} 