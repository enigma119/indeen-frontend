'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Video,
  Target,
  DollarSign,
  Calendar,
  Lock,
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Mentors vérifiés',
    description:
      'Tous nos mentors sont certifiés et vérifiés. Ijaza, diplômes et expérience validés.',
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: 'Sessions en ligne',
    description:
      'Apprenez depuis chez vous en visioconférence haute qualité. Enregistrements disponibles.',
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Progression suivie',
    description:
      'Suivez votre progression avec des tableaux de bord détaillés et des rappels de révision.',
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: 'Prix flexibles',
    description:
      'Choisissez votre mentor selon votre budget. De 15€ à 50€/heure. Essai gratuit disponible.',
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Horaires flexibles',
    description:
      'Réservez aux horaires qui vous conviennent. Mentors disponibles 7 jours sur 7.',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Paiements sécurisés',
    description:
      'Transactions cryptées via Stripe. Remboursement garanti en cas d\'annulation.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Features() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Pourquoi choisir notre plateforme ?
          </h2>
          <p className="text-xl text-muted-foreground">
            Une expérience d&apos;apprentissage complète et sécurisée pour vous
            accompagner dans votre parcours spirituel.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
