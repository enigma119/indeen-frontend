import Link from 'next/link';
import { Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import { Logo } from './Logo';
import { Separator } from '@/components/ui/separator';

const footerLinks = [
  { label: 'Comment ça marche', href: '/comment-ca-marche' },
  { label: 'Devenir mentor', href: '/devenir-mentor' },
  { label: 'Aide & Support', href: '/aide' },
  { label: 'CGU', href: '/cgu' },
  { label: 'Confidentialité', href: '/confidentialite' },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne 1: À propos */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              Plateforme de mentorat islamique pour apprendre le Coran, le Tajweed
              et la langue arabe avec des mentors qualifiés du monde entier.
            </p>
          </div>

          {/* Colonne 2: Liens */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Liens utiles</h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Colonne 3: Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-3">
              <a
                href="mailto:contact@mentorat-islamique.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-600 transition-colors"
              >
                <Mail className="h-4 w-4" />
                contact@mentorat-islamique.com
              </a>
              <div className="flex items-center gap-4 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary-600 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Mentorat Islamique. Tous droits réservés.</p>
          <p className="text-xs">
            Fait avec ❤️ pour la communauté
          </p>
        </div>
      </div>
    </footer>
  );
}
