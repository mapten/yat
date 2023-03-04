import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// Style
import styles from './TodoList.module.scss';

// Store
import * as actions from '../../../store/actions';
import { RootState } from '../../../store/models/rootState.model';
import { getEditingTaskId as getEditTaskId, getTaskList, TaskActionPartial } from '../../../store/reducers/task.reducer';

// Constants
import { PRIORITY_LEVELS } from '../../../constants/priorityLevels.constants';

// Models
import { Task } from '../../../models/task.model';

// Components
import { TodoListHeader } from '../../presentational/TodoList/TodoListHeader/TodoListHeader';
import { NoTasksMessage } from '../../presentational/UI/NoTasksMessage/NoTasksMessage';
import { TodoListItemEdit } from '../../presentational/TodoList/TodoListItem/TodoListItemEdit/TodoListItemEdit';
import { TodoListItemDisplay } from '../../presentational/TodoList/TodoListItem/TodoListItemDisplay/TodoListItemDisplay';


type StateProps = {
  initialTaskList: Task[];
  editTaskId?: string;
}

type DispatchProps = {
  onFetchTasks: () => void;
  onTaskChangeStatus: (taskId: string, done: boolean) => void;
  onSetTaskEditId: (taskId?: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

type Props = DispatchProps & StateProps;

export const TodoList: React.FC<Props> = (props: Props) => {
  const [taskList, setTaskList] = useState<Task[]>([]);

  useEffect(() => {
    props.onFetchTasks();
  }, []);

  useEffect(() => {
    setTaskList(props.initialTaskList);
  }, [props.initialTaskList]);

  const taskChangeStatusHandler = (taskId: string, done: boolean) => {
    setTaskList([...taskList].map((task) => {
      if (task.id === taskId) {
        return { ...task, done };
      }
      return task;
    }));

    props.onTaskChangeStatus(taskId, done);
  };

  return (
    <>
      <TodoListHeader />
      {!taskList || taskList.length === 0
        ? <NoTasksMessage />
        : taskList
          .sort((taskA, taskB) =>
            (taskA.priority - taskB.priority)
          )
          .sort((taskA, taskB) =>
            (taskA.done === taskB.done) ? 0 : taskA.done ? 1 : -1
          )
          .map((task) => {
            const priorityColor =
              PRIORITY_LEVELS.find((priorityLevel) => priorityLevel.order === task.priority)?.displayColor as string;

            return <div data-testid="taskList" key={task.id} className={styles.todoList}>
              {task.id === props.editTaskId
                ? <TodoListItemEdit
                  taskId={task.id}
                  taskName={task.displayName}
                  taskDone={task.done}
                  taskPriority={task.priority}
                  onCancelEdit={() => props.onSetTaskEditId(undefined)}
                  onEdit={props.onEditTask} />
                : <TodoListItemDisplay
                  taskId={task.id}
                  taskName={task.displayName}
                  taskDone={task.done}
                  taskPriorityColor={priorityColor}
                  onTaskChangeStatus={taskChangeStatusHandler}
                  onSetEdit={props.onSetTaskEditId}
                  onDelete={props.onDeleteTask} />
              }
            </div>;
          })
      }
    </>
  );
};

const mapStateToProps = (state: RootState): StateProps => {
  return {
    initialTaskList: getTaskList(state.task),
    editTaskId: getEditTaskId(state.task)
  };
};

const mapDispatchToProps = (dispatch: Dispatch<TaskActionPartial>): DispatchProps => {
  return {
    onFetchTasks: () => dispatch(actions.task.taskFetch()),
    onTaskChangeStatus: (taskId: string, done: boolean) => dispatch(actions.task.taskChangeStatus(taskId, done)),
    onSetTaskEditId: (taskId?: string) => dispatch(actions.task.taskSetEditId(taskId)),
    onEditTask: (task: Task) => dispatch(actions.task.taskEdit(task)),
    onDeleteTask: (taskId: string) => dispatch(actions.task.taskDelete(taskId)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(TodoList);