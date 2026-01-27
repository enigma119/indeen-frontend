/**
 * Supabase Database types
 * This file should be generated using Supabase CLI: npx supabase gen types typescript
 * For now, we use a minimal type definition
 */
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'MENTOR' | 'MENTEE' | 'ADMIN' | 'PARENT';
          first_name: string;
          last_name: string;
          avatar_url: string | null;
          country_code: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'MENTOR' | 'MENTEE' | 'ADMIN' | 'PARENT';
    };
  };
};
