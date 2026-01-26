'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-teal-500 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4">
                <BookOpen className="w-24 h-24" />
              </div>
              <div className="absolute bottom-4 right-4">
                <BookOpen className="w-32 h-32" />
              </div>
            </div>

            <div className="relative z-10">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Prêt à commencer votre apprentissage ?
              </h2>

              {/* Subtitle */}
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d&apos;élèves et commencez votre parcours
                d&apos;apprentissage du Coran dès aujourd&apos;hui.
              </p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-teal-600 hover:bg-gray-100 rounded-full px-10 py-6 text-lg font-semibold shadow-lg"
                >
                  <Link href="/inscription" className="flex items-center gap-2">
                    S&apos;inscrire maintenant
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>

              {/* Small text */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 text-white/80 text-sm"
              >
                Essai gratuit • Sans engagement • Annulation facile
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
