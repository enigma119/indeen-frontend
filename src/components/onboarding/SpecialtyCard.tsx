'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import type { Specialty } from '@/types/onboarding';
import { SPECIALTIES } from '@/lib/constants/onboarding';

// Icon mapping for specialties
const specialtyIcons: Record<Specialty, string> = {
  TAJWEED: '🎤',
  HIFZ: '📚',
  FIQH: '⚖️',
  ARABIC: '📖',
  TAFSIR: '💡',
  SIRA: '📜',
  AQIDA: '🕌',
  HADITH: '📿',
};

interface SpecialtyCardProps {
  specialty: Specialty;
  isSelected: boolean;
  onToggle: (specialty: Specialty) => void;
  disabled?: boolean;
}

export function SpecialtyCard({
  specialty,
  isSelected,
  onToggle,
  disabled = false,
}: SpecialtyCardProps) {
  const specialtyData = SPECIALTIES.find((s) => s.value === specialty);

  if (!specialtyData) {
    return null;
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected
          ? 'border-teal-500 bg-teal-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => !disabled && onToggle(specialty)}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="text-2xl shrink-0">{specialtyIcons[specialty]}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{specialtyData.label}</h4>
              {isSelected && (
                <div className="shrink-0 ml-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">{specialtyData.description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
