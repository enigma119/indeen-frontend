import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Home, UserPlus } from 'lucide-react';

export default function AccountDeletedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Compte Supprimé</h1>

          <p className="text-gray-600 mb-6">
            Votre compte a été supprimé avec succès. Toutes vos données personnelles ont
            été effacées de notre système.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Nous sommes désolés de vous voir partir. Si vous changez d&apos;avis, vous
              pouvez créer un nouveau compte à tout moment.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/signup">
                <UserPlus className="mr-2 h-4 w-4" />
                Créer un nouveau compte
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Retour à l&apos;accueil
              </Link>
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Si vous avez des questions, n&apos;hésitez pas à{' '}
            <Link href="/contact" className="text-teal-600 hover:text-teal-700">
              nous contacter
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
