'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Comment choisir un mentor ?',
    answer:
      "Utilisez nos filtres pour trouver un mentor qui parle votre langue, enseigne ce que vous souhaitez apprendre et correspond à votre budget. Consultez les avis d'autres élèves et réservez un essai gratuit si disponible.",
  },
  {
    question: 'Les sessions sont-elles enregistrées ?',
    answer:
      "Oui, avec l'accord des deux parties. Les enregistrements vous permettent de réviser et de progresser entre les sessions. Vous pouvez y accéder depuis votre espace personnel.",
  },
  {
    question: 'Puis-je annuler une session ?',
    answer:
      "Oui. Annulation gratuite jusqu'à 24h avant la session. Entre 24h et 2h avant : remboursement partiel (50%). Moins de 2h avant : pas de remboursement possible.",
  },
  {
    question: 'Comment fonctionne le paiement ?',
    answer:
      'Le paiement se fait en ligne par carte bancaire de manière sécurisée via Stripe. Le mentor reçoit son paiement après la session complétée. Toutes les transactions sont cryptées.',
  },
  {
    question: 'Les mentors sont-ils certifiés ?',
    answer:
      "Tous nos mentors sont vérifiés. Nous validons leurs certifications (Ijaza, diplômes), leur expérience et leur identité avant de les accepter sur la plateforme. Seuls les profils validés peuvent enseigner.",
  },
  {
    question: 'Puis-je changer de mentor ?',
    answer:
      "Absolument. Vous êtes libre de réserver avec différents mentors jusqu'à trouver celui qui vous convient le mieux. Il n'y a aucun engagement envers un mentor particulier.",
  },
  {
    question: "Que se passe-t-il si j'ai un problème technique ?",
    answer:
      'Notre support est disponible par email et répond sous 24h. Nous vous aidons à résoudre tout problème technique rapidement. En cas de problème pendant une session, un remboursement peut être accordé.',
  },
  {
    question: 'Y a-t-il une application mobile ?',
    answer:
      'La plateforme fonctionne parfaitement sur mobile via votre navigateur. Une application native iOS et Android est en cours de développement et sera disponible prochainement.',
  },
];

export function FAQ() {
  return (
    <section className="py-20 bg-sky-50/50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-navy-800 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-lg text-navy-600/70">
            Tout ce que vous devez savoir pour commencer
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-2xl border border-sky-100 px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left text-navy-800 font-semibold hover:text-teal-600 hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-navy-600/80 pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12 text-navy-600/70"
        >
          Vous avez d&apos;autres questions ?{' '}
          <a
            href="/contact"
            className="text-teal-600 hover:text-teal-700 font-medium underline"
          >
            Contactez-nous
          </a>
        </motion.p>
      </div>
    </section>
  );
}
