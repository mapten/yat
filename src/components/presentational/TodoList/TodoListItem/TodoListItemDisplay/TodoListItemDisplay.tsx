import React, { useEffect, useState } from 'react';

// Styles
import styles from './TodoListItemDisplay.module.scss';

// Components
import { Button } from '../../../UI/Button/Button';

type StateProps = {
  taskId: string;
  taskName: string;
  taskDone: boolean;
  taskPriorityColor: string;
}

type DispatchProps = {
  onTaskChangeStatus: (taskId: string, taskDone: boolean) => void;
  onSetEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

type Props = StateProps & DispatchProps;

export const TodoListItemDisplay: React.FC<Props> = (props: Props) => {
  const [taskDone, setTaskDone] = useState<boolean>(false);

  useEffect(() =>  {
    setTaskDone(props.taskDone);
  }, [props.taskDone]);

  const checkboxChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDone(event.target.checked);
    props.onTaskChangeStatus(props.taskId, event.target.checked);
  };

  const editTaskHandler = () => {
    props.onSetEdit(props.taskId);
  };

  const deleteTaskHandler = () => {
    props.onDelete(props.taskId);
  };

  return (
    <div data-testid="todoItemDisplay" style={{borderLeftColor: props.taskPriorityColor}} className={styles.itemDisplay}>
      <div>
        <input className={styles.itemDisplay__checkBox} type='checkbox' checked={taskDone} onChange={checkboxChangeHandler} />
        <span className={`${styles.itemDisplay__task} ${taskDone ? styles['itemDisplay__task--crossed'] : ''}`}>{props.taskName}</span>
      </div>
      <div className={styles.itemDisplay__buttonGroup}>
        <Button size="small" displayText="Edit" buttonStyle="default" onClick={editTaskHandler} iconName="pencil-alt" />
        <Button size="small" displayText="Delete" buttonStyle="default" onClick={deleteTaskHandler} iconName="trash" />
      </div>
    </div>
  );
};