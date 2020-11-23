import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { PRIORITY_LEVELS } from '../../../constants/priorityLevels.constant';
import { Task } from '../../../models/task.model';
import { RootState } from '../../../store/models/rootState.model';
import { TodoAction } from '../../../store/reducers/todo.reducer';
import { TodoListHeader } from '../../presentational/TodoList/TodoListHeader/TodoListHeader';
import { TodoListItem } from '../../presentational/TodoList/TodoListItem/TodoListItem';

type StateProps = {
  taskList: Task[];
}

type DispatchProps = {
  onTaskChangeStatus: (taskId: string, done: boolean) => void;
}

type Props = DispatchProps & StateProps;

export const TodoList: React.FC<Props> = (props: Props) => {
  const [taskList, setTaskList] = useState<Task[]>([]);

  useEffect(() => {
    setTaskList(props.taskList)
  }, [props.taskList]);

  const taskChangeStatusHandler = (taskId: string, done: boolean) => {
    setTaskList([...taskList].map((task) => {
      if (task.id === taskId) {
        return {...task, done};
      }
      return task;
    }));

    props.onTaskChangeStatus(taskId, done);
  }

	return (
    <Fragment>
      <TodoListHeader />
      {taskList
        .sort((taskA, taskB) =>
          (taskA.priority - taskB.priority)
        )
        .sort((taskA, taskB) =>
          (taskA.done === taskB.done) ? 0 : taskA.done? 1 : -1
        )
        .map((task) => {
          const priorityColor =
            PRIORITY_LEVELS.find((priorityLevel) => priorityLevel.order === task.priority)?.displayColor as string;

          return <TodoListItem
            key={task.id}
            taskId={task.id}
            taskName={task.displayName}
            taskDone={task.done}
            taskPriorityColor={priorityColor}
            onTaskChangeStatus={taskChangeStatusHandler}
          />
        })
      }
    </Fragment>
  );
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    taskList: [],
  };
};

const mapDispatchToProps = (dispatch: Dispatch<TodoAction>): DispatchProps => {
  return {
    onTaskChangeStatus: (taskId: string, done: boolean) => null,
  };
};


/**
 * {@link TodoList} component connected to Redux.
 * 
 * @example
 * <ConnectedTodoList />
 */
export const ConnectedTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);