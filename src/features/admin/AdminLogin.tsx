import { useState, type FormEvent } from 'react';

type AdminLoginProps = {
  onSuccess: (username: string) => void;
};

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { adminLogin } = await import('./adminApi');
      const data = await adminLogin(username.trim(), password);
      onSuccess(data.user?.username || username.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <label className="block" htmlFor="admin-username">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Usuario</span>
        <input
          id="admin-username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
        />
      </label>
      <label className="block" htmlFor="admin-password">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Clave</span>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
