import React, { useEffect, useState } from 'react';

// Styles
import styles from './TodoListItem.module.scss';

type StateProps = {
  taskId: string;
  taskName: string;
  taskDone: boolean;
  taskPriorityColor: string;
}

type DispatchProps = {
  onTaskChangeStatus: (taskId: string, taskDone: boolean) => void;
}

type Props = StateProps & DispatchProps;

export const TodoListItem: React.FC<Props> = (props: Props) => {
  const [taskDone, setTaskDone] = useState<boolean>(false);

  useEffect(() =>  {
    setTaskDone(props.taskDone);
  }, [props.taskDone]);

  const checkboxChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDone(event.target.checked);
    props.onTaskChangeStatus(props.taskId, event.target.checked);
  };

  return (
    <div data-testid="todo-item" style={{borderLeftColor: props.taskPriorityColor}} className={styles.wrapper}>
      <span className={`${styles.task} ${taskDone ? styles.crossed : ''}`}>{props.taskName}</span>
      <input className={styles.checkbox} type='checkbox' checked={taskDone} onChange={checkboxChangeHandler} />
    </div>
  );
};