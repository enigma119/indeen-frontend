'use client';

import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-6 bg-white hover:shadow-xl transition-all duration-300 border border-sky-100 rounded-2xl group">
      <div className="w-14 h-14 bg-sky-50 group-hover:bg-teal-50 rounded-xl flex items-center justify-center mb-5 text-teal-600 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-3 text-navy-800">{title}</h3>
      <p className="text-navy-600/70 text-sm leading-relaxed">{description}</p>
    </Card>
  );
}
