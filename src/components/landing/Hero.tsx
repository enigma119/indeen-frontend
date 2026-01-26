'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, BookOpen, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background - Bleu clair doux */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-sky-50 to-white -z-10" />

      {/* Decorative curved shape at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white">
        <svg
          className="absolute bottom-full w-full h-24 text-white"
          viewBox="0 0 1440 96"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,96 C480,0 960,0 1440,96 L1440,96 L0,96 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-800 leading-tight"
            >
              Votre parcours d&apos;apprentissage du{' '}
              <span className="text-teal-500">Coran</span> commence ici
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-navy-600/80 max-w-lg leading-relaxed"
            >
              Commencez votre voyage d&apos;apprentissage coranique avec Indeen, une
              plateforme de confiance pour la récitation, le Tajweed et la
              compréhension du Coran pour tous.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-gray-50 text-navy-800 border border-navy-200 rounded-full px-8 shadow-sm"
              >
                <Link href="/inscription">Essai gratuit</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-navy-800 hover:bg-navy-900 text-white rounded-full px-8"
              >
                <Link href="/mentors">Explorer les cours</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right content - Image area with floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              {/* Main image placeholder */}
              <div className="relative bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl overflow-hidden h-full shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-12 h-12 text-white ml-1" />
                    </div>
                    <p className="text-white/80 text-sm">
                      Image d&apos;un étudiant
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating card - Rating */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -top-4 -right-8 bg-white rounded-2xl shadow-xl p-4 border border-sky-100"
              >
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-navy-800">5.0</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-accent-500 text-accent-500"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-navy-500 mt-1">
                      Approuvé par les élèves
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating card - Education info */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -bottom-4 -right-4 bg-navy-800 rounded-2xl shadow-xl p-4 max-w-[200px]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      Éducation coranique guidée
                    </p>
                    <p className="text-white/70 text-xs mt-1">
                      Connexion profonde avec le Livre d&apos;Allah
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative arrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="absolute top-1/4 -right-2"
              >
                <svg
                  width="60"
                  height="40"
                  viewBox="0 0 60 40"
                  fill="none"
                  className="text-accent-500"
                >
                  <path
                    d="M5 35 Q 30 5, 55 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M50 10 L 55 15 L 48 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
