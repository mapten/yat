import React from 'react';
import { createRoot } from 'react-dom/client';

// Style
import './index.scss';

const FAKE_API = import.meta.env.VITE_APP_FAKE_API;

// Components
import App from './App';
import ThemeProvider from './components/hoc/ThemeProvider/ThemeProvider';

const prepare = async (): Promise<void> => {
  if (import.meta.env.DEV && FAKE_API === 'true') {
    const { worker } = await import('./mocks/browser');
    worker.start();
  }
};

prepare().then(() => createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
));
