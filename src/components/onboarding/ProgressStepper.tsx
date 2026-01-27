'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OnboardingStep } from '@/types/onboarding';

interface ProgressStepperProps {
  steps: OnboardingStep[];
  currentStep: number;
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <>
      {/* Desktop Stepper */}
      <div className="hidden md:block mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isFuture = index > currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                {/* Step Circle and Label */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                      isCompleted && 'border-green-500 bg-green-500 text-white',
                      isCurrent && 'border-teal-500 bg-teal-500 text-white',
                      isFuture && 'border-gray-300 bg-white text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={cn(
                        'text-sm font-medium transition-colors',
                        isCurrent && 'text-teal-600',
                        isCompleted && 'text-green-600',
                        isFuture && 'text-gray-400'
                      )}
                    >
                      {step.title}
                    </p>
                    {step.isOptional && (
                      <span className="text-xs text-gray-400">(Optionnel)</span>
                    )}
                  </div>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 px-4">
                    <div
                      className={cn(
                        'h-0.5 transition-all duration-300',
                        index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Étape {currentStep + 1}/{steps.length}
          </span>
          <span className="text-sm font-medium text-teal-600">
            {steps[currentStep]?.title}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
        {/* Step Description */}
        {steps[currentStep]?.description && (
          <p className="mt-2 text-xs text-gray-500">
            {steps[currentStep].description}
          </p>
        )}
      </div>
    </>
  );
}
