'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Heart,
  Users,
  HeadphonesIcon,
  CheckCircle,
  ArrowRight,
  BookOpen,
  FileCheck,
  GraduationCap,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const advantages = [
  {
    icon: <DollarSign className="w-7 h-7" />,
    title: 'Revenus flexibles',
    description: 'Fixez vos propres tarifs et horaires. Gagnez selon votre disponibilité.',
  },
  {
    icon: <Heart className="w-7 h-7" />,
    title: 'Impact positif',
    description: "Transmettez votre savoir et aidez des élèves à se rapprocher du Coran.",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: 'Communauté',
    description: 'Rejoignez des centaines de mentors passionnés à travers le monde.',
  },
  {
    icon: <HeadphonesIcon className="w-7 h-7" />,
    title: 'Support dédié',
    description: 'Une équipe disponible pour vous accompagner dans votre parcours.',
  },
];

const requirements = [
  'Certification ou Ijaza en Tajweed/Hifz',
  "Minimum 2 ans d'expérience dans l'enseignement",
  'Maîtrise du français ou de l\'arabe',
  'Connexion internet stable et webcam',
  'Disponibilité d\'au moins 5 heures par semaine',
];

const steps = [
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: 'Postulez en ligne',
    description: 'Remplissez le formulaire en 5 minutes',
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: 'Vérification',
    description: 'Nous vérifions vos documents sous 48h',
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: 'Formation',
    description: 'Formation optionnelle à la plateforme',
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Commencez',
    description: 'Publiez votre profil et recevez des réservations',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DevenirMentorPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white space-y-8"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Partagez votre savoir,{' '}
                <span className="text-teal-400">gagnez un revenu</span>
              </h1>
              <p className="text-xl text-white/80 max-w-lg">
                Rejoignez notre communauté de mentors certifiés et aidez des
                élèves du monde entier à apprendre le Coran.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-10"
              >
                <Link href="/inscription?role=MENTOR">
                  Postuler maintenant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl p-12 flex items-center justify-center aspect-square max-w-md mx-auto">
                  <div className="text-center text-white">
                    <BookOpen className="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <p className="text-white/70">Illustration mentor</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-bold text-navy-800">500+</p>
                      <p className="text-sm text-navy-500">Mentors actifs</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-800 mb-4">
              Pourquoi devenir mentor ?
            </h2>
            <p className="text-lg text-navy-600/70">
              Des avantages concrets pour vous accompagner dans votre mission
              d&apos;enseignement.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {advantages.map((advantage, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-6 h-full bg-sky-50/50 border-sky-100 rounded-2xl text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-teal-600">
                    {advantage.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-navy-800 mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-navy-600/70 text-sm">
                    {advantage.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-sky-50/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-800 mb-6">
                Prérequis pour devenir mentor
              </h2>
              <p className="text-lg text-navy-600/70 mb-8">
                Nous recherchons des enseignants passionnés et qualifiés pour
                rejoindre notre communauté.
              </p>
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-navy-700">{req}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-navy-800 mb-6">
                Processus de candidature
              </h3>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-teal-600">
                          Étape {index + 1}
                        </span>
                      </div>
                      <h4 className="font-semibold text-navy-800">
                        {step.title}
                      </h4>
                      <p className="text-sm text-navy-600/70">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-500">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Prêt à rejoindre notre communauté ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Commencez à enseigner et à impacter positivement la vie de vos
              élèves dès aujourd&apos;hui.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-teal-600 hover:bg-gray-100 rounded-full px-10 py-6 text-lg font-semibold"
            >
              <Link href="/inscription?role=MENTOR">
                Devenir mentor
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
