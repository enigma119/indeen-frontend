import { apiClient } from './client';
import { createBrowserClient } from '@/lib/supabase/client';
import type {
  NotificationPreferences,
  PrivacySettings,
  ActiveSession,
  LoginHistory,
  TwoFactorSetupData,
  DataExportRequest,
  DeleteAccountCheck,
  DeleteAccountReason,
} from '@/types';

// ============================================
// NOTIFICATION PREFERENCES
// ============================================

/**
 * Get current notification preferences
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return apiClient.get<NotificationPreferences>('/users/me/preferences/notifications');
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  return apiClient.patch<NotificationPreferences>(
    '/users/me/preferences/notifications',
    preferences
  );
}

// ============================================
// PRIVACY SETTINGS
// ============================================

/**
 * Get current privacy settings
 */
export async function getPrivacySettings(): Promise<PrivacySettings> {
  return apiClient.get<PrivacySettings>('/users/me/preferences/privacy');
}

/**
 * Update privacy settings
 */
export async function updatePrivacySettings(
  settings: Partial<PrivacySettings>
): Promise<PrivacySettings> {
  return apiClient.patch<PrivacySettings>('/users/me/preferences/privacy', settings);
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Get all active sessions for the current user
 */
export async function getActiveSessions(): Promise<ActiveSession[]> {
  return apiClient.get<ActiveSession[]>('/auth/sessions');
}

/**
 * Revoke a specific session
 */
export async function revokeSession(sessionId: string): Promise<void> {
  await apiClient.post(`/auth/sessions/${sessionId}/revoke`);
}

/**
 * Revoke all sessions except the current one
 */
export async function revokeAllSessions(): Promise<void> {
  await apiClient.post('/auth/sessions/revoke-all');
}

/**
 * Get login history
 */
export async function getLoginHistory(limit: number = 10): Promise<LoginHistory[]> {
  return apiClient.get<LoginHistory[]>('/auth/login-history', {
    params: { limit },
  });
}

// ============================================
// PASSWORD MANAGEMENT
// ============================================

/**
 * Change password using Supabase
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const supabase = createBrowserClient();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }

  // First verify current password by attempting to sign in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    throw new Error('User not found');
  }

  // Verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    throw new Error('Mot de passe actuel incorrect');
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    throw new Error(updateError.message);
  }

  // Revoke all other sessions after password change
  try {
    await revokeAllSessions();
  } catch {
    // Ignore errors from session revocation
  }
}

// ============================================
// TWO-FACTOR AUTHENTICATION
// ============================================

/**
 * Check if 2FA is enabled
 */
export async function getTwoFactorStatus(): Promise<{ enabled: boolean }> {
  return apiClient.get<{ enabled: boolean }>('/auth/2fa/status');
}

/**
 * Initialize 2FA setup
 */
export async function initTwoFactorSetup(): Promise<TwoFactorSetupData> {
  return apiClient.post<TwoFactorSetupData>('/auth/2fa/setup');
}

/**
 * Verify and enable 2FA
 */
export async function enableTwoFactor(code: string): Promise<{ backupCodes: string[] }> {
  return apiClient.post<{ backupCodes: string[] }>('/auth/2fa/enable', { code });
}

/**
 * Disable 2FA
 */
export async function disableTwoFactor(code: string, password: string): Promise<void> {
  await apiClient.post('/auth/2fa/disable', { code, password });
}

/**
 * Get new backup codes
 */
export async function regenerateBackupCodes(code: string): Promise<{ backupCodes: string[] }> {
  return apiClient.post<{ backupCodes: string[] }>('/auth/2fa/backup-codes', { code });
}

// ============================================
// DATA EXPORT (RGPD)
// ============================================

/**
 * Request data export
 */
export async function requestDataExport(
  format: 'json' | 'csv' = 'json'
): Promise<DataExportRequest> {
  return apiClient.post<DataExportRequest>('/users/me/export-data', { format });
}

/**
 * Get data export status
 */
export async function getDataExportStatus(): Promise<DataExportRequest | null> {
  try {
    return await apiClient.get<DataExportRequest>('/users/me/export-data/status');
  } catch {
    return null;
  }
}

// ============================================
// ACCOUNT DELETION
// ============================================

/**
 * Check if account can be deleted
 */
export async function checkCanDeleteAccount(): Promise<DeleteAccountCheck> {
  return apiClient.get<DeleteAccountCheck>('/users/me/delete-check');
}

/**
 * Delete account (soft delete)
 */
export async function deleteAccount(
  reason?: DeleteAccountReason,
  feedback?: string
): Promise<void> {
  await apiClient.delete('/users/me', {
    data: { reason, feedback },
  });
}

// ============================================
// TEST NOTIFICATIONS
// ============================================

/**
 * Send a test notification
 */
export async function sendTestNotification(
  type: 'email' | 'push' | 'in_app'
): Promise<void> {
  await apiClient.post('/users/me/test-notification', { type });
}
