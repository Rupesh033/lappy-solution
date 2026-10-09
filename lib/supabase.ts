import { createClient, User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

function getSafeTarget(redirectTo?: string): string {
  if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//') && !redirectTo.startsWith('/\\')) {
    return typeof window !== 'undefined' ? `${window.location.origin}${redirectTo}` : redirectTo;
  }
  return typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback';
}

export async function signInWithGoogle(redirectTo?: string) {
  const target = getSafeTarget(redirectTo);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: target,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signOutCustomer() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export type { User };

