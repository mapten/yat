import { useEffect, useState } from 'react';

// Styles
import styles from './TodoList.module.scss';

// Constants
import { PRIORITY_LEVELS } from '../../../constants/priorityLevels.constants';

// Models
import { Task } from '../../../models/task.model';

// Store
import { useTaskStore } from '../../../store/task.store';

// Components
import TodoListCreate from '../../presentational/TodoList/TodoListCreate/TodoListCreate';
import TodoListCategory from '../../hoc/TodoListCategory/TodoListCategory';
import TodoListItemEdit from '../../presentational/TodoList/TodoListItem/TodoListItemEdit/TodoListItemEdit';
import { TodoListItemDisplay } from '../../presentational/TodoList/TodoListItem/TodoListItemDisplay/TodoListItemDisplay';
import ProgressBar from '../../presentational/ProgressBar/ProgressBar';

const TodoList: React.FC = () => {
  const [editTaskId, setEditTaskId] = useState<string | undefined>(undefined);

  const { getCompletedTasks, getPendingTasks, fetchTasks, addTask, changeTaskStatus, updateTask, deleteTask } = useTaskStore((state) => state);

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTaskHandler = async (task: Partial<Task>) => {
    const result = await updateTask(task);

    if (result === 'success') {
      setEditTaskId(undefined);
    }
  }

  const addTaskHandler = async (task: Partial<Task>) => {
    return await addTask(task);
  }

  const renderTaskList = (done: boolean) => {
    const tasks = done ? getCompletedTasks() : getPendingTasks();

    return tasks
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
              onSave={async (task: Partial<Task>) => updateTaskHandler(task)} />
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
      <div className={styles.todoList}>
        <TodoListCategory displayCount={false} category='create task'>
          <TodoListCreate onAddTask={addTaskHandler} />
        </TodoListCategory>
        <TodoListCategory category='pending' itemCount={getPendingTasks().length} displayCount={true} initialShowList={true}>
          {renderTaskList(false)}
        </TodoListCategory>
        <TodoListCategory category='completed' itemCount={getCompletedTasks().length} displayCount={true} initialShowList={false}>
          {renderTaskList(true)}
        </TodoListCategory>
      </div>
      <div className={styles.progressBarWrapper}>
        <ProgressBar />
      </div>
    </>
  );
};

export default TodoList;