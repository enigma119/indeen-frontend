'use client';

import { Award, ExternalLink, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MentorProfile, Certification } from '@/types';

interface QualificationsSectionProps {
  mentor: MentorProfile;
}

function CertificationCard({ certification }: { certification: Certification }) {
  return (
    <Card className="bg-gray-50 border-0">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Award className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900">{certification.name}</h4>
            <p className="text-sm text-gray-600">{certification.type}</p>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              {certification.institution && (
                <span>{certification.institution}</span>
              )}
              {certification.institution && certification.year && (
                <span>•</span>
              )}
              {certification.year && <span>{certification.year}</span>}
            </div>
            {certification.document_url && (
              <Button
                variant="link"
                size="sm"
                asChild
                className="h-auto p-0 mt-2 text-teal-600"
              >
                <a
                  href={certification.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Voir le justificatif
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QualificationsSection({ mentor }: QualificationsSectionProps) {
  const hasCertifications =
    mentor.certifications && mentor.certifications.length > 0;
  const hasAcademicBackground = mentor.academic_background;

  if (!hasCertifications && !hasAcademicBackground) {
    return null;
  }

  return (
    <section className="bg-white rounded-xl border p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Qualifications</h2>

      {/* Certifications */}
      {hasCertifications && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Certifications</h3>
          </div>
          <div className="grid gap-3">
            {mentor.certifications!.map((cert, index) => (
              <CertificationCard key={cert.id || index} certification={cert} />
            ))}
          </div>
        </div>
      )}

      {/* Academic Background */}
      {hasAcademicBackground && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Formation académique</h3>
          </div>
          <div className="prose prose-gray max-w-none">
            {mentor.academic_background!.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
