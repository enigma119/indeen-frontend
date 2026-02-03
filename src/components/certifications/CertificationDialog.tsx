'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import {
  useCreateCertification,
  useUpdateCertification,
} from '@/hooks/use-certifications';
import { cn } from '@/lib/utils';
import type { Certification, CertificationType } from '@/types';

const CERTIFICATION_TYPES: { value: CertificationType; label: string }[] = [
  { value: 'ijaza', label: 'Ijaza' },
  { value: 'university_degree', label: 'Diplôme universitaire' },
  { value: 'professional_training', label: 'Formation professionnelle' },
  { value: 'online_certification', label: 'Certification en ligne' },
  { value: 'other', label: 'Autre' },
];

const currentYear = new Date().getFullYear();

const certificationSchema = z.object({
  type: z.enum(['ijaza', 'university_degree', 'professional_training', 'online_certification', 'other']),
  name: z.string().min(2, 'Minimum 2 caractères').max(200, 'Maximum 200 caractères'),
  institution: z.string().max(200, 'Maximum 200 caractères').optional(),
  year: z.number().min(1950, 'Année invalide').max(currentYear, 'Année invalide').optional(),
  expirationDate: z.string().optional(),
  description: z.string().max(500, 'Maximum 500 caractères').optional(),
  isPublic: z.boolean(),
});

type CertificationFormData = z.infer<typeof certificationSchema>;

interface CertificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification?: Certification | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

export function CertificationDialog({
  open,
  onOpenChange,
  certification,
}: CertificationDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createCertification = useCreateCertification();
  const updateCertification = useUpdateCertification();

  const isEditing = !!certification;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      type: 'ijaza',
      name: '',
      institution: '',
      year: currentYear,
      expirationDate: '',
      description: '',
      isPublic: false,
    },
  });

  // Reset form when dialog opens/closes or certification changes
  useEffect(() => {
    if (open) {
      if (certification) {
        reset({
          type: certification.type,
          name: certification.name,
          institution: certification.institution || '',
          year: certification.year || currentYear,
          expirationDate: certification.expirationDate || '',
          description: certification.description || '',
          isPublic: certification.isPublic,
        });
        setPreviewUrl(certification.documentUrl || null);
      } else {
        reset({
          type: 'ijaza',
          name: '',
          institution: '',
          year: currentYear,
          expirationDate: '',
          description: '',
          isPublic: false,
        });
        setSelectedFile(null);
        setPreviewUrl(null);
      }
      setFileError(null);
    }
  }, [open, certification, reset]);

  const validateFile = useCallback((file: File): boolean => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError('Type de fichier non autorisé. Utilisez PDF, JPG, PNG ou WEBP.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('Le fichier est trop volumineux. Taille max: 10MB.');
      return false;
    }

    return true;
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      setFileError(null);

      if (!validateFile(file)) {
        return;
      }

      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    },
    [validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(isEditing ? certification?.documentUrl || null : null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: CertificationFormData) => {
    // Validate file for new certifications
    if (!isEditing && !selectedFile) {
      setFileError('Un document justificatif est requis.');
      return;
    }

    try {
      if (isEditing && certification) {
        await updateCertification.mutateAsync({
          id: certification.id,
          data: {
            type: data.type,
            name: data.name,
            institution: data.institution || undefined,
            year: data.year || undefined,
            expirationDate: data.expirationDate || undefined,
            description: data.description || undefined,
            isPublic: data.isPublic,
          },
          file: selectedFile || undefined,
        });
      } else if (selectedFile) {
        await createCertification.mutateAsync({
          data: {
            type: data.type,
            name: data.name,
            institution: data.institution || undefined,
            year: data.year || undefined,
            expirationDate: data.expirationDate || undefined,
            description: data.description || undefined,
            isPublic: data.isPublic,
          },
          file: selectedFile,
        });
      }
      onOpenChange(false);
    } catch {
      // Error is handled by the mutation
    }
  };

  const isLoading = createCertification.isPending || updateCertification.isPending;
  const isPdf = selectedFile?.type === 'application/pdf';
  const hasExistingDocument = isEditing && certification?.documentUrl && !selectedFile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier la certification' : 'Ajouter une certification'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifiez les informations de votre certification.'
              : 'Ajoutez une nouvelle certification à votre profil.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type de certification *</Label>
            <Select
              value={watch('type')}
              onValueChange={(value) => setValue('type', value as CertificationType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {CERTIFICATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Titre / Nom *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ex: Ijaza en Tajweed"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Institution */}
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              {...register('institution')}
              placeholder="Ex: Dar Al-Quran"
            />
            {errors.institution && (
              <p className="text-sm text-red-500">{errors.institution.message}</p>
            )}
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year">Année d&apos;obtention</Label>
            <Input
              id="year"
              type="number"
              min={1950}
              max={currentYear}
              {...register('year', { valueAsNumber: true })}
              placeholder={String(currentYear)}
            />
            {errors.year && (
              <p className="text-sm text-red-500">{errors.year.message}</p>
            )}
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <Label htmlFor="expirationDate">Date d&apos;expiration (optionnel)</Label>
            <Input
              id="expirationDate"
              type="date"
              {...register('expirationDate')}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Détails supplémentaires sur cette certification..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {watch('description')?.length || 0}/500 caractères
            </p>
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <Label>Document justificatif {!isEditing && '*'}</Label>

            {/* Existing document info */}
            {hasExistingDocument && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600 flex-1">
                  Document existant
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={certification?.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Voir
                  </a>
                </Button>
              </div>
            )}

            {/* New file selected */}
            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-lg border border-teal-200">
                {isPdf ? (
                  <FileText className="h-5 w-5 text-teal-600" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-teal-600" />
                )}
                <span className="text-sm text-teal-700 flex-1 truncate">
                  {selectedFile.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFile}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Image preview */}
            {previewUrl && selectedFile?.type.startsWith('image/') && (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain bg-gray-50"
                />
              </div>
            )}

            {/* Drop zone */}
            {!selectedFile && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                  isDragging
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_TYPES.join(',')}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  {isEditing ? 'Remplacer le document' : 'Glissez un fichier ici'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ou cliquez pour parcourir
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  PDF, JPG, PNG, WEBP - Max 10MB
                </p>
              </div>
            )}

            {/* File error */}
            {fileError && (
              <Alert variant="destructive" className="py-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Public option */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              id="isPublic"
              checked={watch('isPublic')}
              onCheckedChange={(checked) => setValue('isPublic', checked as boolean)}
            />
            <div>
              <Label htmlFor="isPublic" className="cursor-pointer">
                Rendre ce document public sur mon profil
              </Label>
              <p className="text-xs text-gray-500 mt-0.5">
                Les élèves pourront voir ce document sur votre profil public.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
