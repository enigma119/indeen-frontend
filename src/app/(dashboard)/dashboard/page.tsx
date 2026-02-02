'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Heart,
  Search,
  User,
  BookOpen,
  Clock,
  Star,
  Users,
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading, isMentor, isMentee } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const firstName = user?.first_name || 'Utilisateur';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Bienvenue, {firstName} !
          </h1>
          <p className="text-gray-600 mt-1">
            {isMentor
              ? 'Gérez vos cours et suivez vos élèves'
              : 'Trouvez des mentors et gérez vos sessions'
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isMentee && (
            <>
              <Link href="/mentors" className="group">
                <Card className="h-full hover:border-teal-500 hover:shadow-md transition-all">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="rounded-full bg-teal-100 p-3 group-hover:bg-teal-200 transition-colors">
                      <Search className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Trouver un mentor</p>
                      <p className="text-sm text-gray-500">Explorer le catalogue</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/favoris" className="group">
                <Card className="h-full hover:border-teal-500 hover:shadow-md transition-all">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="rounded-full bg-pink-100 p-3 group-hover:bg-pink-200 transition-colors">
                      <Heart className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Mes favoris</p>
                      <p className="text-sm text-gray-500">Mentors sauvegardés</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </>
          )}

          <Link href="/sessions" className="group">
            <Card className="h-full hover:border-teal-500 hover:shadow-md transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3 group-hover:bg-blue-200 transition-colors">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mes sessions</p>
                  <p className="text-sm text-gray-500">Voir le planning</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profil" className="group">
            <Card className="h-full hover:border-teal-500 hover:shadow-md transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="rounded-full bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mon profil</p>
                  <p className="text-sm text-gray-500">Paramètres du compte</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats for Mentors */}
        {isMentor && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Sessions ce mois</p>
                    <p className="text-2xl font-bold text-gray-900">--</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-teal-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Heures enseignées</p>
                    <p className="text-2xl font-bold text-gray-900">--</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Note moyenne</p>
                    <p className="text-2xl font-bold text-gray-900">--</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Élèves actifs</p>
                    <p className="text-2xl font-bold text-gray-900">--</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-600" />
                Prochaines sessions
              </CardTitle>
              <CardDescription>
                Vos sessions à venir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">
                  Aucune session planifiée
                </p>
                {isMentee && (
                  <Button asChild variant="outline" className="gap-2">
                    <Link href="/mentors">
                      Trouver un mentor
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips or Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isMentor ? 'Conseils pour mentors' : 'Pour bien commencer'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isMentor ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-teal-100 p-2">
                      <Clock className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Définissez vos disponibilités</p>
                      <p className="text-xs text-gray-500">
                        Mettez à jour votre calendrier régulièrement
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Demandez des avis</p>
                      <p className="text-xs text-gray-500">
                        Les avis positifs attirent plus d'élèves
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-purple-100 p-2">
                      <User className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Complétez votre profil</p>
                      <p className="text-xs text-gray-500">
                        Un profil complet inspire confiance
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-teal-100 p-2">
                      <Search className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Explorez les mentors</p>
                      <p className="text-xs text-gray-500">
                        Utilisez les filtres pour trouver le mentor idéal
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-pink-100 p-2">
                      <Heart className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Sauvegardez vos favoris</p>
                      <p className="text-xs text-gray-500">
                        Comparez plusieurs mentors avant de choisir
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Réservez une session</p>
                      <p className="text-xs text-gray-500">
                        Commencez votre apprentissage dès aujourd'hui
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
