import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export interface StepContent {
  title: string;
  description: string;
  media?: {
    type: 'image' | 'gif' | 'video';
    src: string;
    alt?: string;
  };
}

export interface StepperProps {
  steps: StepContent[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete?: () => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  className,
}: StepperProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
    } else {
      onStepChange(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1);
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  index <= currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {index + 1}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-16 mx-2 transition-colors",
                  index < currentStep ? "bg-blue-500" : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg shadow-lg p-8 min-h-[400px] flex flex-col">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {steps[currentStep]?.title}
          </h2>

          <p className="text-gray-600 text-md leading-relaxed pb-6">
            {steps[currentStep]?.description}
          </p>
          
          {/* Media content */}
          {steps[currentStep]?.media && (
            <div>
              {steps[currentStep].media?.type === 'video' ? (
                <video
                  src={steps[currentStep].media!.src}
                  autoPlay
                  loop
                  muted
                  className="w-full max-w-md mx-auto rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={steps[currentStep].media!.src}
                  alt={steps[currentStep].media?.alt || "Step illustration"}
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              )}
            </div>
          )}

          
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isFirstStep}
            className={cn(
              "flex items-center gap-2",
              isFirstStep && "invisible"
            )}
          >
            <IoChevronBack className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-[#855DCC] hover:bg-[#855DCC] text-white"
          >
            {isLastStep ? 'Get Started' : 'Continue'}
            {!isLastStep && <IoChevronForward className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
} 