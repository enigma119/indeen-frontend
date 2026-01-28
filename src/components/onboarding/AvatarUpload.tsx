'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  value?: string | File;
  onChange: (file: File | null) => void;
  defaultInitials?: string;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

export function AvatarUpload({
  value,
  onChange,
  defaultInitials = '?',
  error,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get preview URL
  const previewUrl = useCallback(() => {
    if (preview) return preview;
    if (typeof value === 'string' && value) return value;
    return null;
  }, [preview, value]);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setFileError(null);

      if (!file) {
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setFileError('L\'image ne doit pas dépasser 5 Mo');
        return;
      }

      // Validate file format
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        setFileError('Format accepté : JPG, PNG ou WebP');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Call onChange with file
      onChange(file);
    },
    [onChange]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    setFileError(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onChange]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const currentPreview = previewUrl();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Circle */}
      <div className="relative group">
        <div
          className={cn(
            'h-28 w-28 rounded-full flex items-center justify-center overflow-hidden',
            'border-2 border-dashed transition-all duration-200',
            currentPreview
              ? 'border-teal-500'
              : 'border-gray-300 hover:border-teal-500',
            (error || fileError) && 'border-red-500'
          )}
        >
          {currentPreview ? (
            <img
              src={currentPreview}
              alt="Avatar preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              {defaultInitials !== '?' ? (
                <span className="text-3xl font-semibold text-teal-600">
                  {defaultInitials}
                </span>
              ) : (
                <User className="h-12 w-12" />
              )}
            </div>
          )}
        </div>

        {/* Overlay on hover */}
        {currentPreview && (
          <div
            className={cn(
              'absolute inset-0 rounded-full bg-black/50 flex items-center justify-center',
              'opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'
            )}
            onClick={handleClick}
          >
            <Camera className="h-8 w-8 text-white" />
          </div>
        )}

        {/* Remove button */}
        {currentPreview && (
          <button
            type="button"
            onClick={handleRemove}
            className={cn(
              'absolute -top-1 -right-1 h-7 w-7 rounded-full',
              'bg-red-500 hover:bg-red-600 text-white',
              'flex items-center justify-center transition-colors',
              'shadow-md'
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FORMATS.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Action button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        className="gap-2"
      >
        <Camera className="h-4 w-4" />
        {currentPreview ? 'Changer la photo' : 'Ajouter une photo'}
      </Button>

      {/* Help text */}
      <p className="text-xs text-gray-500 text-center">
        JPG, PNG ou WebP. Max 5 Mo.
      </p>

      {/* Error message */}
      {(error || fileError) && (
        <p className="text-sm text-red-500 text-center">
          {error || fileError}
        </p>
      )}
    </div>
  );
}
