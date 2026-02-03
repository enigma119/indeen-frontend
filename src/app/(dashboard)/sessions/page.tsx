'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { SessionCardMentee } from '@/components/sessions';
import { useMySessions } from '@/hooks/use-sessions';
import { useAuth } from '@/hooks/use-auth';
import {
  Calendar,
  Clock,
  Search,
  CalendarX,
  BookOpen,
  Loader2,
  Users,
} from 'lucide-react';

type SessionTab = 'upcoming' | 'past' | 'cancelled';

const TABS: { value: SessionTab; label: string; icon: React.ReactNode }[] = [
  { value: 'upcoming', label: 'À venir', icon: <Calendar className="h-4 w-4" /> },
  { value: 'past', label: 'Passées', icon: <Clock className="h-4 w-4" /> },
  { value: 'cancelled', label: 'Annulées', icon: <CalendarX className="h-4 w-4" /> },
];

function EmptyState({
  tab,
}: {
  tab: SessionTab;
}) {
  const config = {
    upcoming: {
      icon: <Calendar className="h-12 w-12 text-gray-400" />,
      title: 'Aucune session prévue',
      description: 'Vous n\'avez pas encore de sessions programmées.',
      action: (
        <Button asChild className="mt-4">
          <Link href="/mentors">Trouver un mentor</Link>
        </Button>
      ),
    },
    past: {
      icon: <Clock className="h-12 w-12 text-gray-400" />,
      title: 'Aucune session complétée',
      description: 'Vous n\'avez pas encore terminé de sessions.',
      action: null,
    },
    cancelled: {
      icon: <CalendarX className="h-12 w-12 text-gray-400" />,
      title: 'Aucune session annulée',
      description: 'Vous n\'avez pas de sessions annulées.',
      action: null,
    },
  };

  const { icon, title, description, action } = config[tab];

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-500 mt-1">{description}</p>
      {action}
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

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<SessionTab>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { isMentee, isLoading: authLoading } = useAuth();

  // Map tab to API status
  const statusMap: Record<SessionTab, 'upcoming' | 'past' | 'CANCELLED_BY_MENTOR' | 'CANCELLED_BY_MENTEE'> = {
    upcoming: 'upcoming',
    past: 'past',
    cancelled: 'CANCELLED_BY_MENTEE', // Will be handled differently on backend
  };

  const { data, isLoading, refetch } = useMySessions(
    activeTab === 'cancelled' ? undefined : statusMap[activeTab],
    page,
    10
  );

  // Filter cancelled sessions on client side for now
  const sessions = data?.sessions?.filter((s) => {
    if (activeTab === 'cancelled') {
      return s.status.startsWith('CANCELLED_') || s.status.startsWith('NO_SHOW_');
    }
    return true;
  }) || [];

  // Filter by search query
  const filteredSessions = sessions.filter((s) => {
    if (!searchQuery) return true;
    const mentorName = s.mentor_profile?.user
      ? `${s.mentor_profile.user.first_name} ${s.mentor_profile.user.last_name}`
      : '';
    return mentorName.toLowerCase().includes(searchQuery.toLowerCase());
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
          <BookOpen className="h-7 w-7 text-teal-600" />
          Mes Sessions
        </h1>
        <p className="text-gray-600 mt-1">
          Gérez vos sessions de cours avec vos mentors
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
                className="gap-2"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un mentor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
        </div>

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
                  <SessionCardMentee
                    key={session.id}
                    session={session}
                    onCancelSuccess={() => refetch()}
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
