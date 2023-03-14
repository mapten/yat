import { useEffect, useState } from 'react';

// Constants
import { PRIORITY_LEVELS } from '../../../constants/priorityLevels.constants';

// Store
import { useTaskStore } from '../../../store/task.store';

// Components
import TodoListCreate from '../../presentational/TodoList/TodoListCreate/TodoListCreate';
import TodoListCategory from '../../hoc/TodoListCategory/TodoListCategory';
import { TodoListItemEdit } from '../../presentational/TodoList/TodoListItem/TodoListItemEdit/TodoListItemEdit';
import { TodoListItemDisplay } from '../../presentational/TodoList/TodoListItem/TodoListItemDisplay/TodoListItemDisplay';

const TodoList: React.FC = () => {
  const [editTaskId, setEditTaskId] = useState<string | undefined>(undefined);

  const { tasks, fetchTasks, addTask, changeTaskStatus, updateTask, deleteTask } = useTaskStore((state) => state);

  useEffect(() => {
    fetchTasks();
  }, []);

  const getTasks = (done: boolean) => {
    return tasks
      .filter((task) => task.done === done)
      .sort((taskA, taskB) =>
        (taskA.priority - taskB.priority)
      );
  };

  const renderTaskList = (done: boolean) => {
    return getTasks(done)
      .map((task) => {
        const priorityColor =
          PRIORITY_LEVELS.find((priorityLevel) => priorityLevel.order === task.priority)?.displayColor as string;

        return <div key={task.id}>
          {task.id === editTaskId
            ? <TodoListItemEdit
              taskId={task.id}
              initialTaskName={task.displayName}
              taskDone={task.done}
              initialTaskPriority={task.priority}
              onCancelEdit={() => setEditTaskId(undefined)}
              onSave={updateTask} />
            : <TodoListItemDisplay
              taskId={task.id}
              taskName={task.displayName}
              taskDone={task.done}
              taskPriorityColor={done ? undefined : priorityColor}
              onTaskChangeStatus={changeTaskStatus}
              onSetEdit={setEditTaskId}
              onDelete={deleteTask} />
          }
        </div>;
      });
  };

  return (
    <>
      <TodoListCategory displayCount={false} category='create task'>
        <TodoListCreate onAddTask={addTask} />
      </TodoListCategory>
      <TodoListCategory category='pending' itemCount={getTasks(false).length} displayCount={true} initialShowList={true}>
        {renderTaskList(false)}
      </TodoListCategory>
      <TodoListCategory category='completed' itemCount={getTasks(true).length} displayCount={true} initialShowList={false}>
        {renderTaskList(true)}
      </TodoListCategory>
    </>
  );
};

export default TodoList;