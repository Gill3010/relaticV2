import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { AdminLogin } from '../features/admin/AdminLogin';
import { AdminHeader } from '../features/admin/AdminHeader';
import { CartaDrawer } from '../features/admin/CartaDrawer';
import { CartaForm } from '../features/admin/CartaForm';
import { CartasList } from '../features/admin/CartasList';
import { ActividadList } from '../features/admin/ActividadList';
import { PasswordForm } from '../features/admin/PasswordForm';
import { useIdleGuard } from '../features/admin/useIdleGuard';
import { Alert, ctaButtonClass, ghostButtonClass, Spinner, Wordmark } from '../features/admin/AdminUI';
import { adminLogout, adminSession, deleteCarta, restoreCarta } from '../features/admin/adminApi';
import {
  CARTA_GONE_MESSAGE,
  INACTIVITY_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
  adminErrorMessage,
  isCartaGoneError,
  isSessionError,
} from '../features/admin/adminErrors';
import type { AdminCarta } from '../features/admin/types';

type AdminView = 'cartas' | 'papelera' | 'actividad';

export function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [view, setView] = useState<AdminView>('cartas');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCarta | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminCarta | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [notice, setNotice] = useState('');
  const [loginNotice, setLoginNotice] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminSession()
      .then((data) => {
        if (!cancelled && data.authenticated && data.user?.username) {
          setUsername(data.user.username);
        }
      })
      .catch(() => {
        if (!cancelled) setUsername(null);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 8000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const expireSession = useCallback((message = SESSION_EXPIRED_MESSAGE) => {
    setUsername(null);
    setDrawerOpen(false);
    setPasswordOpen(false);
    setEditing(null);
    setPendingDelete(null);
    setView('cartas');
    setLoginNotice(message);
  }, []);

  const { warning: idleWarning, stay: stayLoggedIn } = useIdleGuard({
    enabled: Boolean(username),
    onIdle: () => {
      void adminLogout();
      expireSession(INACTIVITY_MESSAGE);
    },
  });

  async function handleLogout() {
    await adminLogout();
    setUsername(null);
    setDrawerOpen(false);
    setPasswordOpen(false);
    setEditing(null);
    setPendingDelete(null);
    setView('cartas');
  }

  function openCreate() {
    setEditing(null);
    setDrawerOpen(true);
  }

  function openEdit(carta: AdminCarta) {
    setEditing(carta);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditing(null);
  }

  function handleCartaGone() {
    setPendingDelete(null);
    closeDrawer();
    setRefreshKey((n) => n + 1);
    setNotice(CARTA_GONE_MESSAGE);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError('');
    try {
      const data = await deleteCarta(pendingDelete.source, pendingDelete.document_id);
      setPendingDelete(null);
      setRefreshKey((n) => n + 1);
      setNotice(data.message || 'Fue a la papelera. El chatbot ya no la muestra.');
    } catch (err) {
      if (isSessionError(err)) {
        expireSession();
        return;
      }
      if (isCartaGoneError(err)) {
        handleCartaGone();
        return;
      }
      setDeleteError(adminErrorMessage(err, 'No se pudo eliminar.'));
    } finally {
      setDeleting(false);
    }
  }

  async function handleRestore(carta: AdminCarta) {
    try {
      const data = await restoreCarta(carta.source, carta.document_id);
      setRefreshKey((n) => n + 1);
      setNotice(data.message || 'Carta restaurada.');
    } catch (err) {
      if (isSessionError(err)) {
        expireSession();
        return;
      }
      setNotice(adminErrorMessage(err, 'No se pudo restaurar.'));
    }
  }

  const titles: Record<AdminView, { title: string; subtitle: string }> = {
    cartas: {
      title: 'Cartas registradas',
      subtitle: 'Consulta, corrige o envía a la papelera. El chatbot no muestra lo que está ahí.',
    },
    papelera: {
      title: 'Papelera',
      subtitle: 'Las cartas duran 30 días. Restáuralas con el icono verde. El chatbot no las muestra.',
    },
    actividad: {
      title: 'Actividad',
      subtitle: 'Quién creó, editó, envió a papelera o restauró, y cuándo.',
    },
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-slate-950 font-sans text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_50%_-10%,rgba(253,224,71,0.08),transparent_60%),radial-gradient(45rem_30rem_at_100%_100%,rgba(34,211,238,0.07),transparent_60%)]"
      />

      <div className="relative">
        {checking ? (
          <div className="flex min-h-dvh items-center justify-center">
            <span className="inline-flex items-center gap-3 text-sm text-slate-400">
              <Spinner className="text-cta" />
              Cargando…
            </span>
          </div>
        ) : !username ? (
          <div className="flex min-h-dvh items-center justify-center px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md"
            >
              <div className="mb-8 flex flex-col items-center gap-4 text-center">
                <Wordmark />
                <p className="text-sm text-slate-400">
                  Acceso restringido al equipo de Relatic Panamá.
                </p>
              </div>
              <AdminLogin
                onSuccess={(name) => {
                  setLoginNotice('');
                  setUsername(name);
                }}
                notice={loginNotice}
              />

              <a
                href="/"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-cta"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a la página principal
              </a>
            </motion.div>
          </div>
        ) : (
          <>
            <AdminHeader
              username={username}
              view={view}
              onView={(next) => {
                setPasswordOpen(false);
                setView(next);
              }}
              onPassword={() => setPasswordOpen(true)}
              onLogout={handleLogout}
            />

            <main className="mx-auto max-w-7xl px-4 pb-16 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                      {titles[view].title}
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">{titles[view].subtitle}</p>
                  </div>
                  {view === 'cartas' ? (
                    <button type="button" onClick={openCreate} className={ctaButtonClass}>
                      <Plus className="h-4 w-4" />
                      Nueva carta
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordOpen(false);
                        setView('cartas');
                      }}
                      className={ghostButtonClass}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Volver a las cartas
                    </button>
                  )}
                </div>

                {notice ? <Alert tone="info">{notice}</Alert> : null}

                {view === 'actividad' ? (
                  <ActividadList refreshKey={refreshKey} onSessionExpired={() => expireSession()} />
                ) : (
                  <CartasList
                    key={view}
                    refreshKey={refreshKey}
                    papelera={view === 'papelera'}
                    onEdit={openEdit}
                    onSessionExpired={() => expireSession()}
                    onRestore={handleRestore}
                    onDelete={(carta) => {
                      setDeleteError('');
                      setPendingDelete(carta);
                    }}
                  />
                )}
              </motion.div>
            </main>

            <CartaDrawer
              open={drawerOpen}
              title={editing ? 'Editar carta' : 'Nueva carta'}
              subtitle={
                editing
                  ? 'Corrige los datos. El PDF actual se mantiene si no subes otro.'
                  : 'Registra una carta y adjunta su PDF.'
              }
              onClose={closeDrawer}
            >
              <CartaForm
                key={editing ? `${editing.source}-${editing.document_id}` : 'nueva'}
                carta={editing}
                onSaved={() => {
                  setRefreshKey((n) => n + 1);
                  if (editing) closeDrawer();
                }}
                onCartaGone={handleCartaGone}
                onSessionExpired={() => expireSession()}
              />
            </CartaDrawer>

            <CartaDrawer
              open={passwordOpen}
              title="Cambiar clave"
              subtitle="Usa una clave de al menos 10 caracteres. Nadie más podrá verla."
              onClose={() => setPasswordOpen(false)}
            >
              <PasswordForm
                onDone={() => {
                  setPasswordOpen(false);
                  setView('cartas');
                }}
                onSessionExpired={() => expireSession()}
              />
            </CartaDrawer>

            {idleWarning ? (
              <div className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
                  <h2 className="text-lg font-bold text-white">¿Sigues ahí?</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Por seguridad, la sesión se cierra en 2 minutos si no hay actividad.
                  </p>
                  <div className="mt-6 flex justify-end">
                    <button type="button" className={ctaButtonClass} onClick={stayLoggedIn}>
                      Seguir aquí
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {pendingDelete ? (
              <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
                  <h2 className="text-lg font-bold text-white">Enviar a la papelera</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Se quitará a{' '}
                    <span className="font-semibold text-white">{pendingDelete.nombre_completo}</span>{' '}
                    del chatbot. Quedará 30 días en Papelera por si fue un error.
                  </p>
                  {deleteError ? <p className="mt-3 text-sm text-red-300">{deleteError}</p> : null}
                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      className={ghostButtonClass}
                      onClick={() => setPendingDelete(null)}
                      disabled={deleting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-400 disabled:opacity-60"
                      onClick={confirmDelete}
                      disabled={deleting}
                    >
                      {deleting ? 'Enviando…' : 'Sí, a la papelera'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
