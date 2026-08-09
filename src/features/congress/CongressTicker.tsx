import { useCountdown } from './hooks/useCountdown';
import { RELATIC_CONGRESS_2026 } from './data/congressData';

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex flex-col items-center mx-1">
      <span className="text-base sm:text-lg font-black tabular-nums leading-none text-white drop-shadow-sm">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[0.5rem] uppercase tracking-widest text-cyan-200/70 leading-none mt-0.5">
        {label}
      </span>
    </span>
  );
}

function Separator() {
  return <span className="text-cta font-bold text-base mx-0.5 animate-pulse-soft">:</span>;
}

function TickerDot() {
  return <span className="mx-6 sm:mx-10 text-cta/40 text-xs select-none">✦</span>;
}

export function CongressTicker() {
  const congress = RELATIC_CONGRESS_2026;
  const countdown = useCountdown(congress.startDate);

  if (countdown.isExpired) return null;

  const tickerSegment = (
    <span className="inline-flex items-center whitespace-nowrap">
      {/* Congress Name */}
      <span className="inline-flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cta animate-pulse flex-shrink-0 shadow-sm shadow-cta/50" />
        <span className="font-black text-sm sm:text-base tracking-tight text-white">
          {congress.edition} {congress.name} 2026
        </span>
      </span>

      <TickerDot />

      {/* Date */}
      <span className="inline-flex items-center gap-1.5">
        <svg className="w-4 h-4 text-cta flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-semibold text-slate-100">7–9 de octubre de 2026</span>
      </span>

      <TickerDot />

      {/* Location */}
      <span className="inline-flex items-center gap-1.5">
        <svg className="w-4 h-4 text-cta flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-semibold text-slate-100">{congress.venue}, {congress.location}</span>
      </span>

      <TickerDot />

      {/* Modality */}
      <span className="inline-flex items-center gap-1.5">
        <svg className="w-4 h-4 text-cta flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-semibold text-slate-100">{congress.modality}</span>
      </span>

      <TickerDot />

      {/* Countdown */}
      <span className="inline-flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-md bg-cta/15 border border-cta/30 text-cta text-[0.6rem] font-black uppercase tracking-widest">
          Faltan
        </span>
        <span className="inline-flex items-center bg-white/5 rounded-lg px-2.5 py-1 border border-white/10">
          <CountdownUnit value={countdown.days} label="días" />
          <Separator />
          <CountdownUnit value={countdown.hours} label="hrs" />
          <Separator />
          <CountdownUnit value={countdown.minutes} label="min" />
          <Separator />
          <CountdownUnit value={countdown.seconds} label="seg" />
        </span>
      </span>

      <TickerDot />
    </span>
  );

  return (
    <div
      id="congress-ticker"
      className="fixed top-0 left-0 right-0 z-[60] w-full overflow-hidden border-b border-cta/10"
      style={{ height: '2.75rem', background: 'linear-gradient(90deg, #0c1222 0%, #0f1d32 25%, #0c1222 50%, #0f1d32 75%, #0c1222 100%)' }}
    >
      {/* Subtle animated glow line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/40 to-transparent" />

      {/* Scrolling ticker track: two copies for seamless loop */}
      <div className="absolute inset-0 flex items-center animate-congress-ticker">
        {tickerSegment}
        {tickerSegment}
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-12 sm:w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, #0c1222, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(270deg, #0c1222, transparent)' }} />
    </div>
  );
}
