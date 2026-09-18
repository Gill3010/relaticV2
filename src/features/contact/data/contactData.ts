import type { ComponentType } from 'react';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { WhatsAppIcon, XIcon, YouTubeIcon } from '../components/BrandIcons';

export type IconComponent = ComponentType<{ className?: string }>;

export type ContactChannel = {
  /** Texto que se muestra (y el que el Footer ya mostraba). */
  label: string;
  /** Descripción de una línea para los paneles del navbar. */
  description: string;
  href: string;
  icon: IconComponent;
  external?: boolean;
};

export type SocialLink = {
  name: string;
  href: string;
  icon: IconComponent;
  /** Color de marca; se usa sobre chip oscuro en Footer y Navbar. */
  brandClass: string;
};

/** Correo de administración. */
export const CONTACT_EMAILS: ContactChannel[] = [
  {
    label: 'administracion@relaticpanama.org',
    description: 'Escríbenos un correo',
    href: 'mailto:administracion@relaticpanama.org',
    icon: Mail,
  },
];

/** Teléfonos fijos/móviles de la organización. */
export const CONTACT_PHONES: ContactChannel[] = [
  {
    label: '+507 6645-7685',
    description: 'Toca para llamar',
    href: 'tel:+50766457685',
    icon: Phone,
  },
  {
    label: '+507 208-4689',
    description: 'Toca para llamar',
    href: 'tel:+5072084689',
    icon: Phone,
  },
];

/** WhatsApp: número distinto al de los teléfonos de arriba. */
export const CONTACT_WHATSAPP: ContactChannel = {
  label: 'WhatsApp',
  description: 'Chatea con nosotros',
  href: 'https://wa.me/50766751782',
  icon: WhatsAppIcon,
  external: true,
};

export const CONTACT_ADDRESS = {
  label: 'Ciudad de Panamá, Panamá',
  icon: MapPin as IconComponent,
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/relatic-panam%C3%A1-a80b93356/',
    icon: Linkedin,
    brandClass: 'text-[#0A66C2]',
  },
  {
    name: 'X',
    href: 'https://x.com/RelaticPanama',
    icon: XIcon,
    brandClass: 'text-white',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/people/Relatic-Panam%C3%A1/61573905375213/',
    icon: Facebook,
    brandClass: 'text-[#1877F2]',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/relatic.panama',
    icon: Instagram,
    brandClass: 'text-[#E1306C]',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@RelaticPanama',
    icon: YouTubeIcon,
    brandClass: 'text-[#FF0000]',
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/50766751782',
    icon: WhatsAppIcon,
    brandClass: 'text-[#25D366]',
  },
];
