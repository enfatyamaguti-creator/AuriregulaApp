import { createServerClient, type CookieMethodsServer } from '@supabase/ssr';
import { cookies } from 'next/headers';

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Usar em Server Components, Route Handlers e Server Actions */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  const cookieMethods: CookieMethodsServer = {
    getAll:  () => cookieStore.getAll(),
    setAll: (list) => {
      try {
        list.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      } catch {
        // Server Components são read-only; o middleware renova o token
      }
    },
  };
  return createServerClient(URL, ANON, { cookies: cookieMethods });
}
