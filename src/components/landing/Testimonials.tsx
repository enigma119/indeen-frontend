'use client';

import { motion } from 'framer-motion';
import { TestimonialCard } from './TestimonialCard';

const testimonials = [
  {
    name: 'Fatima D.',
    location: 'Paris, France',
    rating: 5,
    text: "Grâce à mon mentor, j'ai appris à lire le Coran en 3 mois. Les sessions sont claires, pédagogiques et adaptées à mon rythme. Je recommande vivement !",
  },
  {
    name: 'Ahmed K.',
    location: 'Lyon, France',
    rating: 5,
    text: "Mon fils a trouvé un excellent professeur de Tajweed. Il a progressé rapidement et attend chaque cours avec impatience. Merci !",
  },
  {
    name: 'Sarah M.',
    location: 'Bruxelles, Belgique',
    rating: 5,
    text: "Convertie depuis peu, j'avais besoin d'un accompagnement bienveillant. J'ai trouvé une mentor patiente qui comprend mes besoins. Alhamdulillah !",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export function Testimonials() {
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
            Ce que disent nos élèves
          </h2>
          <p className="text-xl text-muted-foreground">
            Découvrez les témoignages de ceux qui ont transformé leur
            apprentissage grâce à notre plateforme.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <TestimonialCard
                name={testimonial.name}
                location={testimonial.location}
                rating={testimonial.rating}
                text={testimonial.text}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
