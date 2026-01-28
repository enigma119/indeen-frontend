import type { SortOption } from '@/types';

// ============================================
// SORT OPTIONS
// ============================================

export const SORT_OPTIONS: SortOption[] = [
  { value: 'rating', label: 'Mieux notés' },
  { value: 'reviews', label: "Plus d'avis" },
  { value: 'experience', label: "Plus d'expérience" },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
];

// ============================================
// LANGUAGES
// ============================================

export const SEARCH_LANGUAGES = [
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'ar', label: 'Arabe', flag: '🇸🇦' },
  { value: 'en', label: 'Anglais', flag: '🇬🇧' },
  { value: 'es', label: 'Espagnol', flag: '🇪🇸' },
  { value: 'de', label: 'Allemand', flag: '🇩🇪' },
  { value: 'tr', label: 'Turc', flag: '🇹🇷' },
  { value: 'ur', label: 'Ourdou', flag: '🇵🇰' },
] as const;

// ============================================
// SPECIALTIES
// ============================================

export const SEARCH_SPECIALTIES = [
  { value: 'TAJWEED', label: 'Tajweed', icon: '📖', description: 'Règles de récitation du Coran' },
  { value: 'HIFZ', label: 'Hifz (Mémorisation)', icon: '🧠', description: 'Mémorisation du Coran' },
  { value: 'FIQH', label: 'Fiqh', icon: '⚖️', description: 'Jurisprudence islamique' },
  { value: 'AQIDA', label: 'Aqida', icon: '☪️', description: 'Croyance islamique' },
  { value: 'TAFSIR', label: 'Tafsir', icon: '📚', description: 'Exégèse coranique' },
  { value: 'HADITH', label: 'Hadith', icon: '📜', description: 'Traditions prophétiques' },
  { value: 'ARABIC', label: 'Grammaire arabe', icon: '✍️', description: 'Langue arabe classique' },
  { value: 'SIRA', label: 'Sira', icon: '🕌', description: 'Biographie du Prophète' },
] as const;

// ============================================
// PRICE RANGES
// ============================================

export const PRICE_RANGES = [
  { min: 0, max: 0, label: 'Gratuit uniquement' },
  { min: 0, max: 20, label: 'Moins de 20€/h' },
  { min: 20, max: 40, label: '20€ - 40€/h' },
  { min: 40, max: 60, label: '40€ - 60€/h' },
  { min: 60, max: undefined, label: 'Plus de 60€/h' },
] as const;

// ============================================
// RATING OPTIONS
// ============================================

export const RATING_OPTIONS = [
  { value: 4.5, label: '4.5+ étoiles' },
  { value: 4, label: '4+ étoiles' },
  { value: 3.5, label: '3.5+ étoiles' },
  { value: 3, label: '3+ étoiles' },
] as const;

// ============================================
// STUDENT TYPE OPTIONS
// ============================================

export const STUDENT_TYPE_OPTIONS = [
  { value: 'teachesChildren', label: 'Enfants (< 13 ans)', icon: '👶' },
  { value: 'teachesTeenagers', label: 'Adolescents (13-17 ans)', icon: '🧑‍🎓' },
  { value: 'teachesAdults', label: 'Adultes (18+)', icon: '👨' },
] as const;

// ============================================
// SPECIAL FEATURES
// ============================================

export const SPECIAL_FEATURES = [
  { value: 'beginnerFriendly', label: 'Adapté aux débutants' },
  { value: 'experiencedWithNewMuslims', label: 'Expérience avec nouveaux musulmans' },
  { value: 'freeTrialAvailable', label: 'Essai gratuit disponible' },
  { value: 'freeSessionsOnly', label: 'Sessions gratuites uniquement' },
] as const;

// ============================================
// PAGINATION
// ============================================

export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;
