'use client';

import { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

interface LogoutDialogProps {
  trigger?: React.ReactNode;
}

/**
 * Logout confirmation dialog
 * Shows a confirmation before signing out the user
 */
export function LogoutDialog({ trigger }: LogoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast.success('À bientôt !', {
        description: 'Vous avez été déconnecté avec succès.',
      });
      setOpen(false);
    } catch (error) {
      console.error('[LogoutDialog] Error:', error);
      toast.error('Erreur lors de la déconnexion', {
        description: 'Veuillez réessayer.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Se déconnecter ?</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter
            pour accéder à votre compte.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Déconnexion...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
