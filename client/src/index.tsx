import React from 'react';
import { createRoot } from 'react-dom/client';

import { worker } from './mocks/browser';

// Style
import './index.scss';

// Services
import { windowReferenceService } from './services/system/windowsReference.service';

const FAKE_API = import.meta.env.VITE_APP_FAKE_API;

// Components
import App from './App';
import ThemeProvider from './components/hoc/ThemeProvider/ThemeProvider';

if (import.meta.env.DEV) {
  if (!windowReferenceService().Cypress) {
    // runs the in-memory testing API
    if (import.meta.env.DEV && FAKE_API === 'true') {
      worker.start();
    }
  }
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
