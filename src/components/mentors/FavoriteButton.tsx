'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Heart, Loader2 } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { useAuthStore } from '@/stores/auth-store';
import { loadFavorites } from '@/lib/favorites-storage';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  mentorId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const iconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function FavoriteButton({
  mentorId,
  size = 'md',
  className,
}: FavoriteButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { toggleFavorite, isAdding, isRemoving } = useFavorites();

  // Local state for instant UI response
  const [isFavorited, setIsFavorited] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check localStorage on mount for instant UI
  useEffect(() => {
    const favorites = loadFavorites();
    setIsFavorited(favorites.includes(mentorId));
  }, [mentorId]);

  const isLoading = isAdding || isRemoving;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      setShowLoginDialog(true);
      return;
    }

    // Optimistic update
    setIsFavorited(!isFavorited);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    toggleFavorite(mentorId);
  };

  const handleLogin = () => {
    setShowLoginDialog(false);
    router.push('/login');
  };

  const tooltipText = isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris';

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClick}
              disabled={isLoading}
              className={cn(
                sizeClasses[size],
                'rounded-full bg-white/90 hover:bg-white shadow-sm transition-all duration-200',
                isAnimating && 'scale-110',
                className
              )}
            >
              {isLoading ? (
                <Loader2
                  className={cn(iconSizeClasses[size], 'animate-spin text-gray-400')}
                />
              ) : (
                <Heart
                  className={cn(
                    iconSizeClasses[size],
                    'transition-all duration-200',
                    isFavorited
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-500 hover:text-red-500'
                  )}
                />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connectez-vous pour sauvegarder</DialogTitle>
            <DialogDescription>
              Créez un compte ou connectez-vous pour ajouter ce mentor à vos
              favoris et y accéder depuis n'importe où.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleLogin} className="bg-teal-600 hover:bg-teal-700">
              Se connecter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
