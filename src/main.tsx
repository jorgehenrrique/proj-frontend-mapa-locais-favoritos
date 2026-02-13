import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { Providers } from './app/providers';
import { useThemeStore } from './stores/themeStore';

// Inicializar o tema antes do render para evitar flash
const theme = useThemeStore.getState().theme;
if (theme === 'light') document.documentElement.classList.add('light');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
