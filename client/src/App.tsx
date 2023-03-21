import React, { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

// Styles
import './App.scss';

// Hooks
import { useStore } from './hooks/useStore';

// Components
import { useTheme } from './components/hoc/ThemeProvider/ThemeProvider';
import Header from './components/presentational/Header/Header';
import Auth from './components/containers/Auth/Auth';
import LoadingScreen from './components/presentational/UI/LoadingScreen/LoadingScreen';


const TodoList = lazy(async () => {
  const [moduleExports] = await Promise.all([
    import('./components/containers/TodoList/TodoList'),
    new Promise(resolve => setTimeout(resolve, 500))
  ]);
  return moduleExports;
});


const App: React.FC = () => {
  const { theme } = useTheme();

  const { storeHasLoaded, isLoginVisible } = useStore();

  const renderTodoList = () => {
    if (storeHasLoaded) {
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
          {isLoginVisible ? <Auth /> : renderTodoList()}
        </main>
        <footer>
        </footer>
      </div>
    </>
  );
};

export default App;
