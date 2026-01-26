'use client';

import { motion } from 'framer-motion';
import { Search, Calendar, Video } from 'lucide-react';
import { StepCard } from './StepCard';

const steps = [
  {
    number: 1,
    icon: <Search className="w-6 h-6" />,
    title: 'Trouvez votre mentor',
    description:
      'Parcourez les profils, filtrez par langue, spécialité et tarif. Consultez les avis et choisissez le mentor qui vous correspond.',
    direction: 'left' as const,
  },
  {
    number: 2,
    icon: <Calendar className="w-6 h-6" />,
    title: 'Réservez votre session',
    description:
      'Sélectionnez un créneau disponible dans le calendrier de votre mentor. Paiement sécurisé en ligne.',
    direction: 'right' as const,
  },
  {
    number: 3,
    icon: <Video className="w-6 h-6" />,
    title: 'Apprenez en visioconférence',
    description:
      'Rejoignez la session directement depuis la plateforme. Enregistrements et suivi de progression inclus.',
    direction: 'left' as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function HowItWorks() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
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
            Comment ça marche ?
          </h2>
          <p className="text-xl text-muted-foreground">
            Commencez votre apprentissage en 3 étapes simples
          </p>
        </motion.div>

        {/* Steps timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Desktop timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary-200 dark:bg-primary-800 h-full" />

          <div className="relative space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative"
              >
                {/* Connector line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-1/2 top-16 transform -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-primary-500 to-primary-200 dark:to-primary-800" />
                )}
                <StepCard
                  number={step.number}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  direction={step.direction}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
