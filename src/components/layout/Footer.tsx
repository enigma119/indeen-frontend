import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Logo } from './Logo';

const footerLinks = {
  explore: [
    { label: 'Accueil', href: '/' },
    { label: 'Cours', href: '/mentors' },
    { label: 'Tarifs', href: '/tarifs' },
    { label: 'Blog', href: '/blog' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
    { label: 'Aide', href: '/aide' },
    { label: 'Devenir enseignant', href: '/devenir-mentor' },
  ],
  legal: [
    { label: 'CGU', href: '/cgu' },
    { label: 'Confidentialité', href: '/confidentialite' },
    { label: 'Cookies', href: '/cookies' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Logo variant="light" />
            <p className="text-white/70 max-w-sm leading-relaxed">
              Plateforme d&apos;apprentissage du Coran en ligne. Trouvez votre
              enseignant idéal et commencez votre parcours spirituel.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:contact@indeen.com"
                className="flex items-center gap-3 text-white/70 hover:text-teal-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                contact@indeen.com
              </a>
              <a
                href="tel:+33123456789"
                className="flex items-center gap-3 text-white/70 hover:text-teal-400 transition-colors"
              >
                <Phone className="w-5 h-5" />
                +33 1 23 45 67 89
              </a>
            </div>
          </div>

          {/* Explorer */}
          <div>
            <h4 className="font-semibold text-white mb-4">Explorer</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Indeen. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-teal-500 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
