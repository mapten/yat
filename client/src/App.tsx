import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// Styles
import styles from './App.module.scss';

// Components
import TodoList from './components/containers/TodoList/TodoList';
import Create from './components/containers/Create/Create';

export const App: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="create" element={<Create />} />
          <Route path="todolist" element={<TodoList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
