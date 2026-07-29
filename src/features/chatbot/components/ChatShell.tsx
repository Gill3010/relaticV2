import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

type ChatShellProps = {
  children: ReactNode;
  onClose?: () => void;
  /** Si se define, el botón X navega a esta ruta (modo página /chatbot) */
  onCloseHref?: string;
  closeLabel?: string;
  title?: string;
  subtitle?: string;
  logoSrc?: string;
  logoAlt?: string;
};

export function ChatShell({
  children,
  onClose,
  onCloseHref,
  closeLabel = 'Cerrar asistente',
  title = 'RELATIC PANAMÁ',
  subtitle = 'Asistente de documentos',
  logoSrc = '/logo.png',
  logoAlt = 'Relatic Panamá',
}: ChatShellProps) {
  const titleNode =
    title === 'RELATIC PANAMÁ' ? (
      <>
        RELATIC <span className="text-cta">PANAMÁ</span>
      </>
    ) : (
      title
    );
  const isUteLogo = logoSrc.includes('logo-ute');

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 text-slate-50 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(253,224,71,0.08),_transparent_45%)]"
      />

      <header className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          {isUteLogo ? (
            <div className="flex h-10 w-[4.25rem] flex-shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white px-1.5 shadow-sm">
              <img src={logoSrc} alt={logoAlt} className="max-h-[85%] max-w-full object-contain" />
            </div>
          ) : (
            <img
              src={logoSrc}
              alt={logoAlt}
              className="h-10 w-10 flex-shrink-0 rounded-full object-contain ring-1 ring-white/15"
            />
          )}
          <div className="min-w-0">
            <p
              className={
                title === 'RELATIC PANAMÁ'
                  ? 'truncate text-sm font-semibold tracking-tight'
                  : 'text-[13px] font-semibold leading-snug tracking-tight sm:text-sm'
              }
            >
              {titleNode}
            </p>
            <p className="truncate text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>
        {onCloseHref ? (
          <Link
            to={onCloseHref}
            aria-label={closeLabel}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-cta"
          >
            <X className="h-5 w-5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-cta"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col p-4">{children}</main>

      <footer className="relative z-10 border-t border-white/10 px-4 py-2.5 text-center text-[11px] text-slate-500">
        Consulta con cédula o nombre completo
      </footer>
    </div>
  );
}
