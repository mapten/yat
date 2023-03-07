import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// Styles
import styles from './App.module.scss';

// Components
import TodoList from './components/containers/TodoList/TodoList';

export const App: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="todolist" element={<TodoList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
