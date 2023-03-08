import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// Store
import * as actions from '../../../store/actions';
import { RootState } from '../../../store/models/rootState.model';
import { getTaskList, TaskActionPartial } from '../../../store/reducers/task.reducer';

// Models
import { Task } from '../../../models/task.model';

// Constants
import { PRIORITY_LEVELS } from '../../../constants/priorityLevels.constants';

// Components
import TodoListCreate from '../../presentational/TodoList/TodoListCreate/TodoListCreate';
import TodoListCategory from '../../hoc/TodoListCategory/TodoListCategory';
import { TodoListItemEdit } from '../../presentational/TodoList/TodoListItem/TodoListItemEdit/TodoListItemEdit';
import { TodoListItemDisplay } from '../../presentational/TodoList/TodoListItem/TodoListItemDisplay/TodoListItemDisplay';

type StateProps = {
  initialTaskList: Task[];
}

type DispatchProps = {
  onFetchTasks: () => void;
  onChangeTaskStatus: (taskId: string, done: boolean) => void;
  onAddTask: (newTask: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

type Props = DispatchProps & StateProps;

export const TodoList: React.FC<Props> = ({ initialTaskList, onFetchTasks, onChangeTaskStatus, onUpdateTask, onAddTask, onDeleteTask }: Props) => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [editTaskId, setEditTaskId] = useState<string | undefined>(undefined);

  useEffect(() => {
    onFetchTasks();
  }, []);

  useEffect(() => {
    setTaskList(initialTaskList);
  }, [initialTaskList]);

  const getTasks = useCallback((done: boolean) => {
    return taskList
      .filter((task) => task.done === done)
      .sort((taskA, taskB) =>
        (taskA.priority - taskB.priority)
      );
  }, [taskList]);

  const taskChangeStatusHandler = (taskId: string, done: boolean) => {
    setTaskList((tasks) => [...tasks].map((task) => {
      if (task.id === taskId) {
        return { ...task, done };
      }
      return task;
    }));

    onChangeTaskStatus(taskId, done);
  };

  const deleteTaskHandler = (taskId: string) => {
    setTaskList((tasks) => [...tasks].filter((task) => task.id !== taskId));
    onDeleteTask(taskId);
  };

  const updateTaskHandler = (task: Task) => {
    setTaskList((tasks) => {
      return [...tasks].map((taskItem) => {
        if (taskItem.id === task.id) {
          return task;
        }
        return taskItem;
      });
    });

    setEditTaskId(undefined);
    onUpdateTask(task);
  };

  const addTaskHandler = (newTask: Task) => {
    setTaskList([...taskList, newTask]);
    onAddTask(newTask);
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
              onSave={updateTaskHandler} />
            : <TodoListItemDisplay
              taskId={task.id}
              taskName={task.displayName}
              taskDone={task.done}
              taskPriorityColor={done ? undefined : priorityColor}
              onTaskChangeStatus={taskChangeStatusHandler}
              onSetEdit={setEditTaskId}
              onDelete={deleteTaskHandler} />
          }
        </div>;
      });
  };

  return (
    <>
      <TodoListCategory displayCount={false} category='create task'>
        <TodoListCreate onAddTask={addTaskHandler} />
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

const mapStateToProps = (state: RootState): StateProps => {
  return {
    initialTaskList: getTaskList(state.task)
  };
};

const mapDispatchToProps = (dispatch: Dispatch<TaskActionPartial>): DispatchProps => {
  return {
    onFetchTasks: () => dispatch(actions.task.fetchTask()),
    onChangeTaskStatus: (taskId: string, done: boolean) => dispatch(actions.task.taskChangeStatus(taskId, done)),
    onAddTask: (newTask) => dispatch(actions.task.addTask(newTask)),
    onUpdateTask: (task: Task) => dispatch(actions.task.updateTask(task)),
    onDeleteTask: (taskId: string) => dispatch(actions.task.deleteTask(taskId)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(TodoList);