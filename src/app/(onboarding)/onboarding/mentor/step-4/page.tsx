'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMentorOnboardingStore } from '@/stores/mentor-onboarding-store';
import { mentorStep4BaseSchema, type MentorStep4BaseData } from '@/lib/validations/onboarding';
import { FormSection, StepNavigation, PricingEstimator } from '@/components/onboarding';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, Heart, Info, TrendingUp } from 'lucide-react';
import { CURRENCIES, SESSION_DURATIONS } from '@/lib/constants/onboarding';
import { cn } from '@/lib/utils';

const FREE_TRIAL_DURATIONS = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
];

export default function MentorStep4Page() {
  const router = useRouter();
  const { data, updateData } = useMentorOnboardingStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<MentorStep4BaseData>({
    resolver: zodResolver(mentorStep4BaseSchema),
    mode: 'onChange',
    defaultValues: {
      freeSessionsOnly: data.freeSessionsOnly || false,
      hourlyRate: data.hourlyRate,
      currency: (data.currency || 'EUR') as 'EUR' | 'USD' | 'GBP' | 'MAD' | 'TND' | 'DZD',
      freeTrialAvailable: data.freeTrialAvailable || false,
      freeTrialDuration: data.freeTrialDuration,
      minSessionDuration: data.minSessionDuration || 30,
      maxSessionDuration: data.maxSessionDuration || 60,
      maxStudentsPerWeek: data.maxStudentsPerWeek || 20,
    },
  });

  const watchedFields = watch();
  const isFreeSessionsOnly = watchedFields.freeSessionsOnly;
  const showPricingFields = !isFreeSessionsOnly;

  // Auto-save to store on change
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateData(watchedFields);
    }, 300);
    return () => clearTimeout(timeout);
  }, [watchedFields, updateData]);

  const onSubmit = (formData: MentorStep4BaseData) => {
    updateData(formData);
    router.push('/onboarding/mentor/step-5');
  };

  const handlePrevious = () => {
    router.push('/onboarding/mentor/step-3');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Tarification"
        description="Définissez vos tarifs et conditions"
      >
        <div className="space-y-8">
          {/* Section 1: Pricing Mode */}
          <div className="space-y-4">
            <Label>
              Mode de tarification <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={isFreeSessionsOnly ? 'free' : 'paid'}
              onValueChange={(value) => {
                const isFree = value === 'free';
                setValue('freeSessionsOnly', isFree, { shouldValidate: true });
                if (isFree) {
                  setValue('hourlyRate', undefined);
                  setValue('currency', undefined);
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Option 1: Paid */}
              <div>
                <RadioGroupItem
                  value="paid"
                  id="pricing-paid"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="pricing-paid"
                  className={cn(
                    'flex flex-col items-center justify-between rounded-lg border-2 p-6 cursor-pointer transition-all',
                    !isFreeSessionsOnly
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <DollarSign className="h-8 w-8 mb-3 text-teal-600" />
                  <span className="font-semibold text-lg mb-1">
                    Je facture mes sessions
                  </span>
                  <span className="text-sm text-gray-600 text-center">
                    Fixez votre tarif horaire
                  </span>
                </Label>
              </div>

              {/* Option 2: Free */}
              <div>
                <RadioGroupItem
                  value="free"
                  id="pricing-free"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="pricing-free"
                  className={cn(
                    'flex flex-col items-center justify-between rounded-lg border-2 p-6 cursor-pointer transition-all',
                    isFreeSessionsOnly
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <Heart className="h-8 w-8 mb-3 text-teal-600" />
                  <span className="font-semibold text-lg mb-1">
                    Sessions gratuites uniquement
                  </span>
                  <span className="text-sm text-gray-600 text-center">
                    Bénévolat (sadaqa)
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Section 2a: Hourly Rate (if paid) */}
          {showPricingFields && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hourly Rate */}
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">
                    Tarif horaire <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="5"
                    max="200"
                    placeholder="30"
                    {...register('hourlyRate', { valueAsNumber: true })}
                    className={errors.hourlyRate ? 'border-red-500' : ''}
                  />
                  {errors.hourlyRate && (
                    <p className="text-sm text-red-500">{errors.hourlyRate.message}</p>
                  )}
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <Label htmlFor="currency">
                    Devise <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watchedFields.currency}
                    onValueChange={(value) =>
                      setValue('currency', value as MentorStep4BaseData['currency'], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger
                      id="currency"
                      className={errors.currency ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder="Sélectionnez une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.currency && (
                    <p className="text-sm text-red-500">{errors.currency.message}</p>
                  )}
                </div>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Tarifs moyens sur la plateforme : 20-40€/h
                </AlertDescription>
              </Alert>

              {/* Pricing Estimator */}
              {watchedFields.hourlyRate && watchedFields.hourlyRate > 0 && (
                <PricingEstimator
                  hourlyRate={watchedFields.hourlyRate}
                  currency={watchedFields.currency}
                />
              )}

              {/* Section 2b: Free Trial */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="freeTrialAvailable"
                    checked={watchedFields.freeTrialAvailable}
                    onCheckedChange={(checked) => {
                      setValue('freeTrialAvailable', checked === true, {
                        shouldValidate: true,
                      });
                      if (!checked) {
                        setValue('freeTrialDuration', undefined);
                      }
                    }}
                  />
                  <Label htmlFor="freeTrialAvailable" className="cursor-pointer font-medium">
                    Je propose un essai gratuit
                  </Label>
                </div>

                {watchedFields.freeTrialAvailable && (
                  <div className="space-y-2 pl-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="freeTrialDuration">
                      Durée de l'essai <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={watchedFields.freeTrialDuration?.toString()}
                      onValueChange={(value) =>
                        setValue('freeTrialDuration', parseInt(value, 10), {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger
                        id="freeTrialDuration"
                        className={errors.freeTrialDuration ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Sélectionnez la durée" />
                      </SelectTrigger>
                      <SelectContent>
                        {FREE_TRIAL_DURATIONS.map((duration) => (
                          <SelectItem key={duration.value} value={duration.value.toString()}>
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.freeTrialDuration && (
                      <p className="text-sm text-red-500">
                        {errors.freeTrialDuration.message}
                      </p>
                    )}
                    <Alert className="border-green-200 bg-green-50">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 text-sm">
                        Augmentez vos chances d'avoir des élèves !
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 3: Session Duration */}
          <div className="space-y-4">
            <Label>Durée de session</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minSessionDuration">
                  Durée minimale <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watchedFields.minSessionDuration?.toString()}
                  onValueChange={(value) =>
                    setValue('minSessionDuration', parseInt(value, 10), {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger
                    id="minSessionDuration"
                    className={errors.minSessionDuration ? 'border-red-500' : ''}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_DURATIONS.filter((d) => d.value <= 60).map((duration) => (
                      <SelectItem key={duration.value} value={duration.value.toString()}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.minSessionDuration && (
                  <p className="text-sm text-red-500">{errors.minSessionDuration.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSessionDuration">
                  Durée maximale <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watchedFields.maxSessionDuration?.toString()}
                  onValueChange={(value) =>
                    setValue('maxSessionDuration', parseInt(value, 10), {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger
                    id="maxSessionDuration"
                    className={errors.maxSessionDuration ? 'border-red-500' : ''}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_DURATIONS.filter(
                      (d) => d.value >= (watchedFields.minSessionDuration || 30)
                    ).map((duration) => (
                      <SelectItem key={duration.value} value={duration.value.toString()}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.maxSessionDuration && (
                  <p className="text-sm text-red-500">{errors.maxSessionDuration.message}</p>
                )}
              </div>
            </div>
            {watchedFields.minSessionDuration &&
              watchedFields.maxSessionDuration &&
              watchedFields.minSessionDuration >= watchedFields.maxSessionDuration && (
                <p className="text-sm text-red-500">
                  La durée minimale doit être inférieure à la durée maximale
                </p>
              )}
          </div>

          {/* Section 4: Capacity */}
          <div className="space-y-2">
            <Label htmlFor="maxStudentsPerWeek">
              Nombre maximum d'étudiants par semaine <span className="text-red-500">*</span>
            </Label>
            <Input
              id="maxStudentsPerWeek"
              type="number"
              min="1"
              max="50"
              placeholder="20"
              {...register('maxStudentsPerWeek', { valueAsNumber: true })}
              className={errors.maxStudentsPerWeek ? 'border-red-500' : ''}
            />
            {errors.maxStudentsPerWeek && (
              <p className="text-sm text-red-500">{errors.maxStudentsPerWeek.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Pour assurer un enseignement de qualité
            </p>
          </div>
        </div>

        {/* Navigation */}
        <StepNavigation
          onPrevious={handlePrevious}
          onNext={() => {}}
          isFirstStep={false}
          isLastStep={false}
          canProceed={isValid}
        />
      </FormSection>
    </form>
  );
}
