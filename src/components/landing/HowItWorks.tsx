'use client';

import { motion } from 'framer-motion';
import { Search, CalendarCheck, Video } from 'lucide-react';
import { StepCard } from './StepCard';

const steps = [
  {
    number: 1,
    icon: <Search className="w-8 h-8" />,
    title: 'Trouvez votre enseignant',
    description:
      'Parcourez les profils de nos enseignants certifiés, consultez leurs avis et choisissez celui qui correspond à vos besoins.',
  },
  {
    number: 2,
    icon: <CalendarCheck className="w-8 h-8" />,
    title: 'Réservez votre cours',
    description:
      'Sélectionnez un créneau disponible dans le calendrier et procédez au paiement sécurisé en quelques clics.',
  },
  {
    number: 3,
    icon: <Video className="w-8 h-8" />,
    title: 'Commencez à apprendre',
    description:
      'Rejoignez votre session en visioconférence directement depuis la plateforme et commencez votre apprentissage.',
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-navy-800 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-navy-600/70">
            Commencez votre apprentissage en 3 étapes simples
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative"
        >
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200" />

          {steps.map((step, index) => (
            <motion.div key={step.number} variants={itemVariants}>
              <StepCard
                number={step.number}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
