'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthGuard } from '@/components/auth/AuthGuard';
import {
  ProfileHeader,
  GeneralInfoTab,
  MentorProfileTab,
  MenteeProfileTab,
} from '@/components/profile';
import { AccountSettingsTab } from './AccountSettingsTab';
import { useUserProfile } from '@/hooks/use-profile';
import { User, Settings, GraduationCap, BookOpen } from 'lucide-react';

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useUserProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">
            Erreur lors du chargement du profil. Veuillez réessayer.
          </p>
        </div>
      </div>
    );
  }

  const isMentor = profile.role === 'MENTOR';
  const isMentee = profile.role === 'MENTEE';

  return (
    <AuthGuard>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Profil</h1>

        {/* Profile Header */}
        <ProfileHeader
          user={profile}
          profile={isMentor ? profile.mentorProfile : profile.menteeProfile}
        />

        {/* Tabs */}
        <Tabs defaultValue="general" className="mt-8">
          <TabsList className="w-full justify-start border-b bg-transparent p-0 h-auto flex-wrap">
            <TabsTrigger
              value="general"
              className="data-[state=active]:border-teal-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-3 gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Informations générales</span>
              <span className="sm:hidden">Général</span>
            </TabsTrigger>

            {isMentor && (
              <TabsTrigger
                value="mentor"
                className="data-[state=active]:border-teal-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-3 gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Profil professionnel</span>
                <span className="sm:hidden">Pro</span>
              </TabsTrigger>
            )}

            {isMentee && (
              <TabsTrigger
                value="mentee"
                className="data-[state=active]:border-teal-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-3 gap-2"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Profil d&apos;apprentissage</span>
                <span className="sm:hidden">Apprentissage</span>
              </TabsTrigger>
            )}

            <TabsTrigger
              value="settings"
              className="data-[state=active]:border-teal-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-3 gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Paramètres du compte</span>
              <span className="sm:hidden">Paramètres</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="general" className="mt-0">
              <GeneralInfoTab user={profile} />
            </TabsContent>

            {isMentor && profile.mentorProfile && (
              <TabsContent value="mentor" className="mt-0">
                <MentorProfileTab profile={profile.mentorProfile} />
              </TabsContent>
            )}

            {isMentee && profile.menteeProfile && (
              <TabsContent value="mentee" className="mt-0">
                <MenteeProfileTab profile={profile.menteeProfile} />
              </TabsContent>
            )}

            <TabsContent value="settings" className="mt-0">
              <AccountSettingsTab user={profile} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AuthGuard>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Skeleton className="h-8 w-48 mb-6" />

      {/* Header Skeleton */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex gap-6">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-8">
        <div className="flex gap-4 border-b pb-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="mt-6 space-y-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
