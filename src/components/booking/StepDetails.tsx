'use client';

import { useBookingStore } from '@/stores/booking-store';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Globe, User } from 'lucide-react';
import { formatPrice, calculatePrice } from '@/stores/booking-store';

const TIMEZONES = [
  { value: 'Europe/Paris', label: 'Paris (UTC+1)' },
  { value: 'Europe/London', label: 'Londres (UTC+0)' },
  { value: 'America/New_York', label: 'New York (UTC-5)' },
  { value: 'Africa/Casablanca', label: 'Casablanca (UTC+0)' },
  { value: 'Africa/Algiers', label: 'Alger (UTC+1)' },
  { value: 'Africa/Tunis', label: 'Tunis (UTC+1)' },
  { value: 'Asia/Dubai', label: 'Dubai (UTC+4)' },
  { value: 'Asia/Riyadh', label: 'Riyad (UTC+3)' },
];

export function StepDetails() {
  const {
    mentor,
    selectedSlot,
    duration,
    lessonPlan,
    timezone,
    setLessonPlan,
    setTimezone,
  } = useBookingStore();

  if (!mentor || !selectedSlot) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Veuillez d'abord sélectionner un créneau</p>
      </div>
    );
  }

  const price = calculatePrice(mentor.hourly_rate, duration);
  const mentorName = mentor.user
    ? `${mentor.user.first_name} ${mentor.user.last_name}`
    : 'Mentor';
  const initials = mentor.user
    ? `${mentor.user.first_name[0]}${mentor.user.last_name[0]}`
    : 'M';

  return (
    <div className="space-y-6">
      {/* Session Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-teal-600" />
            Récapitulatif de la session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mentor.user?.avatar_url} alt={mentorName} />
              <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{mentorName}</h3>
              <p className="text-sm text-gray-500">{mentor.headline}</p>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(selectedSlot.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Heure</p>
                  <p className="font-medium">
                    {selectedSlot.start_time} - {selectedSlot.end_time}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Durée</p>
                  <p className="font-medium">{duration} minutes</p>
                </div>
                <div>
                  <p className="text-gray-500">Prix</p>
                  <p className="font-medium text-teal-600">
                    {formatPrice(price, mentor.currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timezone Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-teal-600" />
            Fuseau horaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre fuseau horaire" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-2">
            Les horaires seront affichés selon ce fuseau horaire
          </p>
        </CardContent>
      </Card>

      {/* Lesson Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600" />
            Plan de la session (optionnel)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="lessonPlan">
              Décrivez vos objectifs pour cette session
            </Label>
            <Textarea
              id="lessonPlan"
              value={lessonPlan}
              onChange={(e) => setLessonPlan(e.target.value)}
              placeholder="Ex: Je souhaite travailler sur la prononciation des lettres arabes, réviser la sourate Al-Fatiha..."
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              Cela aidera votre mentor à préparer la session
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
