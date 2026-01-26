'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '3K+', label: 'Élèves dans le monde' },
  { value: '400+', label: 'Sessions en direct' },
  { value: '50+', label: 'Instructeurs certifiés' },
];

export function Stats() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:max-w-md"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-navy-800 mb-4">
              Votre plateforme de confiance pour l&apos;apprentissage du Coran.
            </h2>
            <p className="text-navy-600/70">
              Du débutant à l&apos;avancé, apprenez à lire, réciter et comprendre le
              Coran avec des professeurs experts.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-12 lg:gap-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-bold text-navy-800 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-navy-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
