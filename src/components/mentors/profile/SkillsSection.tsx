'use client';

import { Badge } from '@/components/ui/badge';
import { Languages, BookOpen, Users, GraduationCap, Check } from 'lucide-react';
import type { MentorProfile } from '@/types';
import { SEARCH_LANGUAGES, SEARCH_SPECIALTIES } from '@/lib/constants/search';

interface SkillsSectionProps {
  mentor: MentorProfile;
}

export function SkillsSection({ mentor }: SkillsSectionProps) {
  // Get language labels with flags
  const getLanguageInfo = (code: string) => {
    const lang = SEARCH_LANGUAGES.find((l) => l.value === code);
    return lang || { value: code, label: code, flag: '' };
  };

  // Get specialty labels with icons
  const getSpecialtyInfo = (value: string) => {
    const specialty = SEARCH_SPECIALTIES.find((s) => s.value === value);
    return specialty || { value, label: value, icon: '📖' };
  };

  // Student types
  const studentTypes = [
    { key: 'teaches_children', label: 'Enfants', icon: '👶', active: mentor.teaches_children },
    { key: 'teaches_teenagers', label: 'Adolescents', icon: '🧑‍🎓', active: mentor.teaches_teenagers },
    { key: 'teaches_adults', label: 'Adultes', icon: '👨', active: mentor.teaches_adults },
  ];

  // Teaching capabilities
  const capabilities = [
    { key: 'beginner_friendly', label: 'À l\'aise avec les débutants', active: mentor.beginner_friendly },
    { key: 'patient_with_slow_learners', label: 'Patient avec les apprenants lents', active: mentor.patient_with_slow_learners },
    { key: 'experienced_with_new_muslims', label: 'Expérience avec les nouveaux musulmans', active: mentor.experienced_with_new_muslims },
  ];

  const activeCapabilities = capabilities.filter((c) => c.active);

  return (
    <section className="bg-white rounded-xl border p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Compétences & Spécialités
      </h2>

      {/* Languages */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Languages className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Langues enseignées</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {mentor.languages.map((lang) => {
            const langInfo = getLanguageInfo(lang);
            const isNative = mentor.native_language === lang;
            return (
              <Badge
                key={lang}
                variant="secondary"
                className={
                  isNative
                    ? 'bg-teal-100 text-teal-800 font-semibold'
                    : 'bg-gray-100 text-gray-700'
                }
              >
                <span className="mr-1.5">{langInfo.flag}</span>
                {langInfo.label}
                {isNative && (
                  <span className="ml-1.5 text-xs">(natif)</span>
                )}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Specialties */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Spécialités</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {mentor.specialties.map((specialty) => {
            const specialtyInfo = getSpecialtyInfo(specialty);
            return (
              <Badge
                key={specialty}
                variant="secondary"
                className="bg-purple-50 text-purple-700"
              >
                <span className="mr-1.5">{specialtyInfo.icon}</span>
                {specialtyInfo.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Student Types */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Types d'élèves</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {studentTypes.map((type) => (
            <div
              key={type.key}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                type.active
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
              {type.active && <Check className="h-4 w-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Teaching Capabilities */}
      {activeCapabilities.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Capacités pédagogiques</h3>
          </div>
          <ul className="space-y-2">
            {activeCapabilities.map((capability) => (
              <li
                key={capability.key}
                className="flex items-center gap-2 text-gray-700"
              >
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>{capability.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Accepted Levels */}
      {mentor.accepted_levels && mentor.accepted_levels.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Niveaux acceptés</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {mentor.accepted_levels.map((level) => (
              <Badge
                key={level}
                variant="outline"
                className="border-gray-300 text-gray-700"
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
