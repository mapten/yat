import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// Styles
import './App.scss';

// Components
import TodoList from './components/containers/TodoList/TodoList';
import { useTheme } from './components/hoc/ThemeProvider/ThemeProvider';
import Header from './components/presentational/Header/Header';
import Footer from './components/presentational/Footer/Footer';

const App: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`${theme}-theme app`}>
      <header>
        <Header />
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TodoList />} />
            <Route path="todolist" element={<TodoList />} />
          </Routes>
        </BrowserRouter>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default App;
