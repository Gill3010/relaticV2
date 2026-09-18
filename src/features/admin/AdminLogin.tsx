import { useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Alert, ctaButtonClass, Field, inputClass, Spinner } from './AdminUI';
import { adminErrorMessage } from './adminErrors';

type AdminLoginProps = {
  onSuccess: (username: string) => void;
  notice?: string;
};

export function AdminLogin({ onSuccess, notice }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { adminLogin } = await import('./adminApi');
      const data = await adminLogin(username.trim(), password);
      onSuccess(data.user?.username || username.trim());
    } catch (err) {
      setError(adminErrorMessage(err, 'No se pudo iniciar sesión.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Usuario" htmlFor="admin-username">
        <input
          id="admin-username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Clave" htmlFor="admin-password">
        <div className="relative">
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
            aria-pressed={showPassword}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors hover:text-cta focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>
      {notice && !error ? <Alert tone="info">{notice}</Alert> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      <button type="submit" disabled={loading} className={`${ctaButtonClass} w-full`}>
        {loading ? (
          <>
            <Spinner />
            Entrando…
          </>
        ) : (
          'Entrar'
        )}
      </button>
    </form>
  );
}
