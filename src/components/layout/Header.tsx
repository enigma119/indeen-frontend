'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import { UserMenu } from './UserMenu';

const navItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Cours', href: '/mentors' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Blog', href: '/blog' },
];

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatar_url?: string;
  };
}

export function Header({ user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthenticated = !!user;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-md py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo variant="dark" />

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-navy-700 hover:text-teal-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side - Auth buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <UserMenu user={user} />
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  asChild
                  variant="ghost"
                  className="text-navy-700 hover:text-navy-900 hover:bg-navy-100/50 rounded-full px-6"
                >
                  <Link href="/connexion">Connexion</Link>
                </Button>
                <Button
                  asChild
                  className="bg-navy-800 hover:bg-navy-900 text-white rounded-full px-6"
                >
                  <Link href="/inscription">S&apos;inscrire</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <MobileNav isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </header>
  );
}
