'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import { UserMenu } from './UserMenu';

const navItems = [
  { label: 'Trouver un mentor', href: '/mentors' },
  { label: 'Devenir mentor', href: '/devenir-mentor' },
  { label: 'Comment ça marche', href: '/comment-ca-marche' },
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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const isAuthenticated = !!user;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b transition-shadow duration-200',
        isScrolled && 'shadow-md'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hidden sm:flex"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle dark mode</span>
            </Button>

            {/* Auth buttons / User menu */}
            {isAuthenticated ? (
              <UserMenu user={user} />
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button variant="outline" asChild>
                  <Link href="/connexion">Connexion</Link>
                </Button>
                <Button asChild className="bg-primary-500 hover:bg-primary-600">
                  <Link href="/inscription">Inscription</Link>
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
