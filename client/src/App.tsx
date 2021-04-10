import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Components
import TodoList from './components/containers/TodoList/TodoList';
import Create from './components/containers/Create/Create';

export const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <TodoList />
        </Route>
        <Route path="/create">
          <Create />
        </Route>
        <Route path="/todolist">
          <TodoList />
        </Route>
      </Switch>
    </Router>
  );
};
