'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Copy, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import {
  initTwoFactorSetup,
  enableTwoFactor,
  disableTwoFactor,
} from '@/lib/api/settings';
import { toast } from 'sonner';
import type { TwoFactorSetupData } from '@/types';

interface TwoFactorSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEnabled: boolean;
  onStatusChange: (enabled: boolean) => void;
}

type SetupStep = 'init' | 'scan' | 'verify' | 'backup' | 'complete' | 'disable';

export function TwoFactorSetup({
  open,
  onOpenChange,
  isEnabled,
  onStatusChange,
}: TwoFactorSetupProps) {
  const [step, setStep] = useState<SetupStep>(isEnabled ? 'disable' : 'init');
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const handleStartSetup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await initTwoFactorSetup();
      setSetupData(data);
      setStep('scan');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { backupCodes: codes } = await enableTwoFactor(verificationCode);
      setBackupCodes(codes);
      setStep('backup');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Code invalide';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    if (verificationCode.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await disableTwoFactor(verificationCode, password);
      onStatusChange(false);
      toast.success('Authentification à deux facteurs désactivée');
      handleClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Code ou mot de passe invalide';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedCodes(true);
    toast.success('Codes copiés dans le presse-papier');
    setTimeout(() => setCopiedCodes(false), 3000);
  };

  const handleComplete = () => {
    onStatusChange(true);
    toast.success('Authentification à deux facteurs activée');
    handleClose();
  };

  const handleClose = () => {
    setStep(isEnabled ? 'disable' : 'init');
    setSetupData(null);
    setVerificationCode('');
    setPassword('');
    setBackupCodes([]);
    setError(null);
    setCopiedCodes(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* Enable 2FA Flow */}
        {!isEnabled && (
          <>
            {step === 'init' && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-teal-600" />
                    Activer l&apos;authentification à deux facteurs
                  </DialogTitle>
                  <DialogDescription>
                    Ajoutez une couche de sécurité supplémentaire à votre compte.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <p className="text-sm text-gray-600">
                    L&apos;authentification à deux facteurs (2FA) protège votre compte en
                    demandant un code supplémentaire lors de la connexion.
                  </p>
                  <p className="text-sm text-gray-600">
                    Vous aurez besoin d&apos;une application d&apos;authentification comme :
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Google Authenticator</li>
                    <li>Authy</li>
                    <li>Microsoft Authenticator</li>
                  </ul>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={handleClose}>
                    Annuler
                  </Button>
                  <Button onClick={handleStartSetup} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Commencer
                  </Button>
                </DialogFooter>
              </>
            )}

            {step === 'scan' && setupData && (
              <>
                <DialogHeader>
                  <DialogTitle>Scanner le QR Code</DialogTitle>
                  <DialogDescription>
                    Scannez ce code avec votre application d&apos;authentification.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <QRCodeSVG value={setupData.qrCodeUrl} size={200} />
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      Ou entrez ce code manuellement :
                    </p>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                      {setupData.secret}
                    </code>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setStep('init')}>
                    Retour
                  </Button>
                  <Button onClick={() => setStep('verify')}>Suivant</Button>
                </DialogFooter>
              </>
            )}

            {step === 'verify' && (
              <>
                <DialogHeader>
                  <DialogTitle>Vérifier le code</DialogTitle>
                  <DialogDescription>
                    Entrez le code à 6 chiffres affiché dans votre application.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="code">Code de vérification</Label>
                    <Input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="000000"
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setStep('scan')}>
                    Retour
                  </Button>
                  <Button onClick={handleVerify} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Vérifier
                  </Button>
                </DialogFooter>
              </>
            )}

            {step === 'backup' && (
              <>
                <DialogHeader>
                  <DialogTitle>Codes de secours</DialogTitle>
                  <DialogDescription>
                    Sauvegardez ces codes en lieu sûr. Ils vous permettront de vous
                    connecter si vous perdez l&apos;accès à votre application.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-700">
                      Chaque code ne peut être utilisé qu&apos;une seule fois.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                      <code key={index} className="text-sm font-mono text-center py-1">
                        {code}
                      </code>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleCopyBackupCodes}
                  >
                    {copiedCodes ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    {copiedCodes ? 'Codes copiés !' : 'Copier les codes'}
                  </Button>
                </div>

                <DialogFooter>
                  <Button onClick={handleComplete}>
                    J&apos;ai sauvegardé mes codes
                  </Button>
                </DialogFooter>
              </>
            )}
          </>
        )}

        {/* Disable 2FA Flow */}
        {isEnabled && step === 'disable' && (
          <>
            <DialogHeader>
              <DialogTitle>Désactiver l&apos;authentification à deux facteurs</DialogTitle>
              <DialogDescription>
                Votre compte sera moins sécurisé sans 2FA.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="disableCode">Code d&apos;authentification</Label>
                <Input
                  id="disableCode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, ''))
                  }
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disablePassword">Mot de passe</Label>
                <Input
                  id="disablePassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDisable} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Désactiver
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
