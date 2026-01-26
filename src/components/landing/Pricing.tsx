'use client';

import { motion } from 'framer-motion';
import { DollarSign, XCircle, Gift, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const pricingFeatures = [
  {
    icon: <DollarSign className="w-7 h-7" />,
    title: '15€ à 50€/heure',
    description:
      'Chaque mentor fixe son tarif. Vous choisissez selon votre budget et vos besoins.',
  },
  {
    icon: <XCircle className="w-7 h-7" />,
    title: "Pas d'abonnement",
    description:
      'Payez uniquement les sessions que vous réservez. Aucun engagement, aucun frais cachés.',
  },
  {
    icon: <Gift className="w-7 h-7" />,
    title: 'Essai gratuit disponible',
    description:
      'De nombreux mentors proposent une première session gratuite de 30 minutes.',
  },
];

const pricingTable = [
  { duration: '30 min', price: '10-20€' },
  { duration: '60 min', price: '20-40€' },
  { duration: '90 min', price: '30-60€' },
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

export function Pricing() {
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
            Tarification transparente
          </h2>
          <p className="text-lg text-navy-600/70">
            Choisissez votre mentor selon votre budget. Pas de surprises, pas
            d&apos;abonnement.
          </p>
        </motion.div>

        {/* Pricing features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {pricingFeatures.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-6 h-full bg-sky-50/50 border-sky-100 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-teal-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-navy-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-navy-600/70">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto mb-12"
        >
          <Card className="overflow-hidden rounded-2xl border-sky-100">
            <div className="bg-navy-800 text-white p-4 text-center">
              <h3 className="font-semibold">Tarifs moyens indicatifs</h3>
            </div>
            <div className="divide-y divide-sky-100">
              {pricingTable.map((row, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 hover:bg-sky-50/50 transition-colors"
                >
                  <span className="text-navy-700 font-medium">
                    {row.duration}
                  </span>
                  <span className="text-teal-600 font-bold">{row.price}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Commission note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-sky-50 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-navy-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-navy-800 text-white hover:bg-navy-700">
                  Commission 15%
                </Badge>
              </div>
              <p className="text-navy-600/80 text-sm">
                La plateforme prélève une commission de 15% sur chaque session
                pour assurer la qualité du service, le support technique et la
                sécurité des paiements.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
