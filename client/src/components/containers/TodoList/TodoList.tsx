import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { toast } from 'react-toastify';

// Store
import * as actions from '../../../store/actions';
import { RootState } from '../../../store/models/rootState.model';
import { getTaskList, TaskActionPartial } from '../../../store/reducers/task.reducer';

// Constants
import { PRIORITY_LEVELS } from '../../../constants/priorityLevels.constants';

// Models
import { Task } from '../../../models/task.model';

// Components
import { TodoListHeader } from '../../presentational/TodoList/TodoListHeader/TodoListHeader';
import { TodoListItem } from '../../presentational/TodoList/TodoListItem/TodoListItem';
import { NoTasksMessage } from '../../presentational/UI/NoTasksMessage/NoTasksMessage';


type StateProps = {
  taskList: Task[];
}

type DispatchProps = {
  fetchTasks: () => void;
  onTaskChangeStatus: (taskId: string, done: boolean) => void;
}

type Props = DispatchProps & StateProps;

export const TodoList: React.FC<Props> = (props: Props) => {
  const [taskList, setTaskList] = useState<Task[]>([]);

  useEffect(() => {
    props.fetchTasks();
  }, []);

  useEffect(() => {
    setTaskList(props.taskList);
  }, [props.taskList]);

  const taskChangeStatusHandler = (taskId: string, done: boolean) => {
    setTaskList([...taskList].map((task) => {
      if (task.id === taskId) {
        return {...task, done};
      }
      return task;
    }));

    props.onTaskChangeStatus(taskId, done);
  };

  return (
    <React.Fragment>
      <TodoListHeader />
      {!taskList || taskList.length === 0
        ? <NoTasksMessage />
        : taskList
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
            />;
          })
      }
    </React.Fragment>
  );
};

const mapStateToProps = (state: RootState): StateProps => {
  return {
    taskList: getTaskList(state.task),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<TaskActionPartial>): DispatchProps => {
  return {
    fetchTasks: () => dispatch(actions.task.taskFetch()),
    onTaskChangeStatus: (taskId: string, done: boolean) => dispatch(actions.task.taskChangeStatus(taskId, done)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(TodoList);