import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { lookupIdentity } from './api/chatApi';
import { ChatShell } from './components/ChatShell';
import { DocumentsList } from './components/DocumentsList';
import { IdentityForm } from './components/IdentityForm';
import { MessageBubble } from './components/MessageBubble';
import type { ChatStep, IdentityPayload, LookupResponse } from './types';

const STEPS = {
  IDENTITY: 'identity',
  RESULT: 'result',
} as const satisfies Record<string, ChatStep>;

const NOT_FOUND_MESSAGE =
  'Verifique sus datos e inténtelo nuevamente. Si el problema persiste, comuníquese al siguiente contacto: +507 6769-9968.';

type ChatWidgetProps = {
  /** floating = botón del landing; page = enlace directo /chatbot */
  variant?: 'floating' | 'page';
};

export function ChatWidget({ variant = 'floating' }: ChatWidgetProps) {
  const isPage = variant === 'page';
  const [open, setOpen] = useState(isPage);
  const [step, setStep] = useState<ChatStep>(STEPS.IDENTITY);
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState<IdentityPayload>({
    nombre_completo: '',
    cedula: '',
  });
  const [lookup, setLookup] = useState<LookupResponse | null>(null);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [open, step, loading, lookup, error]);

  async function handleLookup(data: IdentityPayload) {
    setLoading(true);
    setError('');
    setIdentity(data);
    try {
      const result = await lookupIdentity(data);
      setLookup(result);
      if (result.user?.nombre_completo) {
        setIdentity((prev) => ({
          ...prev,
          nombre_completo: result.user!.nombre_completo,
          cedula: result.user!.cedula || prev.cedula,
        }));
      }
      setStep(STEPS.RESULT);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos consultar en este momento.');
    } finally {
      setLoading(false);
    }
  }

  function resetFlow() {
    setStep(STEPS.IDENTITY);
    setLookup(null);
    setError('');
    setIdentity({ nombre_completo: '', cedula: '' });
  }

  const assistantName = isPage ? (
    <strong className="font-semibold text-cyan-400">
      University of Technology and Education
    </strong>
  ) : (
    <strong className="font-semibold text-cyan-400">Relatic Panamá</strong>
  );

  const conversation = (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
      <MessageBubble>
        Hola. Soy el asistente de {assistantName}. Puedes buscar con tu{' '}
        <strong className="font-semibold text-slate-100">cédula</strong> o con tu nombre completo.
        Si hay documentos asociados, podrás descargarlos.
      </MessageBubble>

      {(step !== STEPS.IDENTITY || Boolean(identity.nombre_completo || identity.cedula)) &&
      (identity.nombre_completo || identity.cedula) ? (
        <MessageBubble role="user">
          {identity.cedula ? (
            <>
              <span className="block">Cédula: {identity.cedula}</span>
              {identity.nombre_completo ? (
                <span className="mt-1 block text-xs text-slate-300">{identity.nombre_completo}</span>
              ) : null}
            </>
          ) : (
            <>
              {identity.nombre_completo}
              <span className="mt-1 block text-xs text-slate-400">Sin cédula</span>
            </>
          )}
        </MessageBubble>
      ) : null}

      {step === STEPS.IDENTITY ? (
        <MessageBubble>
          <p className="font-medium text-slate-50">¿Cómo te identificamos?</p>
          <IdentityForm
            mode="lookup"
            initialName={identity.nombre_completo}
            initialCedula={identity.cedula}
            loading={loading}
            submitLabel="Buscar documentos"
            helperText="Si ya tienes cédula en el sistema, con ella basta. Si no, usa tu nombre completo tal como figura en la carta."
            onSubmit={handleLookup}
          />
        </MessageBubble>
      ) : null}

      {loading ? (
        <MessageBubble>
          <span className="inline-flex items-center gap-2 text-slate-300">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-cyan-400" />
            Consultando…
          </span>
        </MessageBubble>
      ) : null}

      {error ? (
        <MessageBubble>
          <p className="text-amber-200">{error}</p>
          <button
            type="button"
            onClick={() => setError('')}
            className="mt-2 text-xs font-medium text-cyan-400 underline-offset-2 hover:underline"
          >
            Cerrar mensaje
          </button>
        </MessageBubble>
      ) : null}

      {step === STEPS.RESULT && lookup?.found ? (
        <MessageBubble>
          <p>{lookup.message || 'Encontramos documentos asociados a tus datos.'}</p>
          {lookup.user?.nombre_completo ? (
            <p className="mt-2 text-sm text-slate-200">
              Titular:{' '}
              <strong className="font-semibold text-cyan-300">{lookup.user.nombre_completo}</strong>
              {lookup.user.cedula ? (
                <span className="mt-0.5 block text-xs text-slate-400">
                  Cédula: {lookup.user.cedula}
                </span>
              ) : null}
            </p>
          ) : null}
          {lookup.note ? <p className="mt-2 text-xs text-slate-400">{lookup.note}</p> : null}
          <DocumentsList documents={lookup.documents || []} />
          <button
            type="button"
            onClick={resetFlow}
            className="mt-4 text-xs font-medium text-slate-300 underline-offset-2 hover:text-cyan-400 hover:underline"
          >
            Hacer otra consulta
          </button>
        </MessageBubble>
      ) : null}

      {step === STEPS.RESULT && lookup && !lookup.found ? (
        <MessageBubble>
          <p>{lookup.message || NOT_FOUND_MESSAGE}</p>
          <a
            href="tel:+50767699968"
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-400"
          >
            Llamar +507 6769-9968
          </a>
          <button
            type="button"
            onClick={resetFlow}
            className="mt-3 block text-xs font-medium text-slate-300 underline-offset-2 hover:text-cyan-400 hover:underline"
          >
            Hacer otra consulta
          </button>
        </MessageBubble>
      ) : null}

      <div ref={bottomRef} />
    </div>
  );

  if (isPage) {
    return (
      <div className="flex w-full max-w-[420px] flex-col gap-3">
        <div className="h-[min(620px,70vh)] w-full min-h-[420px]">
          <ChatShell
            onCloseHref="/"
            closeLabel="Ir al inicio"
            title="University of Technology and Education"
            subtitle="Asistente de documentos"
            logoSrc="/logo-ute.png"
            logoAlt="University of Technology and Education (UTE)"
          >
            {conversation}
          </ChatShell>
        </div>
        <p className="text-center text-xs text-slate-500">
          También puedes usar el asistente desde la{' '}
          <Link to="/" className="text-cyan-400 underline-offset-2 hover:underline">
            página principal
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-3 md:bottom-8 md:right-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative h-[min(640px,78vh)] w-[min(100vw-2rem,380px)]"
          >
            <ChatShell onClose={() => setOpen(false)}>{conversation}</ChatShell>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? 'Cerrar asistente de documentos' : 'Abrir asistente de documentos'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cta text-slate-900 shadow-[0_0_24px_rgba(253,224,71,0.35)] transition hover:bg-yellow-400"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
