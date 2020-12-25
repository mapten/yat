import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ConnectedTodoList } from './components/containers/TodoList/TodoList';
import { ConnectedCreate } from './components/containers/Create/Create';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <ConnectedTodoList />
        </Route>
        <Route path="/create">
          <ConnectedCreate />
        </Route>
        <Route path="/todolist">
          <ConnectedTodoList />
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
