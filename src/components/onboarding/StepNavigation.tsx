'use client';

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onSkip?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isLoading?: boolean;
  canProceed?: boolean;
  isOptional?: boolean;
}

export function StepNavigation({
  onPrevious,
  onNext,
  onSkip,
  isFirstStep,
  isLastStep,
  isLoading = false,
  canProceed = true,
  isOptional = false,
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
      {/* Previous Button */}
      <div>
        {!isFirstStep && (
          <Button
            type="button"
            variant="ghost"
            onClick={onPrevious}
            disabled={isLoading}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>
        )}
      </div>

      {/* Skip and Next Buttons */}
      <div className="flex items-center gap-3">
        {/* Skip Button (only for optional steps) */}
        {isOptional && onSkip && !isLastStep && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSkip}
            disabled={isLoading}
            className="text-gray-500"
          >
            Passer
          </Button>
        )}

        {/* Next/Finish Button */}
        <Button
          type="submit"
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className="gap-2 min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : isLastStep ? (
            'Terminer'
          ) : (
            <>
              Suivant
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
