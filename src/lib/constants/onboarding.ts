import type {
  OnboardingStep,
  LearningLevel,
  LearningContext,
  LearningGoal,
  LearningPace,
  Specialty,
  Language,
  LearnerCategory,
} from '@/types/onboarding';

// Mentee Onboarding Steps
export const MENTEE_STEPS: OnboardingStep[] = [
  {
    id: 'personal-info',
    title: 'Informations personnelles',
    description: 'Présentez-vous en quelques mots',
    isOptional: false,
  },
  {
    id: 'learner-profile',
    title: 'Profil apprenant',
    description: 'Décrivez votre niveau et votre situation',
    isOptional: false,
  },
  {
    id: 'goals',
    title: 'Objectifs',
    description: 'Définissez vos objectifs d\'apprentissage',
    isOptional: false,
  },
  {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Vérifiez et confirmez vos informations',
    isOptional: false,
  },
];

// Mentor Onboarding Steps
export const MENTOR_STEPS: OnboardingStep[] = [
  {
    id: 'personal-info',
    title: 'Informations personnelles',
    description: 'Présentez-vous en quelques mots',
    isOptional: false,
  },
  {
    id: 'qualifications',
    title: 'Qualifications',
    description: 'Décrivez votre parcours et vos certifications',
    isOptional: false,
  },
  {
    id: 'skills',
    title: 'Compétences',
    description: 'Indiquez vos spécialités et langues',
    isOptional: false,
  },
  {
    id: 'pricing',
    title: 'Tarifs',
    description: 'Définissez vos tarifs horaires',
    isOptional: false,
  },
  {
    id: 'availability',
    title: 'Disponibilités',
    description: 'Configurez vos créneaux disponibles',
    isOptional: false,
  },
];

// Learning Levels
export const LEARNING_LEVELS: { value: LearningLevel; label: string; description: string }[] = [
  {
    value: 'NO_ARABIC',
    label: 'Pas d\'arabe',
    description: 'Je ne lis pas l\'arabe',
  },
  {
    value: 'ARABIC_BEGINNER',
    label: 'Arabe débutant',
    description: 'Je commence à lire l\'arabe',
  },
  {
    value: 'ARABIC_INTERMEDIATE',
    label: 'Arabe intermédiaire',
    description: 'Je lis l\'arabe avec quelques difficultés',
  },
  {
    value: 'ARABIC_ADVANCED',
    label: 'Arabe avancé',
    description: 'Je lis l\'arabe couramment',
  },
  {
    value: 'QURAN_BEGINNER',
    label: 'Coran débutant',
    description: 'Je commence l\'apprentissage du Coran',
  },
  {
    value: 'QURAN_INTERMEDIATE',
    label: 'Coran intermédiaire',
    description: 'J\'ai mémorisé quelques sourates',
  },
  {
    value: 'QURAN_ADVANCED',
    label: 'Coran avancé',
    description: 'J\'ai mémorisé une grande partie du Coran',
  },
];

// Learning Contexts
export const LEARNING_CONTEXTS: { value: LearningContext; label: string; description: string }[] = [
  {
    value: 'MEMORIZATION',
    label: 'Mémorisation',
    description: 'Je souhaite mémoriser le Coran',
  },
  {
    value: 'IMPROVEMENT',
    label: 'Perfectionnement',
    description: 'Je souhaite améliorer ma récitation',
  },
  {
    value: 'REVISION',
    label: 'Révision',
    description: 'Je souhaite réviser ce que j\'ai appris',
  },
  {
    value: 'CERTIFICATION',
    label: 'Certification',
    description: 'Je prépare une certification (Ijaza)',
  },
];

// Learning Goals
export const LEARNING_GOALS: { value: LearningGoal; label: string; icon?: string }[] = [
  {
    value: 'LEARN_ARABIC',
    label: 'Apprendre l\'arabe',
    icon: '📖',
  },
  {
    value: 'MEMORIZE_QURAN',
    label: 'Mémoriser le Coran',
    icon: '📚',
  },
  {
    value: 'IMPROVE_TAJWEED',
    label: 'Améliorer le Tajweed',
    icon: '🎤',
  },
  {
    value: 'UNDERSTAND_QURAN',
    label: 'Comprendre le Coran',
    icon: '💡',
  },
  {
    value: 'ISLAMIC_STUDIES',
    label: 'Études islamiques',
    icon: '🕌',
  },
  {
    value: 'PREPARE_CERTIFICATION',
    label: 'Préparer une certification',
    icon: '🎓',
  },
];

// Learning Paces
export const LEARNING_PACES: { value: LearningPace; label: string; description: string }[] = [
  {
    value: 'SLOW',
    label: 'Tranquille',
    description: '1-2 sessions par semaine',
  },
  {
    value: 'MODERATE',
    label: 'Modéré',
    description: '3-4 sessions par semaine',
  },
  {
    value: 'INTENSIVE',
    label: 'Intensif',
    description: '5+ sessions par semaine',
  },
];

// Specialties
export const SPECIALTIES: { value: Specialty; label: string; description: string }[] = [
  {
    value: 'TAJWEED',
    label: 'Tajweed',
    description: 'Règles de récitation du Coran',
  },
  {
    value: 'HIFZ',
    label: 'Hifz',
    description: 'Mémorisation du Coran',
  },
  {
    value: 'FIQH',
    label: 'Fiqh',
    description: 'Jurisprudence islamique',
  },
  {
    value: 'ARABIC',
    label: 'Arabe',
    description: 'Langue arabe classique et moderne',
  },
  {
    value: 'TAFSIR',
    label: 'Tafsir',
    description: 'Exégèse du Coran',
  },
  {
    value: 'SIRA',
    label: 'Sira',
    description: 'Biographie du Prophète',
  },
  {
    value: 'AQIDA',
    label: 'Aqida',
    description: 'Croyance islamique',
  },
  {
    value: 'HADITH',
    label: 'Hadith',
    description: 'Sciences du Hadith',
  },
];

// Languages
export const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'ar', label: 'Arabe', flag: '🇸🇦' },
  { value: 'en', label: 'Anglais', flag: '🇬🇧' },
  { value: 'es', label: 'Espagnol', flag: '🇪🇸' },
  { value: 'de', label: 'Allemand', flag: '🇩🇪' },
  { value: 'tr', label: 'Turc', flag: '🇹🇷' },
  { value: 'ur', label: 'Ourdou', flag: '🇵🇰' },
];

// Learner Categories
export const LEARNER_CATEGORIES: { value: LearnerCategory; label: string; description: string }[] = [
  {
    value: 'CHILD',
    label: 'Enfant',
    description: 'Moins de 13 ans',
  },
  {
    value: 'TEENAGER',
    label: 'Adolescent',
    description: '13-17 ans',
  },
  {
    value: 'ADULT',
    label: 'Adulte',
    description: '18 ans et plus',
  },
];

// Session Durations (in minutes)
export const SESSION_DURATIONS = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 heure' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2 heures' },
];

// Currencies
export const CURRENCIES = [
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'USD', label: 'Dollar ($)', symbol: '$' },
  { value: 'GBP', label: 'Livre (£)', symbol: '£' },
  { value: 'MAD', label: 'Dirham (DH)', symbol: 'DH' },
  { value: 'TND', label: 'Dinar (DT)', symbol: 'DT' },
  { value: 'DZD', label: 'Dinar (DA)', symbol: 'DA' },
];

// Days of Week
export const DAYS_OF_WEEK = [
  { value: 'MONDAY', label: 'Lundi', shortLabel: 'Lun' },
  { value: 'TUESDAY', label: 'Mardi', shortLabel: 'Mar' },
  { value: 'WEDNESDAY', label: 'Mercredi', shortLabel: 'Mer' },
  { value: 'THURSDAY', label: 'Jeudi', shortLabel: 'Jeu' },
  { value: 'FRIDAY', label: 'Vendredi', shortLabel: 'Ven' },
  { value: 'SATURDAY', label: 'Samedi', shortLabel: 'Sam' },
  { value: 'SUNDAY', label: 'Dimanche', shortLabel: 'Dim' },
];
