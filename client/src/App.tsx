import React, { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';

// Styles
import './App.scss';

// Hooks
import { useStore } from './hooks/useStore';

// Store
import { useAuthStore } from './store/auth.store';

// Components
import { useTheme } from './components/hoc/ThemeProvider/ThemeProvider';
import Header from './components/presentational/Header/Header';
import LoadingScreen from './components/presentational/UI/LoadingScreen/LoadingScreen';

const TodoList = lazy(async () => {
  const [moduleExports] = await Promise.all([
    import('./components/containers/TodoList/TodoList'),
    new Promise(resolve => setTimeout(resolve, 500))
  ]);
  return moduleExports;
});

const Auth = lazy(async () => {
  const [moduleExports] = await Promise.all([
    import('./components/containers/Auth/Auth'),
    new Promise(resolve => setTimeout(resolve, 500))
  ]);
  return moduleExports;
});


const App: React.FC = () => {
  const { theme } = useTheme();
  const { isTaskStoreHydrated } = useStore();

  const { loginVisibleMode } = useAuthStore((state) => state);

  const renderTodoList = () => {
    if (isTaskStoreHydrated) {
      return <Suspense fallback={<LoadingScreen />}>
        <TodoList />
      </Suspense>;
    }
    return <LoadingScreen />;
  };

  return (
    <>
      <Toaster toastOptions={{ className: 'toaster' }} />
      <div className={`${theme}-theme app`}>
        <header>
          <Header />
        </header>
        <main>
          {loginVisibleMode ? <Auth initialMode={loginVisibleMode} /> : renderTodoList()}
        </main>
        <footer>
        </footer>
      </div>
    </>
  );
};

export default App;
