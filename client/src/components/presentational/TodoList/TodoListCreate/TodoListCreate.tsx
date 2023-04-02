import { useRef } from 'react';

// Models
import { Task } from '../../../../models/task.model';

// Types
import { STORE_RESULT } from '../../../../typings/common.types';

// Components
import TodoListItemEdit, { RefType } from '../TodoListItem/TodoListItemEdit/TodoListItemEdit';

type DispatchProps = {
  onAddTask: (task: Partial<Task>) => Promise<STORE_RESULT>;
}

type Props = DispatchProps;

const TodoListCreate = ({ onAddTask }: Props) => {
  const todoListEditRef = useRef<RefType>(null);

  const resetTaskHandler = () => {
    if (todoListEditRef.current) {
      todoListEditRef.current.reset();
    }
  };

  const addTaskHandler = async (task: Partial<Task>) => {
    const result = await onAddTask(task);

    if (result === 'success'){
      resetTaskHandler();
    }
  };

  return (
    <TodoListItemEdit ref={todoListEditRef} onCancelEdit={resetTaskHandler} onSave={addTaskHandler} />
  );
};

export default TodoListCreate;