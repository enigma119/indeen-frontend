'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, Loader2, ImageIcon, Trash2 } from 'lucide-react';
import { useUploadAvatar, useDeleteAvatar } from '@/hooks/use-profile';
import { cn } from '@/lib/utils';

interface AvatarUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatarUrl?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MIN_DIMENSIONS = 200;

export function AvatarUploadDialog({
  open,
  onOpenChange,
  currentAvatarUrl,
}: AvatarUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();

  const validateFile = useCallback(async (file: File): Promise<boolean> => {
    // Check file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Format non accepté. Utilisez JPG, PNG ou WEBP.');
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Le fichier est trop volumineux. Taille max: 5MB.');
      return false;
    }

    // Check image dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < MIN_DIMENSIONS || img.height < MIN_DIMENSIONS) {
          setError(`L'image doit faire au moins ${MIN_DIMENSIONS}x${MIN_DIMENSIONS} pixels.`);
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => {
        setError('Impossible de charger l\'image.');
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      const isValid = await validateFile(file);
      if (!isValid) {
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // Compress image before upload
      const compressedFile = await compressImage(selectedFile);
      await uploadAvatar.mutateAsync(compressedFile);
      handleClose();
    } catch {
      setError('Erreur lors du téléchargement. Veuillez réessayer.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAvatar.mutateAsync();
      handleClose();
    } catch {
      setError('Erreur lors de la suppression. Veuillez réessayer.');
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setIsDragging(false);
    onOpenChange(false);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isLoading = uploadAvatar.isPending || deleteAvatar.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Photo de profil</DialogTitle>
          <DialogDescription>
            Téléchargez une nouvelle photo ou supprimez l&apos;actuelle.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Avatar Preview */}
          {!previewUrl && currentAvatarUrl && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-gray-500">Photo actuelle</p>
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentAvatarUrl} alt="Avatar actuel" />
                <AvatarFallback>
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* New Image Preview */}
          {previewUrl && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-gray-500">Nouvelle photo</p>
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={previewUrl} alt="Aperçu" />
                  <AvatarFallback>
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleClear}
                  className="absolute -top-2 -right-2 p-1 bg-white rounded-full border shadow-sm hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}

          {/* Drop Zone */}
          {!previewUrl && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
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
                Glissez une image ici
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ou cliquez pour parcourir
              </p>
              <p className="text-xs text-gray-400 mt-2">
                JPG, PNG, WEBP - Max 5MB - Min 200x200px
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {currentAvatarUrl && !previewUrl && (
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {deleteAvatar.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Supprimer
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          {previewUrl && (
            <Button onClick={handleUpload} disabled={isLoading}>
              {uploadAvatar.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Télécharger
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Compress image before upload
 */
async function compressImage(file: File): Promise<File> {
  // Simple canvas-based compression
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);

      // Calculate new dimensions (max 800x800)
      const maxSize = 800;
      let { width, height } = img;

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      // Create canvas and draw resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          // Create new file with compressed data
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        'image/jpeg',
        0.85 // Quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}
