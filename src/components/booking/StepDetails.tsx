'use client';

import { useBookingStore } from '@/stores/booking-store';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Globe,
  Calendar,
  Clock,
  Edit3,
  Info,
  Mail,
  Video,
  XCircle,
} from 'lucide-react';
import { formatPrice, calculatePrice } from '@/stores/booking-store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

const MAX_LESSON_PLAN_LENGTH = 500;

interface InfoItemProps {
  icon: React.ReactNode;
  text: string;
}

function InfoItem({ icon, text }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="text-teal-600 mt-0.5">{icon}</span>
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
}

export function StepDetails() {
  const {
    mentor,
    selectedSlot,
    duration,
    lessonPlan,
    timezone,
    setLessonPlan,
    setTimezone,
    goToStep,
  } = useBookingStore();

  if (!mentor || !selectedSlot) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Veuillez d'abord sélectionner un créneau</p>
        <Button variant="outline" className="mt-4" onClick={() => goToStep(1)}>
          Retour à la sélection
        </Button>
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

  const sessionDate = new Date(selectedSlot.date);
  const formattedDate = format(sessionDate, "EEEE d MMMM yyyy", { locale: fr });

  // Calculate end time
  const [startHour, startMin] = selectedSlot.start_time.split(':').map(Number);
  const endDate = new Date(sessionDate);
  endDate.setHours(startHour, startMin + duration);
  const endTime = format(endDate, 'HH:mm');

  const remainingChars = MAX_LESSON_PLAN_LENGTH - (lessonPlan?.length || 0);

  return (
    <div className="space-y-6">
      {/* Section 1: Récapitulatif Créneau */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              Récapitulatif du créneau
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToStep(1)}
              className="text-teal-600 hover:text-teal-700"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Modifier
            </Button>
          </div>
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
                  <p className="font-medium capitalize">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Horaire</p>
                  <p className="font-medium">
                    {selectedSlot.start_time} - {endTime}
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

      {/* Section 2: Timezone Selection */}
      <Card>
        <CardHeader className="pb-4">
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

      {/* Section 3: Lesson Plan */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600" />
            Que souhaitez-vous apprendre ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="lessonPlan" className="text-gray-600">
              Plan de la session (optionnel)
            </Label>
            <Textarea
              id="lessonPlan"
              value={lessonPlan}
              onChange={(e) => {
                if (e.target.value.length <= MAX_LESSON_PLAN_LENGTH) {
                  setLessonPlan(e.target.value);
                }
              }}
              placeholder="Ex: Je veux travailler sur la sourate Al-Fatiha et améliorer ma prononciation des lettres. J'aimerais aussi réviser les règles de tajweed que nous avons vues..."
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Ceci aidera votre mentor à préparer la session
              </p>
              <p
                className={`text-sm ${
                  remainingChars < 50 ? 'text-orange-500' : 'text-gray-400'
                }`}
              >
                {remainingChars} caractères restants
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Important Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-blue-900">
            <Info className="h-5 w-5" />
            Informations importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-blue-100">
            <InfoItem
              icon={<Clock className="h-4 w-4" />}
              text="Le mentor confirmera votre réservation sous 24h"
            />
            <InfoItem
              icon={<Mail className="h-4 w-4" />}
              text="Vous recevrez un email de confirmation avec tous les détails"
            />
            <InfoItem
              icon={<Video className="h-4 w-4" />}
              text="Le lien de visioconférence sera envoyé 15 minutes avant la session"
            />
            <InfoItem
              icon={<XCircle className="h-4 w-4" />}
              text="Annulation gratuite jusqu'à 24h avant la session"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
