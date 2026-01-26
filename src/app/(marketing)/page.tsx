import { Hero } from '@/components/landing/Hero';
import { Stats } from '@/components/landing/Stats';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Testimonials } from '@/components/landing/Testimonials';
import { FinalCTA } from '@/components/landing/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
