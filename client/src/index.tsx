import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

// Style
import './index.scss';

// Store
import { rootReducer } from './store/reducers';
import { applyMiddleware, compose, createStore } from 'redux';
import { watchTask } from './store/middleware';

// Services
import { windowReferenceService } from './services/system/windowsReference.service';
import * as mirageServerService from './services/mirageServer.service';

const FAKE_API = import.meta.env.VITE_APP_FAKE_API;

// Components
import App from './App';
import ThemeProvider from './components/hoc/ThemeProvider/ThemeProvider';

let composeEnhancers = null;

if (process.env.NODE_ENV === 'development') {
  // enables Redux Devtools in the browser
  composeEnhancers = windowReferenceService().__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  if (!windowReferenceService().Cypress) {
    // runs the in-memory testing API
    if (FAKE_API === true) {
      mirageServerService.makeServer();
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
