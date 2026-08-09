import { BookOpen, Monitor, Book, GraduationCap, Scale } from 'lucide-react';
import type { ServiceItem } from '../types';

export const DEFAULT_SERVICES: ServiceItem[] = [
  { name: 'Revistas Indexadas', description: 'Publicación académica de alto impacto', icon: BookOpen, href: 'https://relaticpanama.org/_journals/' },
  { name: 'Carteles Digitales', description: 'Presentaciones interactivas modernas', icon: Monitor, href: 'https://relaticpanama.org/_posters/' },
  { name: 'Libros Digitales', description: 'Edición y distribución de libros digitales', icon: Book, href: 'https://relaticpanama.org/_books/index.php/edrp/catalog' },
  { name: 'Plataforma de aprendizaje continuo', description: 'Cursos y actualizaciones constantes', icon: GraduationCap, href: 'https://relaticpanama.org/_classroom/' },
  { name: 'Propiedad Intelectual', description: 'Protección de tus creaciones', icon: Scale, badge: 'Próximamente' },
];
