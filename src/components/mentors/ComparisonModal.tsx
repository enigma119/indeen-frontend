'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Clock,
  Check,
  X,
  Trash2,
  Scale,
} from 'lucide-react';
import { useComparisonStore } from '@/stores/comparison-store';
import { SEARCH_LANGUAGES, SEARCH_SPECIALTIES } from '@/lib/constants/search';
import { cn } from '@/lib/utils';
import type { MentorProfile } from '@/types';

// Comparison criteria with labels
const COMPARISON_CRITERIA = [
  { key: 'photo', label: 'Photo & Nom' },
  { key: 'rating', label: 'Note moyenne' },
  { key: 'price', label: 'Prix/heure' },
  { key: 'experience', label: 'Expérience' },
  { key: 'languages', label: 'Langues' },
  { key: 'specialties', label: 'Spécialités' },
  { key: 'reviews', label: "Nombre d'avis" },
  { key: 'response', label: 'Réponse moyenne' },
  { key: 'trial', label: 'Essai gratuit' },
  { key: 'children', label: 'Enfants' },
  { key: 'teenagers', label: 'Adolescents' },
  { key: 'adults', label: 'Adultes' },
] as const;

type CriteriaKey = typeof COMPARISON_CRITERIA[number]['key'];

// Helper functions
const getLanguageLabel = (code: string) => {
  const lang = SEARCH_LANGUAGES.find((l) => l.value === code);
  return lang?.label || code;
};

const getSpecialtyLabel = (value: string) => {
  const specialty = SEARCH_SPECIALTIES.find((s) => s.value === value);
  return specialty?.label || value;
};

const formatCurrency = (amount: number, currency: string) => {
  const symbols: Record<string, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    MAD: 'DH',
    XOF: 'CFA',
  };
  return `${amount}${symbols[currency] || currency}`;
};

const formatResponseTime = (minutes?: number) => {
  if (!minutes) return '-';
  if (minutes < 60) return `< ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `< ${hours}h`;
};

// Render cell content based on criteria
function CellContent({ mentor, criteria }: { mentor: MentorProfile; criteria: CriteriaKey }) {
  const initials = mentor.user
    ? `${mentor.user.first_name[0]}${mentor.user.last_name[0]}`
    : 'M';
  const fullName = mentor.user
    ? `${mentor.user.first_name} ${mentor.user.last_name}`
    : 'Mentor';

  switch (criteria) {
    case 'photo':
      return (
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-16 w-16 border-2 border-gray-100">
            <AvatarImage src={mentor.user?.avatar_url} alt={fullName} />
            <AvatarFallback className="bg-teal-100 text-teal-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900 text-center text-sm">
            {fullName}
          </span>
        </div>
      );

    case 'rating':
      return (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{mentor.average_rating.toFixed(1)}</span>
        </div>
      );

    case 'price':
      return (
        <span className="font-semibold text-teal-600">
          {formatCurrency(mentor.hourly_rate, mentor.currency)}/h
        </span>
      );

    case 'experience':
      return (
        <span>
          {mentor.years_of_experience || 0} an{(mentor.years_of_experience || 0) > 1 ? 's' : ''}
        </span>
      );

    case 'languages':
      return (
        <div className="flex flex-wrap justify-center gap-1">
          {mentor.languages.slice(0, 3).map((lang) => (
            <Badge key={lang} variant="secondary" className="text-xs">
              {getLanguageLabel(lang)}
            </Badge>
          ))}
          {mentor.languages.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{mentor.languages.length - 3}
            </Badge>
          )}
        </div>
      );

    case 'specialties':
      return (
        <div className="flex flex-wrap justify-center gap-1">
          {mentor.specialties.slice(0, 2).map((spec) => (
            <Badge key={spec} variant="secondary" className="text-xs bg-purple-50 text-purple-700">
              {getSpecialtyLabel(spec)}
            </Badge>
          ))}
          {mentor.specialties.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{mentor.specialties.length - 2}
            </Badge>
          )}
        </div>
      );

    case 'reviews':
      return <span>{mentor.total_reviews} avis</span>;

    case 'response':
      return (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-gray-400" />
          <span>{formatResponseTime(mentor.average_response_time)}</span>
        </div>
      );

    case 'trial':
      return mentor.free_trial_available ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <X className="h-5 w-5 text-gray-300" />
      );

    case 'children':
      return mentor.teaches_children ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <X className="h-5 w-5 text-gray-300" />
      );

    case 'teenagers':
      return mentor.teaches_teenagers ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <X className="h-5 w-5 text-gray-300" />
      );

    case 'adults':
      return mentor.teaches_adults ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <X className="h-5 w-5 text-gray-300" />
      );

    default:
      return null;
  }
}

export function ComparisonModal() {
  const router = useRouter();
  const { mentors, isModalOpen, closeModal, removeMentor, clearAll } =
    useComparisonStore();

  const handleChoose = (mentor: MentorProfile) => {
    closeModal();
    router.push(`/mentors/${mentor.slug}`);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-teal-600" />
            Comparer les mentors
          </DialogTitle>
        </DialogHeader>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 bg-gray-50 p-3 text-left text-sm font-medium text-gray-500 border-b min-w-[140px]">
                  Critère
                </th>
                {mentors.map((mentor) => (
                  <th
                    key={mentor.id}
                    className="p-3 text-center text-sm font-medium text-gray-500 border-b min-w-[160px]"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMentor(mentor.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_CRITERIA.map((criteria, idx) => (
                <tr
                  key={criteria.key}
                  className={cn(idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}
                >
                  <td className="sticky left-0 bg-inherit p-3 text-sm font-medium text-gray-700 border-b">
                    {criteria.label}
                  </td>
                  {mentors.map((mentor) => (
                    <td
                      key={mentor.id}
                      className="p-3 text-center text-sm text-gray-600 border-b"
                    >
                      <div className="flex justify-center items-center">
                        <CellContent mentor={mentor} criteria={criteria.key} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              {/* Action row */}
              <tr>
                <td className="sticky left-0 bg-white p-3 text-sm font-medium text-gray-700">
                  Action
                </td>
                {mentors.map((mentor) => (
                  <td key={mentor.id} className="p-3 text-center">
                    <Button
                      onClick={() => handleChoose(mentor)}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Choisir
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={clearAll}>
            Tout effacer
          </Button>
          <Button variant="outline" onClick={closeModal}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
