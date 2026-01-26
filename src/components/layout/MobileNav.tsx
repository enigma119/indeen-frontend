'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';

const navItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Cours', href: '/mentors' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Blog', href: '/blog' },
];

interface MobileNavProps {
  isAuthenticated?: boolean;
}

export function MobileNav({ isAuthenticated = false }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-navy-700">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-white">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-navy-700 hover:text-teal-600 hover:bg-sky-50 transition-colors py-3 px-4 rounded-lg"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {!isAuthenticated && (
          <div className="flex flex-col gap-3 mt-8 pt-8 border-t border-sky-100">
            <Button
              variant="outline"
              asChild
              className="w-full rounded-full border-navy-200 text-navy-700"
            >
              <Link href="/connexion" onClick={() => setOpen(false)}>
                Connexion
              </Link>
            </Button>
            <Button
              asChild
              className="w-full rounded-full bg-navy-800 hover:bg-navy-900 text-white"
            >
              <Link href="/inscription" onClick={() => setOpen(false)}>
                S&apos;inscrire
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
