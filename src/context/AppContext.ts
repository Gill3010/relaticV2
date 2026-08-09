import { createContext } from 'react';

export interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  apiBaseUrl: string;
  isChatbotEnabled: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
