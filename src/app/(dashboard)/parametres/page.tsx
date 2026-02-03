'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import {
  SecuritySection,
  NotificationsSection,
  PrivacySection,
  DataSection,
  DeleteAccountSection,
} from '@/components/settings';
import { Shield, Bell, Eye, Download, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SettingsTab = 'security' | 'notifications' | 'privacy' | 'data' | 'delete';

const TABS: { id: SettingsTab; label: string; icon: React.ElementType; danger?: boolean }[] = [
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Confidentialité', icon: Eye },
  { id: 'data', label: 'Données & Export', icon: Download },
  { id: 'delete', label: 'Suppression', icon: Trash2, danger: true },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('security');

  return (
    <AuthGuard>
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres du Compte</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0">
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                      isActive
                        ? tab.danger
                          ? 'bg-red-50 text-red-700'
                          : 'bg-teal-50 text-teal-700'
                        : tab.danger
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5',
                        isActive
                          ? tab.danger
                            ? 'text-red-600'
                            : 'text-teal-600'
                          : tab.danger
                          ? 'text-red-500'
                          : 'text-gray-500'
                      )}
                    />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {activeTab === 'security' && <SecuritySection />}
            {activeTab === 'notifications' && <NotificationsSection />}
            {activeTab === 'privacy' && <PrivacySection />}
            {activeTab === 'data' && <DataSection />}
            {activeTab === 'delete' && <DeleteAccountSection />}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
