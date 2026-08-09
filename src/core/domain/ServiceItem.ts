import type { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  name: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  badge?: string;
}
