import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useServicesAdapter } from '../../adapters/primary/hooks/useServicesAdapter';
import { useInstitutionsAdapter } from '../../adapters/primary/hooks/useInstitutionsAdapter';
import { ConveniosPanel, ContactoPanel, ServicesPanel } from './navbar/MenuPanels';

type MenuId = 'convenios' | 'servicios' | 'contacto';

const MENU_LABELS: Record<MenuId, string> = {
    convenios: 'Convenios',
    servicios: 'Servicios',
    contacto: 'Contacto',
};

/** Margen para cruzar el hueco entre el ítem y el panel sin que se cierre. */
const CLOSE_DELAY = 150;

type PanelMotionState = { opacity: number; y?: number };

type PanelMotion = {
    initial: PanelMotionState;
    animate: PanelMotionState;
    exit: PanelMotionState;
    transition: { duration: number; ease?: 'easeOut' };
};

type NavMenuProps = {
    id: MenuId;
    expanded: boolean;
    panelMotion: PanelMotion;
    onOpen: (id: MenuId) => void;
    onScheduleClose: () => void;
    onCancelClose: () => void;
    onToggle: (id: MenuId) => void;
    registerRef: (id: MenuId, el: HTMLButtonElement | null) => void;
    children: ReactNode;
};

/**
 * El envoltorio NO lleva `relative`: así el panel absoluto resuelve contra el
 * `<nav>` (que sí es relative) y queda centrado en el nav/viewport, mientras
 * que en el DOM sigue justo detrás de su disparador (orden de tab lógico).
 */
function NavMenu({
    id,
    expanded,
    panelMotion,
    onOpen,
    onScheduleClose,
    onCancelClose,
    onToggle,
    registerRef,
    children,
}: NavMenuProps) {
    return (
        <div
            className="flex items-center"
            onMouseEnter={() => onOpen(id)}
            onMouseLeave={onScheduleClose}
        >
            <button
                type="button"
                ref={(el) => registerRef(id, el)}
                id={`nav-trigger-${id}`}
                aria-haspopup="dialog"
                aria-expanded={expanded}
                aria-controls={`nav-panel-${id}`}
                onClick={() => onToggle(id)}
                onFocus={() => onOpen(id)}
                className={cn(
                    'flex min-h-[44px] cursor-pointer items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium outline-none transition-colors hover:text-cta focus-visible:ring-2 focus-visible:ring-cta/50',
                    expanded && 'bg-slate-900/5 text-cta dark:bg-white/10',
                )}
            >
                <span>{MENU_LABELS[id]}</span>
                <ChevronDown
                    className={cn('h-4 w-4 transition-transform duration-200', expanded && 'rotate-180')}
                />
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        {...panelMotion}
                        onMouseEnter={onCancelClose}
                        onMouseLeave={onScheduleClose}
                        style={{ x: '-50%' }}
                        className="absolute left-1/2 top-full hidden w-[min(92vw,960px)] max-w-[960px] pt-3 lg:block"
                    >
                        <div
                            id={`nav-panel-${id}`}
                            role="group"
                            aria-labelledby={`nav-trigger-${id}`}
                            className="relative max-h-[calc(100vh-11rem)] overflow-y-auto overflow-x-hidden rounded-[1.75rem] border border-slate-200/80 bg-slate-50/95 p-6 shadow-2xl shadow-slate-900/25 ring-1 ring-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95 dark:ring-white/5"
                        >
                            {/* Blob de marca, quieto (sin animate-blob) para no distraer. */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-cta/10 blur-[80px]"
                            />
                            <div className="relative">{children}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

type MobileAccordionProps = {
    id: MenuId;
    expanded: boolean;
    reduceMotion: boolean;
    onToggle: (id: MenuId) => void;
    children: ReactNode;
};

function MobileAccordion({ id, expanded, reduceMotion, onToggle, children }: MobileAccordionProps) {
    return (
        <div className="border-b border-slate-200 dark:border-slate-800">
            <button
                type="button"
                id={`nav-acc-trigger-${id}`}
                aria-expanded={expanded}
                aria-controls={`nav-acc-${id}`}
                onClick={() => onToggle(id)}
                className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-xl p-3 text-lg font-medium text-slate-800 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 dark:text-white dark:hover:bg-slate-800',
                    expanded && 'bg-slate-100 dark:bg-slate-800',
                )}
            >
                <span className="min-w-0 truncate text-left">{MENU_LABELS[id]}</span>
                <ChevronDown
                    className={cn('h-5 w-5 flex-shrink-0 transition-transform duration-200', expanded && 'rotate-180')}
                />
            </button>
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        id={`nav-acc-${id}`}
                        role="region"
                        aria-labelledby={`nav-acc-trigger-${id}`}
                        initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-3">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
    const [openAccordion, setOpenAccordion] = useState<MenuId | null>(null);

    const { services } = useServicesAdapter();
    const { institutions } = useInstitutionsAdapter();

    const reduceMotion = useReducedMotion();
    const closeTimer = useRef<number | null>(null);
    const triggerRefs = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});

    const cancelClose = useCallback(() => {
        if (closeTimer.current !== null) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    }, []);

    const scheduleClose = useCallback(() => {
        cancelClose();
        closeTimer.current = window.setTimeout(() => setOpenMenu(null), CLOSE_DELAY);
    }, [cancelClose]);

    const openNow = useCallback(
        (id: MenuId) => {
            cancelClose();
            setOpenMenu(id);
        },
        [cancelClose],
    );

    useEffect(() => cancelClose, [cancelClose]);

    // Escape cierra el panel abierto y devuelve el foco a su disparador.
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key !== 'Escape') return;
            if (openMenu) {
                const trigger = triggerRefs.current[openMenu];
                cancelClose();
                setOpenMenu(null);
                trigger?.focus();
            }
            if (mobileMenuOpen) setMobileMenuOpen(false);
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [openMenu, mobileMenuOpen, cancelClose]);

    const panelMotion = reduceMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 } }
        : {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 12 },
              transition: { duration: 0.2, ease: 'easeOut' as const },
          };

    const registerRef = useCallback((id: MenuId, el: HTMLButtonElement | null) => {
        triggerRefs.current[id] = el;
    }, []);

    const toggleMenu = useCallback(
        (id: MenuId) => {
            setOpenMenu((current) => {
                if (current === id) return null;
                cancelClose();
                return id;
            });
        },
        [cancelClose],
    );

    const toggleAccordion = useCallback((id: MenuId) => {
        setOpenAccordion((current) => (current === id ? null : id));
    }, []);

    const closeMobile = () => setMobileMenuOpen(false);

    return (
        <header className="fixed top-[2.75rem] left-0 right-0 z-50 px-4 py-4">

            <nav className="relative max-w-7xl mx-auto glass rounded-2xl px-6 py-4 flex items-center justify-between text-slate-800 dark:text-white bg-white/40 dark:bg-slate-900/40">
                {/* Logo */}
                {/* Sin `flex-shrink-0`: el bloque debe poder ceder ancho, o empuja
                    fuera del nav al botón de menú (móvil) y al CTA (tablet). */}
                <a href="/" className="flex min-w-0 items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-cta/50 cursor-pointer">
                    <img
                        src="/logo.png"
                        alt="Relatic Panamá"
                        className="h-12 w-12 sm:h-14 sm:w-14 object-contain flex-shrink-0"
                    />
                    <div className="flex min-w-0 flex-col">
                        <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                            RELATIC <span className="text-cta">PANAMÁ</span>
                        </span>
                        {/* Sin <br/>: el salto forzado fijaba un max-content de 197px. */}
                        <span className="line-clamp-2 text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest leading-tight mt-1">
                            Red Latinoamericana de Investigaciones Cualitativas...
                        </span>
                    </div>
                </a>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center space-x-5">
                    <a href="/" className="flex min-h-[44px] items-center rounded-lg px-2.5 text-sm font-medium outline-none transition-colors hover:text-cta focus-visible:ring-2 focus-visible:ring-cta/50">Inicio</a>
                    <NavMenu
                        id="convenios"
                        expanded={openMenu === 'convenios'}
                        panelMotion={panelMotion}
                        onOpen={openNow}
                        onScheduleClose={scheduleClose}
                        onCancelClose={cancelClose}
                        onToggle={toggleMenu}
                        registerRef={registerRef}
                    >
                        <ConveniosPanel institutions={institutions} />
                    </NavMenu>
                    <a href="https://relaticpanama.org/_blog/" className="flex min-h-[44px] items-center rounded-lg px-2.5 text-sm font-medium outline-none transition-colors hover:text-cta focus-visible:ring-2 focus-visible:ring-cta/50">Blog</a>
                    <NavMenu
                        id="servicios"
                        expanded={openMenu === 'servicios'}
                        panelMotion={panelMotion}
                        onOpen={openNow}
                        onScheduleClose={scheduleClose}
                        onCancelClose={cancelClose}
                        onToggle={toggleMenu}
                        registerRef={registerRef}
                    >
                        <ServicesPanel services={services} />
                    </NavMenu>
                    <NavMenu
                        id="contacto"
                        expanded={openMenu === 'contacto'}
                        panelMotion={panelMotion}
                        onOpen={openNow}
                        onScheduleClose={scheduleClose}
                        onCancelClose={cancelClose}
                        onToggle={toggleMenu}
                        registerRef={registerRef}
                    >
                        <ContactoPanel />
                    </NavMenu>
                </div>

                {/* CTA Desktop */}
                <div className="hidden lg:flex flex-shrink-0">
                    <a href="https://miembros.relatic.org/login" className="bg-cta text-slate-900 font-semibold px-6 py-2.5 rounded-full hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cta/20 inline-flex items-center min-h-[44px] outline-none focus-visible:ring-2 focus-visible:ring-cta/50 focus-visible:ring-offset-2">
                        Regístrate
                    </a>
                </div>

                {/* Mobile menu button */}
                <div className="lg:hidden flex flex-shrink-0 items-center">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Abrir menú"
                        aria-expanded={mobileMenuOpen}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-800 dark:text-white hover:text-cta transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cta/50"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

            </nav>

            {/* Mobile Drawer Right-to-Left */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobile}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[min(22rem,100vw-1.5rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-[70] p-5 shadow-2xl border-l border-white/20 dark:border-slate-800 overflow-y-auto overflow-x-hidden"
                        >
                            <div className="flex flex-col mb-8">
                                <div className="flex items-start justify-between gap-2">
                                    <a href="/" onClick={closeMobile} className="flex min-w-0 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-cta/50">
                                        <img
                                            src="/logo.png"
                                            alt="Relatic Panamá"
                                            className="h-12 w-12 object-contain flex-shrink-0"
                                        />
                                        <div className="flex min-w-0 flex-col">
                                            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                                                RELATIC <span className="text-cta">PANAMÁ</span>
                                            </span>
                                            <span className="line-clamp-2 text-[0.55rem] font-bold text-slate-500 uppercase tracking-widest leading-tight mt-1">
                                                Red Latinoamericana de Investigaciones Cualitativas...
                                            </span>
                                        </div>
                                    </a>
                                    <button
                                        onClick={closeMobile}
                                        aria-label="Cerrar menú"
                                        className="flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-cta/50 dark:text-slate-400 dark:hover:text-white"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1">
                                <a href="/" onClick={closeMobile} className="text-lg font-medium p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800">Inicio</a>

                                <MobileAccordion
                                    id="convenios"
                                    expanded={openAccordion === 'convenios'}
                                    reduceMotion={Boolean(reduceMotion)}
                                    onToggle={toggleAccordion}
                                >
                                    <ConveniosPanel institutions={institutions} onNavigate={closeMobile} compact />
                                </MobileAccordion>

                                <a href="https://relaticpanama.org/_blog/" onClick={closeMobile} className="text-lg font-medium p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800">Blog</a>

                                <MobileAccordion
                                    id="servicios"
                                    expanded={openAccordion === 'servicios'}
                                    reduceMotion={Boolean(reduceMotion)}
                                    onToggle={toggleAccordion}
                                >
                                    <ServicesPanel services={services} onNavigate={closeMobile} compact />
                                </MobileAccordion>

                                <MobileAccordion
                                    id="contacto"
                                    expanded={openAccordion === 'contacto'}
                                    reduceMotion={Boolean(reduceMotion)}
                                    onToggle={toggleAccordion}
                                >
                                    <ContactoPanel onNavigate={closeMobile} compact />
                                </MobileAccordion>

                                <a href="https://miembros.relatic.org/login" onClick={closeMobile} className="w-full mt-6 bg-cta text-slate-900 font-semibold px-5 py-3.5 rounded-xl hover:bg-yellow-400 shadow-lg shadow-cta/20 transition-all active:scale-95 inline-block text-center">
                                    Regístrate
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
