import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { CookieOptions } from '@supabase/ssr';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/termos',
  '/privacidade',
  '/esqueci-senha',
  '/auth/callback',
];
const ADMIN_PATHS = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(p => p === pathname || (p !== '/' && pathname.startsWith(p)))) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  () => request.cookies.getAll(),
        setAll: (list: Array<{ name: string; value: string; options?: CookieOptions }>) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options ?? {})
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  const isAdmin = user.user_metadata?.role === 'admin';

  // Rota admin → exige role 'admin'
  if (ADMIN_PATHS.some(p => pathname.startsWith(p))) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return response;
  }

  // Controle de assinatura (admin sempre passa)
  if (!isAdmin) {
    const status = user.user_metadata?.subscription_status as string | undefined;
    if (status === 'expirado') {
      return NextResponse.redirect(new URL('/?expired=1', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|images|.*\\.png$|.*\\.jpg$|.*\\.svg$|api/admin/setup).*)',
  ],
};
