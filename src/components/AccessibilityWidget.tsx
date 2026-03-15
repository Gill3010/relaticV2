import { useEffect, useRef } from 'react';

/**
 * ID de cuenta de UserWay. Reemplaza con tu ID real o define
 * VITE_USERWAY_ACCOUNT_ID en tu .env para no hardcodearlo.
 */
const USERWAY_ACCOUNT_ID =
  import.meta.env.VITE_USERWAY_ACCOUNT_ID ?? 'TU_ID_DE_USERWAY';

const USERWAY_SCRIPT_URL = 'https://cdn.userway.org/widget.js';

/**
 * Widget de accesibilidad UserWay. Carga el script dinámicamente una sola vez,
 * evita duplicados si el componente se renderiza varias veces y no afecta
 * el layout ni los estilos existentes (Tailwind).
 */
export function AccessibilityWidget() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;

    const existing = document.querySelector(
      `script[src*="${USERWAY_SCRIPT_URL}"]`
    );
    if (existing) {
      loaded.current = true;
      return;
    }

    loaded.current = true;
    const script = document.createElement('script');
    script.setAttribute('data-account', USERWAY_ACCOUNT_ID);
    script.setAttribute('data-position', '5'); // 5 = abajo a la izquierda
    script.setAttribute('src', USERWAY_SCRIPT_URL);
    script.setAttribute('async', 'true');
    (document.body ?? document.head).appendChild(script);
  }, []);

  return null;
}
