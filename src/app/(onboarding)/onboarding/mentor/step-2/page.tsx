'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMentorOnboardingStore } from '@/stores/mentor-onboarding-store';
import { mentorStep2Schema, type MentorStep2Data } from '@/lib/validations/onboarding';
import { FormSection, StepNavigation, CertificationItem } from '@/components/onboarding';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Info, CheckCircle2 } from 'lucide-react';
import type { Certification } from '@/types/onboarding';

const HEADLINE_MAX_LENGTH = 200;
const BIO_MIN_LENGTH = 100;
const BIO_MAX_LENGTH = 1000;

export default function MentorStep2Page() {
  const router = useRouter();
  const { data, updateData, addCertification, removeCertification } = useMentorOnboardingStore();
  const [headlineCount, setHeadlineCount] = useState(0);
  const [bioCount, setBioCount] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<MentorStep2Data>({
    resolver: zodResolver(mentorStep2Schema),
    mode: 'onChange',
    defaultValues: {
      headline: data.headline || '',
      bio: data.bio || '',
      yearsExperience: data.yearsExperience ?? 0,
      certifications: data.certifications || [],
      education: data.education || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications',
  });

  const watchedFields = watch();

  // Update character counts
  useEffect(() => {
    setHeadlineCount(watchedFields.headline?.length || 0);
    setBioCount(watchedFields.bio?.length || 0);
  }, [watchedFields.headline, watchedFields.bio]);

  // Auto-save to store on change
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateData(watchedFields);
    }, 300);
    return () => clearTimeout(timeout);
  }, [watchedFields, updateData]);

  // Initialize with at least one certification
  useEffect(() => {
    if (fields.length === 0) {
      append({
        type: 'OTHER' as const,
        institution: '',
        year: new Date().getFullYear(),
        documentUrl: undefined,
      });
    }
  }, [fields.length, append]);

  const onSubmit = (formData: MentorStep2Data) => {
    updateData(formData);
    router.push('/onboarding/mentor/step-3');
  };

  const handlePrevious = () => {
    router.push('/onboarding/mentor/step-1');
  };

  const handleAddCertification = () => {
    if (fields.length < 5) {
      append({
        type: 'OTHER' as const,
        institution: '',
        year: new Date().getFullYear(),
        documentUrl: undefined,
      });
    }
  };

  const handleCertificationChange = (index: number, certification: Certification) => {
    const currentCerts = watchedFields.certifications || [];
    const updated = [...currentCerts];
    updated[index] = certification;
    setValue('certifications', updated, { shouldValidate: true });
  };

  const handleRemoveCertification = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      removeCertification(index);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Qualifications"
        description="Décrivez votre parcours et vos certifications"
      >
        <div className="space-y-8">
          {/* Section 1: Headline */}
          <div className="space-y-2">
            <Label htmlFor="headline">
              Titre accrocheur <span className="text-red-500">*</span>
            </Label>
            <Input
              id="headline"
              placeholder="Ex: Professeur de Tajweed certifié - 10 ans d'expérience"
              maxLength={HEADLINE_MAX_LENGTH}
              {...register('headline')}
              className={errors.headline ? 'border-red-500' : ''}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {headlineCount}/{HEADLINE_MAX_LENGTH} caractères
              </p>
              {errors.headline && (
                <p className="text-sm text-red-500">{errors.headline.message}</p>
              )}
            </div>
          </div>

          {/* Section 2: Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">
              Biographie <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="bio"
              placeholder="Parlez de votre parcours d'apprentissage, votre méthode d'enseignement, votre expérience, et ce qui vous passionne dans l'enseignement..."
              rows={8}
              maxLength={BIO_MAX_LENGTH}
              {...register('bio')}
              className={errors.bio ? 'border-red-500' : ''}
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {bioCount}/{BIO_MAX_LENGTH} caractères (minimum {BIO_MIN_LENGTH})
                </p>
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>Parlez de votre parcours d'apprentissage</li>
                    <li>Votre méthode d'enseignement</li>
                    <li>Votre expérience</li>
                    <li>Ce qui vous passionne dans l'enseignement</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Section 3: Years of Experience */}
          <div className="space-y-2">
            <Label htmlFor="yearsExperience">
              Années d'expérience <span className="text-red-500">*</span>
            </Label>
            <Input
              id="yearsExperience"
              type="number"
              min="0"
              max="50"
              placeholder="0"
              {...register('yearsExperience', { valueAsNumber: true })}
              className={errors.yearsExperience ? 'border-red-500' : ''}
            />
            {errors.yearsExperience && (
              <p className="text-sm text-red-500">{errors.yearsExperience.message}</p>
            )}
          </div>

          {/* Section 4: Certifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>
                Certifications <span className="text-red-500">*</span>
              </Label>
              {fields.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCertification}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter une certification
                </Button>
              )}
            </div>

            {fields.length === 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <Info className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Au moins une certification est requise
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="animate-in fade-in slide-in-from-top-2 duration-300"
                >
                  <CertificationItem
                    certification={watchedFields.certifications?.[index] || {
                      type: 'OTHER',
                      institution: '',
                      year: new Date().getFullYear(),
                    }}
                    index={index}
                    onChange={handleCertificationChange}
                    onRemove={handleRemoveCertification}
                    error={
                      errors.certifications?.[index]
                        ? 'Veuillez remplir tous les champs de cette certification'
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>

            {errors.certifications && typeof errors.certifications.message === 'string' && (
              <p className="text-sm text-red-500">{errors.certifications.message}</p>
            )}

            {fields.length >= 5 && (
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Maximum 5 certifications atteint
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Section 5: Education (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="education">
              Formation académique (optionnel)
            </Label>
            <Textarea
              id="education"
              placeholder="Études universitaires, formations complémentaires, etc."
              rows={4}
              {...register('education')}
            />
            <p className="text-xs text-gray-500">
              Décrivez votre parcours académique et vos formations
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
