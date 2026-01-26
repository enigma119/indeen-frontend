'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  Video,
  Users,
  Award,
  Globe,
  HeadphonesIcon,
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    icon: <Clock className="w-7 h-7" />,
    title: 'Horaires flexibles',
    description:
      'Choisissez l\'horaire qui vous convient et connectez-vous avec des enseignants qualifiés en ligne, où que vous soyez.',
  },
  {
    icon: <Video className="w-7 h-7" />,
    title: 'Cours en direct et enregistrés',
    description:
      'Accédez à des sessions en direct interactives ou révisez avec des cours enregistrés à votre rythme.',
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: 'Enseignants experts',
    description:
      'Apprenez avec des professeurs certifiés ayant une Ijaza et des années d\'expérience dans l\'enseignement coranique.',
  },
  {
    icon: <Award className="w-7 h-7" />,
    title: 'Apprentissage personnalisé',
    description:
      'Des parcours adaptés à votre niveau, que vous soyez débutant ou que vous cherchiez à perfectionner votre Tajweed.',
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: 'Accessible partout',
    description:
      'Apprenez depuis n\'importe quel appareil, n\'importe où dans le monde, avec une connexion internet.',
  },
  {
    icon: <HeadphonesIcon className="w-7 h-7" />,
    title: 'Support dédié',
    description:
      'Une équipe disponible pour vous accompagner dans votre parcours d\'apprentissage du début à la fin.',
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
    <section className="py-20 bg-sky-50/50">
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
            Apprendre le Coran en ligne avec flexibilité
          </h2>
          <p className="text-lg text-navy-600/70">
            Avec Indeen, l&apos;apprentissage du Coran devient simple et flexible.
            Choisissez l&apos;horaire qui vous convient et connectez-vous avec des
            enseignants qualifiés.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
