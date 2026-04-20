'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isClean =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/termos') ||
    pathname.startsWith('/privacidade') ||
    pathname.startsWith('/esqueci-senha') ||
    pathname.startsWith('/admin');

  if (isClean) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 md:ml-56">
          {children}
        </main>
      </div>
      <BottomNav />
    </>
  );
}
