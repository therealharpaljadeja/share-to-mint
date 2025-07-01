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
      src: '/images/feed.png',
      alt: 'Farcaster feed showing various casts'
    }
  },
  {
    title: "Share the Cast",
    description: "Share or recast the content you want to mint. This action helps spread the content and prepares it for the minting process. The more engagement a cast has, the more valuable your mint might become.",
    // You can add a gif or video here later
    // media: {
    //   type: 'gif',
    //   src: '/images/share-demo.gif',
    //   alt: 'Demonstration of sharing a cast'
    // }
  },
  {
    title: "Access Share to Mint",
    description: "Once you've shared the cast, you'll see a 'Share to Mint' frame appear. This special frame is your gateway to creating a collectible NFT from the shared content. Click on it to start the minting process.",
    media: {
      type: 'image',
      src: '/images/icon.png',
      alt: 'Share to Mint frame'
    }
  },
  {
    title: "Create Your Coin",
    description: "In the minting interface, you'll need to provide a name and symbol for your coin. Choose something memorable and relevant to the content you're minting. Then hit 'Coin it' to complete the process and create your unique collectible!",
    // You can add a video or gif showing the minting form here
    // media: {
    //   type: 'video',
    //   src: '/videos/minting-demo.mp4',
    //   alt: 'Minting form demonstration'
    // }
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