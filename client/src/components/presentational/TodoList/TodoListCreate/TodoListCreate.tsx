import { useState } from 'react';

// Models
import { Task } from '../../../../models/task.model';

// Components
import { TodoListItemEdit } from '../TodoListItem/TodoListItemEdit/TodoListItemEdit';

type DispatchProps = {
  onAddTask: (task: Task) => void;
}

type Props = DispatchProps;

const TodoListCreate = ({ onAddTask }: Props) => {
  const [key, setKey] = useState<number>(0);

  // Reset the task edit form changing the key
  const resetTaskHandler = () => {
    setKey((key) => key === 0 ? 1 : 0);
  };

  const addTaskHandler = (task: Task) => {
    onAddTask(task);
    resetTaskHandler();
  };

  return (
    <TodoListItemEdit key={key} onCancelEdit={resetTaskHandler} onSave={addTaskHandler} />
  );
};

export default TodoListCreate;