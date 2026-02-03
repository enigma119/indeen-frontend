'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SessionCardMentor } from '@/components/sessions';
import { useMyTeachingSessions } from '@/hooks/use-sessions';
import { useAuth } from '@/hooks/use-auth';
import {
  Calendar,
  Clock,
  Search,
  CalendarX,
  GraduationCap,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

type SessionTab = 'pending' | 'upcoming' | 'past';

const TABS: { value: SessionTab; label: string; icon: React.ReactNode }[] = [
  { value: 'pending', label: 'À confirmer', icon: <AlertCircle className="h-4 w-4" /> },
  { value: 'upcoming', label: 'À venir', icon: <Calendar className="h-4 w-4" /> },
  { value: 'past', label: 'Historique', icon: <Clock className="h-4 w-4" /> },
];

function EmptyState({
  tab,
}: {
  tab: SessionTab;
}) {
  const config = {
    pending: {
      icon: <AlertCircle className="h-12 w-12 text-gray-400" />,
      title: 'Aucune demande en attente',
      description: 'Vous n\'avez pas de sessions à confirmer pour le moment.',
    },
    upcoming: {
      icon: <Calendar className="h-12 w-12 text-gray-400" />,
      title: 'Aucune session prévue',
      description: 'Vous n\'avez pas de sessions confirmées à venir.',
    },
    past: {
      icon: <Clock className="h-12 w-12 text-gray-400" />,
      title: 'Aucun historique',
      description: 'Vous n\'avez pas encore enseigné de sessions.',
    },
  };

  const { icon, title, description } = config[tab];

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-500 mt-1">{description}</p>
    </div>
  );
}

function SessionsLoading() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MentorSessionsPage() {
  const [activeTab, setActiveTab] = useState<SessionTab>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { isMentor, isLoading: authLoading } = useAuth();

  const { data, isLoading, refetch } = useMyTeachingSessions(
    activeTab,
    page,
    10
  );

  const sessions = data?.sessions || [];

  // Count pending sessions for badge
  const { data: pendingData } = useMyTeachingSessions('pending', 1, 100);
  const pendingCount = pendingData?.sessions?.length || 0;

  // Filter by search query
  const filteredSessions = sessions.filter((s) => {
    if (!searchQuery) return true;
    const menteeName = s.mentee_profile?.user
      ? `${s.mentee_profile.user.firstName} ${s.mentee_profile.user.lastName}`
      : '';
    return menteeName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value as SessionTab);
    setPage(1);
    setSearchQuery('');
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <SessionsLoading />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-teal-600" />
          Mes Sessions d'Enseignement
        </h1>
        <p className="text-gray-600 mt-1">
          Gérez vos sessions avec vos élèves
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="gap-2 relative"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.value === 'pending' && pendingCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {pendingCount}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un élève..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Pending Alert */}
        {activeTab !== 'pending' && pendingCount > 0 && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Vous avez <strong>{pendingCount}</strong> session{pendingCount > 1 ? 's' : ''} en
              attente de confirmation.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('pending')}
              className="ml-auto"
            >
              Voir
            </Button>
          </div>
        )}

        {/* Content */}
        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            {isLoading ? (
              <SessionsLoading />
            ) : filteredSessions.length === 0 ? (
              <EmptyState tab={activeTab} />
            ) : (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <SessionCardMentor
                    key={session.id}
                    session={session}
                    onActionSuccess={() => refetch()}
                  />
                ))}

                {/* Load More */}
                {data?.hasMore && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        'Charger plus'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
