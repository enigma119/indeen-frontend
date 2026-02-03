'use client';

import { Calendar, BookOpen, Users, Clock } from 'lucide-react';
import type { MentorProfile } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AboutSectionProps {
  mentor: MentorProfile;
}

export function AboutSection({ mentor }: AboutSectionProps) {
  const memberSince = mentor.createdAt
    ? formatDistanceToNow(new Date(mentor.createdAt), {
        addSuffix: false,
        locale: fr,
      })
    : null;

  const stats = [
    {
      icon: Clock,
      label: "Années d'expérience",
      value: mentor.yearsOfExperience || 0,
      suffix: mentor.yearsOfExperience === 1 ? 'an' : 'ans',
    },
    {
      icon: BookOpen,
      label: 'Sessions données',
      value: mentor.totalSessions || 0,
      suffix: '',
    },
    {
      icon: Users,
      label: 'Élèves formés',
      value: mentor.totalStudents || 0,
      suffix: '',
    },
  ];

  return (
    <section className="bg-white rounded-xl border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">À propos</h2>

      {/* Bio */}
      <div className="prose prose-gray max-w-none mb-6">
        {mentor.bio.split('\n').map((paragraph, index) => (
          <p key={index} className="text-gray-700 mb-3 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-teal-50 rounded-lg">
                <stat.icon className="h-5 w-5 text-teal-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stat.value}
              {stat.suffix && (
                <span className="text-base font-normal text-gray-500 ml-1">
                  {stat.suffix}
                </span>
              )}
            </p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}

        {/* Member Since */}
        {memberSince && (
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-teal-50 rounded-lg">
                <Calendar className="h-5 w-5 text-teal-600" />
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900">{memberSince}</p>
            <p className="text-sm text-gray-500">Membre depuis</p>
          </div>
        )}
      </div>
    </section>
  );
}
