'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check } from 'lucide-react';
import { MentorHeader } from './MentorHeader';
import { AboutSection } from './AboutSection';
import { SkillsSection } from './SkillsSection';
import { QualificationsSection } from './QualificationsSection';
import { ReviewsSection } from './ReviewsSection';
import { BookingCard } from './BookingCard';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { ReportDialog } from './ReportDialog';
import type { MentorProfile as MentorProfileType } from '@/types';

interface MentorProfileProps {
  mentor: MentorProfileType;
}

export function MentorProfile({ mentor }: MentorProfileProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-6">
        <MentorHeader mentor={mentor} />
        <AboutSection mentor={mentor} />
        <SkillsSection mentor={mentor} />
        <QualificationsSection mentor={mentor} />
        <ReviewsSection mentor={mentor} />

        {/* Secondary Actions */}
        <div className="flex items-center justify-center gap-4 py-6 border-t">
          <ReportDialog mentorId={mentor.id} />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-gray-500 gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Lien copié !</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Partager
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-80 flex-shrink-0">
        <div className="sticky top-8 space-y-4">
          <BookingCard mentor={mentor} />
          <AvailabilityCalendar mentorId={mentor.id} />
        </div>
      </aside>

      {/* Mobile Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 lg:hidden z-50">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">À partir de</p>
            <p className="text-xl font-bold text-gray-900">
              {mentor.hourlyRate}
              {mentor.currency === 'EUR' ? '€' : mentor.currency}/h
            </p>
          </div>
          <Button
            onClick={() => window.location.href = `/sessions/new?mentorId=${mentor.id}`}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Réserver
          </Button>
        </div>
      </div>
    </div>
  );
}
