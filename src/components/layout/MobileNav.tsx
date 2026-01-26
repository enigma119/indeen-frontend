'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
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
  { label: 'Trouver un mentor', href: '/mentors' },
  { label: 'Devenir mentor', href: '/devenir-mentor' },
  { label: 'Comment ça marche', href: '/comment-ca-marche' },
];

interface MobileNavProps {
  isAuthenticated?: boolean;
}

export function MobileNav({ isAuthenticated = false }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary-600 transition-colors py-2 border-b border-border"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {!isAuthenticated && (
          <div className="flex flex-col gap-3 mt-8 pt-8 border-t">
            <Button variant="outline" asChild className="w-full">
              <Link href="/connexion" onClick={() => setOpen(false)}>
                Connexion
              </Link>
            </Button>
            <Button asChild className="w-full bg-primary-500 hover:bg-primary-600">
              <Link href="/inscription" onClick={() => setOpen(false)}>
                Inscription
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
