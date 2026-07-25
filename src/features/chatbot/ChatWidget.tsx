import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { lookupIdentity, registerIdentity } from './api/chatApi';
import { ChatShell } from './components/ChatShell';
import { DocumentsList } from './components/DocumentsList';
import { IdentityForm } from './components/IdentityForm';
import { MessageBubble } from './components/MessageBubble';
import type { ChatStep, IdentityPayload, LookupResponse } from './types';

const STEPS = {
  IDENTITY: 'identity',
  RESULT: 'result',
  REGISTER: 'register',
  REGISTERED: 'registered',
} as const satisfies Record<string, ChatStep>;

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>(STEPS.IDENTITY);
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState<IdentityPayload>({
    nombre_completo: '',
    cedula: '',
  });
  const [lookup, setLookup] = useState<LookupResponse | null>(null);
  const [error, setError] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [open, step, loading, lookup, error, registerMessage]);

  async function handleLookup(data: IdentityPayload) {
    setLoading(true);
    setError('');
    setIdentity(data);
    try {
      const result = await lookupIdentity(data);
      setLookup(result);
      setStep(STEPS.RESULT);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos consultar en este momento.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(data: IdentityPayload) {
    setLoading(true);
    setError('');
    setIdentity(data);
    try {
      const result = await registerIdentity(data);
      setRegisterMessage(result.message || 'Registro creado correctamente.');
      setStep(STEPS.REGISTERED);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos completar el registro.');
    } finally {
      setLoading(false);
    }
  }

  function resetFlow() {
    setStep(STEPS.IDENTITY);
    setLookup(null);
    setError('');
    setRegisterMessage('');
    setIdentity({ nombre_completo: '', cedula: '' });
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
            <ChatShell onClose={() => setOpen(false)}>
              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
                <MessageBubble>
                  Hola. Soy el asistente de{' '}
                  <strong className="font-semibold text-cyan-400">Relatic Panamá</strong>. Indica tu
                  nombre completo y, si quieres, tu cédula. Si hay documentos asociados, podrás
                  descargarlos.
                </MessageBubble>

                {(step !== STEPS.IDENTITY || identity.nombre_completo) &&
                identity.nombre_completo ? (
                  <MessageBubble role="user">
                    {identity.nombre_completo}
                    {identity.cedula ? (
                      <span className="mt-1 block text-xs text-slate-300">
                        Cédula: {identity.cedula}
                      </span>
                    ) : (
                      <span className="mt-1 block text-xs text-slate-400">Sin cédula</span>
                    )}
                  </MessageBubble>
                ) : null}

                {step === STEPS.IDENTITY ? (
                  <MessageBubble>
                    <p className="font-medium text-slate-50">¿Cómo te llamas?</p>
                    <IdentityForm
                      initialName={identity.nombre_completo}
                      initialCedula={identity.cedula}
                      loading={loading}
                      submitLabel="Buscar documentos"
                      helperText="Esto no es un registro obligatorio. La cédula es opcional y ayuda a encontrar tu información con más precisión."
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
                    {lookup.note ? (
                      <p className="mt-2 text-xs text-slate-400">{lookup.note}</p>
                    ) : null}
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
                    <p>{lookup.message || 'No encontramos documentos asociados.'}</p>
                    {lookup.note ? (
                      <p className="mt-2 text-xs text-slate-400">{lookup.note}</p>
                    ) : null}
                    {lookup.offer_register ? (
                      <>
                        <p className="mt-3 text-sm text-slate-200">
                          Si quieres, puedes registrarte con tu nombre. La cédula sigue siendo
                          opcional.
                        </p>
                        <div className="mt-3 flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => setStep(STEPS.REGISTER)}
                            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300"
                          >
                            Registrarme
                          </button>
                          <button
                            type="button"
                            onClick={resetFlow}
                            className="inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-400"
                          >
                            No, gracias
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={resetFlow}
                        className="mt-4 text-xs font-medium text-slate-300 underline-offset-2 hover:text-cyan-400 hover:underline"
                      >
                        Hacer otra consulta
                      </button>
                    )}
                  </MessageBubble>
                ) : null}

                {step === STEPS.REGISTER ? (
                  <MessageBubble>
                    <p className="font-medium">Registro opcional</p>
                    <IdentityForm
                      initialName={identity.nombre_completo}
                      initialCedula={identity.cedula}
                      loading={loading}
                      submitLabel="Crear registro"
                      helperText="Por ahora solo pedimos nombre completo y cédula opcional. Más adelante podremos solicitar más datos."
                      onSubmit={handleRegister}
                    />
                    <button
                      type="button"
                      onClick={() => setStep(STEPS.RESULT)}
                      className="mt-3 text-xs font-medium text-slate-400 underline-offset-2 hover:text-cyan-400 hover:underline"
                    >
                      Volver
                    </button>
                  </MessageBubble>
                ) : null}

                {step === STEPS.REGISTERED ? (
                  <MessageBubble>
                    <p className="text-cyan-400">{registerMessage}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Gracias, {identity.nombre_completo}. Tu registro quedó guardado.
                    </p>
                    <button
                      type="button"
                      onClick={resetFlow}
                      className="mt-4 inline-flex items-center justify-center rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-400"
                    >
                      Nueva consulta
                    </button>
                  </MessageBubble>
                ) : null}

                <div ref={bottomRef} />
              </div>
            </ChatShell>
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
