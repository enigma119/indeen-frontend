'use client';

import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
}

export function TestimonialCard({
  name,
  location,
  rating,
  text,
  avatar,
}: TestimonialCardProps) {
  return (
    <Card className="p-6 h-full flex flex-col bg-white border border-sky-100 rounded-2xl hover:shadow-lg transition-shadow">
      {/* Quote icon */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-teal-500/30" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'fill-accent-500 text-accent-500'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-navy-700 mb-6 flex-1 leading-relaxed">{text}</p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-sky-100">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
            {name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-navy-800">{name}</p>
          <p className="text-sm text-navy-500">{location}</p>
        </div>
      </div>
    </Card>
  );
}
