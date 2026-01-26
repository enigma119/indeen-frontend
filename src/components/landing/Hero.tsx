'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const stats = [
  { icon: Users, value: '500+', label: 'mentors certifiés' },
  { icon: BookOpen, value: '10,000+', label: 'sessions données' },
  { icon: Star, value: '4.9/5', label: 'étoiles' },
];

export function Hero() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950 -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border-0"
              >
                🎓 Plateforme n°1 d&apos;apprentissage coranique
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl lg:text-6xl font-bold text-foreground leading-tight"
            >
              Apprenez le Coran avec des{' '}
              <span className="text-primary-500">mentors qualifiés</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-lg"
            >
              Trouvez votre mentor idéal parmi des centaines de professeurs
              certifiés. Sessions en visioconférence, tarifs flexibles.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8"
              >
                <Link href="/mentors">Trouver un mentor</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/devenir-mentor">Devenir mentor</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-8 pt-4"
            >
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right content - Image placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-400 dark:from-primary-800 dark:to-primary-600 rounded-full opacity-20 blur-3xl" />

              {/* Placeholder image area */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex items-center justify-center aspect-square">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-12 h-12 text-primary-500" />
                  </div>
                  <p className="text-muted-foreground">
                    Image ou vidéo de présentation
                  </p>
                </div>
              </div>

              {/* Floating card 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-primary-200 rounded-full border-2 border-white" />
                    <div className="w-8 h-8 bg-primary-300 rounded-full border-2 border-white" />
                    <div className="w-8 h-8 bg-primary-400 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-sm font-medium">+500 mentors</span>
                </div>
              </motion.div>

              {/* Floating card 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">4.9/5 étoiles</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
