import type { ComponentType, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, LayoutGrid, Mail, MapPin, Phone, Share2, Users } from 'lucide-react';
import { cn } from '../../../lib/cn';
import type { Institution } from '../../../core/domain/Institution';
import type { ServiceItem } from '../../../features/services/types';
import {
    CONTACT_ADDRESS,
    CONTACT_EMAILS,
    CONTACT_PHONES,
    CONTACT_WHATSAPP,
    SOCIAL_LINKS,
} from '../../../features/contact/data/contactData';

type IconComponent = ComponentType<{ className?: string }>;

/* ── Microinteracción de entrada: escalonado corto y discreto ────────────── */

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
};

function Stagger({ className, children }: { className?: string; children: ReactNode }) {
    const reduceMotion = useReducedMotion();
    if (reduceMotion) return <div className={className}>{children}</div>;
    return (
        <motion.div
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {children}
        </motion.div>
    );
}

function StaggerItem({ className, children }: { className?: string; children: ReactNode }) {
    const reduceMotion = useReducedMotion();
    if (reduceMotion) return <div className={className}>{children}</div>;
    return (
        <motion.div className={className} variants={itemVariants}>
            {children}
        </motion.div>
    );
}

/* ── Pieza común: icono en círculo + título + descripción de una línea ───── */

type PanelItemProps = {
    icon: IconComponent;
    title: string;
    description?: string;
    href?: string;
    badge?: string;
    external?: boolean;
    className?: string;
    onNavigate?: () => void;
};

export function PanelItem({
    icon: Icon,
    title,
    description,
    href,
    badge,
    external,
    className: extraClassName,
    onNavigate,
}: PanelItemProps) {
    const content = (
        <>
            <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cta/10 text-slate-700 transition-colors group-hover:bg-cta group-hover:text-slate-900 dark:text-slate-200">
                <Icon className="h-5 w-5" />
            </span>
            <span className="ml-3 min-w-0 flex-1">
                <span className="mb-0.5 flex min-w-0 items-center gap-2">
                    {/* `anywhere` (y no `break-word`) para que el min-content del
                        ítem flex baje y cadenas sin espacios —un correo— quepan. */}
                    <span className="min-w-0 text-sm font-bold tracking-tight text-slate-900 [overflow-wrap:anywhere] transition-colors group-hover:text-cta dark:text-white">
                        {title}
                    </span>
                    {badge && (
                        <span className="flex-shrink-0 rounded-full border border-cta/40 bg-cta/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-cta">
                            {badge}
                        </span>
                    )}
                </span>
                {description && (
                    <span className="line-clamp-2 block text-xs leading-snug text-slate-600 dark:text-slate-400">
                        {description}
                    </span>
                )}
            </span>
        </>
    );

    // Hover canónico del sistema (ver InstitutionsCarousel): elevar + borde cta
    // + glow. El borde transparente de base evita el salto de 1px al aparecer.
    const className =
        'group flex h-full items-start overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cta/40 hover:shadow-lg hover:shadow-cta/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-800/60 dark:focus-visible:ring-offset-slate-900';

    if (!href) {
        return <span className={cn(className, 'cursor-default', extraClassName)}>{content}</span>;
    }

    return (
        <a
            href={href}
            onClick={onNavigate}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={cn(className, extraClassName)}
        >
            {content}
        </a>
    );
}

/** Chip de acento que da identidad a cada encabezado. */
function HeadingChip({ icon: Icon, size = 'sm' }: { icon: IconComponent; size?: 'sm' | 'md' }) {
    return (
        <span
            className={cn(
                'flex flex-shrink-0 items-center justify-center rounded-full border border-cta/40 bg-cta/20',
                size === 'md' ? 'h-7 w-7' : 'h-6 w-6',
            )}
        >
            <Icon
                className={cn('text-slate-700 dark:text-cta', size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3')}
            />
        </span>
    );
}

function PanelGroup({
    icon,
    title,
    children,
}: {
    icon: IconComponent;
    title: string;
    children: ReactNode;
}) {
    return (
        <div>
            <div className="mb-2.5 flex items-center gap-2 px-1">
                <HeadingChip icon={icon} />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {title}
                </h3>
            </div>
            <Stagger className="space-y-2.5">{children}</Stagger>
        </div>
    );
}

/**
 * Encabezado de panel: chip de acento + rótulo + cifra opcional, rematado con
 * una regla que aprovecha el blanco de la fila. Se omite en `compact`, donde el
 * acordeón ya rotula el bloque.
 */
function PanelHeading({
    icon,
    children,
    meta,
    compact,
}: {
    icon: IconComponent;
    children: ReactNode;
    meta?: string;
    compact?: boolean;
}) {
    if (compact) return null;

    return (
        <div className="mb-4 flex items-center gap-2.5 px-1">
            <HeadingChip icon={icon} size="md" />
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {children}
            </h3>
            {meta && (
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {meta}
                </span>
            )}
            <span
                aria-hidden="true"
                className="ml-1 h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10"
            />
        </div>
    );
}

/** Hairline en degradado, como los separadores de ExploreRelatic. */
function PanelDivider() {
    return (
        <div
            aria-hidden="true"
            className="h-px bg-gradient-to-r from-slate-200 via-slate-200 to-transparent dark:from-white/15 dark:via-white/10"
        />
    );
}

function PanelFooterLink({ href, children, onNavigate }: { href: string; children: ReactNode; onNavigate?: () => void }) {
    return (
        <a
            href={href}
            onClick={onNavigate}
            className="group inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-bold tracking-tight text-slate-700 transition-colors hover:text-cta focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 dark:text-slate-200"
        >
            {children}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
    );
}

/* ── Servicios ───────────────────────────────────────────────────────────── */

export function ServicesPanel({
    services,
    onNavigate,
    compact,
}: {
    services: ServiceItem[];
    onNavigate?: () => void;
    compact?: boolean;
}) {
    return (
        <div>
            <PanelHeading icon={LayoutGrid} compact={compact}>Servicios</PanelHeading>
            <Stagger className={cn('grid gap-2.5', !compact && 'grid-cols-2')}>
                {services.map((service, index) => (
                    <StaggerItem
                        key={service.name}
                        // Con un número impar de servicios el último ocuparía media
                        // fila suelta; a ancho completo la rejilla cierra limpia.
                        className={cn(
                            !compact &&
                                services.length % 2 === 1 &&
                                index === services.length - 1 &&
                                'col-span-2',
                        )}
                    >
                        <PanelItem
                            icon={service.icon as IconComponent}
                            title={service.name}
                            description={service.description}
                            href={service.href}
                            badge={service.badge}
                            onNavigate={onNavigate}
                        />
                    </StaggerItem>
                ))}
            </Stagger>
        </div>
    );
}

/* ── Convenios ───────────────────────────────────────────────────────────── */

export function ConveniosPanel({
    institutions,
    onNavigate,
    compact,
}: {
    institutions: Institution[];
    onNavigate?: () => void;
    compact?: boolean;
}) {
    return (
        <div>
            <PanelHeading
                icon={Users}
                compact={compact}
                meta={`${institutions.length} ${institutions.length === 1 ? 'institución' : 'instituciones'}`}
            >
                Convenios
            </PanelHeading>
            {/* El scroll interno solo en escritorio: en el drawer móvil anidarlo
                dentro de otro scroll se siente atascado al tacto. */}
            <div className={cn(!compact && 'max-h-[22rem] overflow-y-auto pr-1')}>
                <Stagger className={cn('grid gap-2.5', !compact && 'grid-cols-3')}>
                    {institutions.map((institution) => {
                        const inner = (
                            <>
                                <span className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-1.5 ring-1 ring-slate-200 dark:bg-white dark:ring-slate-700">
                                    <img
                                        src={institution.src}
                                        alt=""
                                        loading="lazy"
                                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                                    />
                                    {/* Velo de marca del InstitutionsCarousel. */}
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cta/25 via-transparent to-primary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    />
                                </span>
                                <span className="ml-3 min-w-0 flex-1 text-sm font-semibold tracking-tight text-slate-900 [overflow-wrap:anywhere] transition-colors group-hover:text-cta dark:text-white">
                                    {institution.alt}
                                </span>
                            </>
                        );

                        const base =
                            'group flex h-full items-center rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-800/60 dark:focus-visible:ring-offset-slate-900';

                        const card = institution.href ? (
                            <a
                                href={institution.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={onNavigate}
                                className={cn(
                                    base,
                                    'hover:-translate-y-0.5 hover:border-cta/40 hover:shadow-lg hover:shadow-cta/15',
                                )}
                            >
                                {inner}
                            </a>
                        ) : (
                            <span className={cn(base, 'cursor-default opacity-70')}>{inner}</span>
                        );

                        return <StaggerItem key={institution.alt}>{card}</StaggerItem>;
                    })}
                </Stagger>
            </div>

            <div className="mt-4">
                <PanelDivider />
                <div className="pt-3">
                    <PanelFooterLink href="/#instituciones" onNavigate={onNavigate}>
                        Ver todos los convenios
                    </PanelFooterLink>
                </div>
            </div>
        </div>
    );
}

/* ── Contacto ────────────────────────────────────────────────────────────── */

export function ContactoPanel({ onNavigate, compact }: { onNavigate?: () => void; compact?: boolean }) {
    return (
        <div>
            {/* La columna del correo pesa más: es la única con una cadena larga
                e indivisible, y así cabe en una sola línea en escritorio. */}
            <div className={cn('grid gap-4', !compact && 'grid-cols-[1fr_1.3fr_0.9fr]')}>
                <PanelGroup icon={Phone} title="Llámanos">
                    {CONTACT_PHONES.map((phone) => (
                        <PanelItem
                            key={phone.href}
                            icon={Phone}
                            title={phone.label}
                            description={phone.description}
                            href={phone.href}
                            onNavigate={onNavigate}
                        />
                    ))}
                </PanelGroup>

                <PanelGroup icon={Mail} title="Escríbenos">
                    {CONTACT_EMAILS.map((email) => (
                        <PanelItem
                            key={email.href}
                            icon={Mail}
                            title={email.label}
                            description={email.description}
                            href={email.href}
                            onNavigate={onNavigate}
                        />
                    ))}
                    <PanelItem
                        icon={CONTACT_WHATSAPP.icon}
                        title={CONTACT_WHATSAPP.label}
                        description={CONTACT_WHATSAPP.description}
                        href={CONTACT_WHATSAPP.href}
                        external={CONTACT_WHATSAPP.external}
                        onNavigate={onNavigate}
                    />
                </PanelGroup>

                <PanelGroup icon={Share2} title="Síguenos">
                    {/* 3 por fila: con `flex-wrap` los 6 caían 5+1 y dejaban huérfano el último. */}
                    <div className="grid w-fit grid-cols-3 gap-2 px-1">
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.name}
                                title={social.name}
                                onClick={onNavigate}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-transparent bg-slate-800 transition-all duration-300 hover:scale-110 hover:border-cta/40 hover:shadow-lg hover:shadow-cta/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-900"
                            >
                                <social.icon className={cn('h-5 w-5', social.brandClass)} />
                            </a>
                        ))}
                    </div>
                </PanelGroup>
            </div>

            <div className="mt-5">
                {/* Único guiño al cyan: la paleta del sistema es bicromática. */}
                <div
                    aria-hidden="true"
                    className="h-px bg-gradient-to-r from-cta/40 via-cyan-400/30 to-transparent"
                />
                <div className="flex items-center gap-3 px-1 pt-3 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-cta/40 bg-cta/20">
                    <MapPin className="h-4 w-4 text-slate-700 dark:text-slate-200" />
                </span>
                    <span>{CONTACT_ADDRESS.label}</span>
                </div>
            </div>
        </div>
    );
}
