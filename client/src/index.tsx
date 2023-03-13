import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';

import { worker } from './mocks/browser';

// Style
import './index.scss';

// Store
import { rootReducer } from './store/reducers';
import { watchTask } from './store/middleware';

// Services
import { windowReferenceService } from './services/system/windowsReference.service';


const FAKE_API = import.meta.env.VITE_APP_FAKE_API;

// Components
import App from './App';
import ThemeProvider from './components/hoc/ThemeProvider/ThemeProvider';

let composeEnhancers = null;

if (import.meta.env.DEV) {
  // enables Redux Devtools in the browser
  composeEnhancers = windowReferenceService().__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  if (!windowReferenceService().Cypress) {
    // runs the in-memory testing API
    if (import.meta.env.DEV && FAKE_API === 'true') {
      worker.start();
    }
  }
} else {
  composeEnhancers = compose;
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(watchTask);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
