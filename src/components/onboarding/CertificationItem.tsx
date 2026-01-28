'use client';

import { useState, useRef, useCallback } from 'react';
import { Trash2, Upload, FileText, Image as ImageIcon, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Certification } from '@/types/onboarding';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FORMATS = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

interface CertificationItemProps {
  certification: Certification;
  index: number;
  onChange: (index: number, certification: Certification) => void;
  onRemove: (index: number) => void;
  error?: string;
}

export function CertificationItem({
  certification,
  index,
  onChange,
  onRemove,
  error,
}: CertificationItemProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTypeChange = (type: Certification['type']) => {
    onChange(index, { ...certification, type });
  };

  const handleInstitutionChange = (institution: string) => {
    onChange(index, { ...certification, institution });
  };

  const handleYearChange = (year: string) => {
    const yearNum = parseInt(year, 10);
    if (!isNaN(yearNum)) {
      onChange(index, { ...certification, year: yearNum });
    }
  };

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setFileError(null);

      if (!file) {
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setFileError('Le document ne doit pas dépasser 10 Mo');
        return;
      }

      // Validate file format
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        setFileError('Format accepté : PDF, JPG, PNG ou WebP');
        return;
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      // Store file object temporarily - will be uploaded on submission
      // We store it as a File object in the store, but convert to string for display
      onChange(index, { ...certification, documentFile: file, documentUrl: undefined });
    },
    [certification, index, onChange]
  );

  const handleRemoveFile = useCallback(() => {
    setPreview(null);
    setFileError(null);
    onChange(index, { ...certification, documentUrl: undefined, documentFile: undefined });
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [certification, index, onChange]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const hasDocument = certification.documentUrl || certification.documentFile;
  const isImage = (certification.documentFile?.type.startsWith('image/') || (certification.documentUrl && preview));
  const isPdf = (certification.documentFile?.type === 'application/pdf' || (certification.documentUrl && !preview && certification.documentUrl.includes('.pdf')));

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header with remove button */}
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Certification {index + 1}
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor={`cert-type-${index}`}>
              Type de certification <span className="text-red-500">*</span>
            </Label>
            <Select
              value={certification.type}
              onValueChange={(value) => handleTypeChange(value as Certification['type'])}
            >
              <SelectTrigger id={`cert-type-${index}`}>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IJAZA">Ijaza</SelectItem>
                <SelectItem value="DIPLOMA">Diplôme universitaire</SelectItem>
                <SelectItem value="TRAINING">Formation</SelectItem>
                <SelectItem value="OTHER">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Institution */}
          <div className="space-y-2">
            <Label htmlFor={`cert-institution-${index}`}>
              Institution <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`cert-institution-${index}`}
              placeholder="Nom de l'institution"
              value={certification.institution}
              onChange={(e) => handleInstitutionChange(e.target.value)}
            />
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor={`cert-year-${index}`}>
              Année <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`cert-year-${index}`}
              type="number"
              placeholder="2020"
              min="1900"
              max={new Date().getFullYear()}
              value={certification.year || ''}
              onChange={(e) => handleYearChange(e.target.value)}
            />
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <Label>Document justificatif (optionnel)</Label>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            {hasDocument ? (
              <div className="space-y-2">
                {/* Preview */}
                {isImage && (
                  <div className="relative border rounded-lg overflow-hidden">
                    <img
                      src={preview || undefined}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {isPdf && (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-medium">Document PDF</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClick}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Remplacer le document
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleClick}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Télécharger un document
              </Button>
            )}

            {fileError && (
              <p className="text-sm text-red-500">{fileError}</p>
            )}
            <p className="text-xs text-gray-500">
              Formats acceptés : PDF, JPG, PNG, WebP (max 10 Mo)
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
