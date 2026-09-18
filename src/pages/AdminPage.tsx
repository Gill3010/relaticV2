import { useEffect, useState } from 'react';
import { AdminLogin } from '../features/admin/AdminLogin';
import { CartaForm } from '../features/admin/CartaForm';
import { CartasList } from '../features/admin/CartasList';
import { adminLogout, adminSession } from '../features/admin/adminApi';

export function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

  async function handleLogout() {
    await adminLogout();
    setUsername(null);
  }

  return (
    <div className="min-h-dvh bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold tracking-wide text-slate-800">Panel de cartas</p>
          {username ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">{username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-slate-700 underline"
              >
                Salir
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {checking ? (
          <p className="text-sm text-slate-500">Cargando…</p>
        ) : !username ? (
          <div className="mx-auto max-w-sm rounded-xl border border-slate-200 bg-white p-6">
            <h1 className="mb-4 text-lg font-semibold">Acceso</h1>
            <AdminLogin onSuccess={setUsername} />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h1 className="mb-4 text-lg font-semibold">Nueva carta</h1>
              <CartaForm onCreated={() => setRefreshKey((n) => n + 1)} />
            </section>
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Registros</h2>
              <CartasList refreshKey={refreshKey} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
