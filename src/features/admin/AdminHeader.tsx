import { Archive, ArrowLeft, FileText, History, KeyRound, LogOut } from 'lucide-react';
import { Wordmark } from './AdminUI';
import { cn } from '../../lib/cn';

type AdminView = 'cartas' | 'papelera' | 'actividad';

type AdminHeaderProps = {
  username: string;
  view: AdminView;
  onView: (view: AdminView) => void;
  onPassword: () => void;
  onLogout: () => void;
};

/* En móvil cada acción es una celda alta con icono grande y etiqueta visible;
   desde md recupera exactamente la píldora horizontal de escritorio. */
const navBtn =
  'inline-flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl border px-0.5 py-2 text-center font-medium transition-colors md:min-h-0 md:flex-shrink-0 md:flex-row md:gap-2 md:rounded-full md:px-4 md:py-2 md:text-sm';

const navBtnIdle =
  'border-white/15 bg-white/5 text-slate-100 hover:border-white/25 hover:text-cta';

const navLabel = 'text-[0.6rem] leading-none md:text-sm';

const navIcon = 'h-6 w-6 md:h-4 md:w-4';

function navClass(active: boolean) {
  return cn(
    navBtn,
    active
      ? 'border-cta bg-cta font-bold text-slate-900 ring-2 ring-cta ring-offset-2 ring-offset-slate-900'
      : navBtnIdle,
  );
}

function UserBadge({ username, className }: { username: string; className?: string }) {
  return (
    <span className={cn('min-w-0 text-right', className)}>
      <span className="hidden text-[0.6rem] font-bold uppercase tracking-widest text-slate-500 md:block">
        Sesión
      </span>
      <span className="block max-w-[9rem] truncate text-sm font-medium text-white md:max-w-none">
        {username}
      </span>
    </span>
  );
}

export function AdminHeader({ username, view, onView, onPassword, onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 px-3 py-3 md:px-4 md:py-4">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-3 shadow-lg backdrop-blur-xl md:flex-row md:items-center md:justify-between md:gap-4 md:px-6">
        {/* Fila 1 en móvil: marca + usuario */}
        <div className="flex w-full items-center justify-between gap-3 md:w-auto">
          <button
            type="button"
            onClick={() => onView('cartas')}
            title="Cartas"
            className="flex-shrink-0 whitespace-nowrap rounded-xl text-left transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
          >
            <Wordmark compact />
          </button>

          <UserBadge username={username} className="md:hidden" />
        </div>

        {/* Fila 2 en móvil: botonera de 6. En md vuelve a ser la fila horizontal de siempre. */}
        <div className="grid grid-cols-6 gap-1.5 md:flex md:items-center md:gap-3">
          <a
            href="/"
            aria-label="Volver a la página principal"
            className={cn(navBtn, navBtnIdle, 'order-5 md:order-none')}
          >
            <ArrowLeft className={navIcon} />
            <span className={cn(navLabel, 'md:hidden')}>Inicio</span>
            <span className={cn(navLabel, 'hidden md:inline')}>Página principal</span>
          </a>

          <button
            type="button"
            onClick={() => onView('cartas')}
            aria-pressed={view === 'cartas'}
            title="Cartas"
            className={navClass(view === 'cartas')}
          >
            <FileText className={navIcon} />
            <span className={navLabel}>Cartas</span>
          </button>

          <button
            type="button"
            onClick={() => onView('papelera')}
            aria-pressed={view === 'papelera'}
            title="Papelera"
            className={navClass(view === 'papelera')}
          >
            <Archive className={navIcon} />
            <span className={navLabel}>Papelera</span>
          </button>

          <button
            type="button"
            onClick={() => onView('actividad')}
            aria-pressed={view === 'actividad'}
            title="Actividad"
            className={navClass(view === 'actividad')}
          >
            <History className={navIcon} />
            <span className={navLabel}>Actividad</span>
          </button>

          <button
            type="button"
            onClick={onPassword}
            title="Cambiar clave"
            className={cn(navBtn, navBtnIdle)}
          >
            <KeyRound className={navIcon} />
            <span className={navLabel}>Clave</span>
          </button>

          <UserBadge username={username} className="hidden md:block" />

          <button
            type="button"
            onClick={onLogout}
            aria-label="Salir"
            className={cn(navBtn, navBtnIdle, 'order-6 md:order-none')}
          >
            <LogOut className={navIcon} />
            <span className={navLabel}>Salir</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
