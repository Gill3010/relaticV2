import { CalendarDays, MapPin } from 'lucide-react';
import { ChatWidget } from '../features/chatbot/ChatWidget';

const TICKER_ITEMS = [
  'Bienvenidos, estudiantes de la University of Technology and Education (UTE)',
  'Global Education and Technology Congress',
  'Universidad Católica Luis Amigó · Medellín, Colombia',
  '17 y 18 de abril de 2026',
  'Grupo de Doctorado de Panamá',
  'Consulta el estado de tu artículo científico',
  '“Redefining the Possible, Leading the Future through Education”',
  'Si participaste en el congreso, ingresa tu cédula o nombre completo',
  'Cartas de aceptación y publicaciones disponibles según tu registro',
];

/** Página compartible: cintillo institucional a ancho completo + asistente. */
export function ChatbotPage() {
  const tickerSequence = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-slate-950 text-slate-50">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_rgba(34,211,238,0.12),_transparent_45%),radial-gradient(ellipse_at_80%_0%,_rgba(253,224,71,0.08),_transparent_40%)]" />
      </div>

      <div className="relative z-10 flex min-h-dvh w-full flex-col pb-8">
        {/* Cintillo a todo el ancho de la pantalla */}
        <header className="w-full border-b border-white/15 bg-slate-900/80 shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex w-full items-stretch">
            <div className="flex shrink-0 items-center gap-3 border-r border-white/10 bg-white/[0.06] px-3 py-2.5 sm:px-5">
              <div className="flex h-11 w-[4.5rem] items-center justify-center rounded-xl border border-white/30 bg-white px-1.5 shadow-sm sm:h-12 sm:w-24">
                <img
                  src="/logo-ute.png"
                  alt="University of Technology and Education (UTE)"
                  className="max-h-[85%] max-w-full object-contain"
                />
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  UTE
                </p>
                <p className="truncate text-xs font-medium text-slate-200">Congreso 2026</p>
              </div>
            </div>

            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-slate-900 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-slate-900 to-transparent"
              />

              <div className="flex h-full items-center py-2.5">
                <div className="animate-congress-ticker flex w-max items-center gap-0 whitespace-nowrap will-change-transform">
                  {tickerSequence.map((item, index) => (
                    <span key={`${item}-${index}`} className="inline-flex items-center">
                      <span className="px-5 text-sm text-slate-100/95 sm:px-6 sm:text-[15px]">
                        {item}
                      </span>
                      <span
                        aria-hidden
                        className="mx-1 inline-block h-1 w-1 rounded-full bg-cta/80"
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-1 border-t border-white/10 bg-white/[0.03] px-4 py-1.5 text-[11px] text-slate-400 sm:justify-between sm:px-6">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3 w-3 text-cta" aria-hidden />
              17–18 abr 2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-cyan-300" aria-hidden />
              Luis Amigó · Medellín
            </span>
            <span className="hidden text-slate-500 md:inline">
              Doctorado de Panamá · Global Education and Technology Congress
            </span>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-5 sm:px-6 lg:px-8">
          <p className="mb-4 text-center text-sm leading-snug text-slate-300 sm:text-[15px]">
            Bienvenidos, estudiantes de la{' '}
            <span className="font-medium text-slate-100">
              University of Technology and Education (UTE)
            </span>
            . Ingrese sus datos para consultar el estado de su artículo científico.
          </p>

          <div className="flex flex-1 flex-col items-center justify-start pt-1 sm:justify-center sm:pt-0">
            <ChatWidget variant="page" />
          </div>
        </div>
      </div>
    </div>
  );
}
