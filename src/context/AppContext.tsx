import React, { useState, useEffect } from 'react';
import { AppContext } from './AppContext';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  const apiBaseUrl =
    import.meta.env.PROD && (envUrl?.includes('127.0.0.1') || envUrl?.includes('localhost'))
      ? 'https://relaticpanama.org/api/chat'
      : (envUrl || 'https://relaticpanama.org/api/chat');
  const isChatbotEnabled = true;


  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    // Default to dark theme as configured in root
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        apiBaseUrl,
        isChatbotEnabled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
