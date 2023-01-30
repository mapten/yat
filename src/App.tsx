import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import styles from './App.module.scss';

// Constants
import { TOAST_DISPLAY_TIME } from './constants/configuration';

// Components
import TodoList from './components/containers/TodoList/TodoList';
import Create from './components/containers/Create/Create';

export const App: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <ToastContainer hideProgressBar={true} limit={1} position={'top-center'} autoClose={TOAST_DISPLAY_TIME} />
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
