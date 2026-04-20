import { createBrowserClient } from '@supabase/ssr';

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Usar em Client Components ('use client') */
export function createClient() {
  return createBrowserClient(URL, ANON);
}

export type { User, Session } from '@supabase/supabase-js';
