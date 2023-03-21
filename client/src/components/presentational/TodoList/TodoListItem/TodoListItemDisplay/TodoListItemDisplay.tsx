import { useEffect, useState } from 'react';

// Styles
import styles from './TodoListItemDisplay.module.scss';

// Components
import { Button } from '../../../UI/Button/Button';
import CheckBoxCrossed from '../../../../presentational/UI/CheckBoxCrossed/CheckBoxCrossed';

type StateProps = {
  taskId: string;
  taskName: string;
  taskDone: boolean;
  taskPriorityColor?: string;
}

type DispatchProps = {
  onTaskChangeStatus: (taskId: string, taskDone: boolean) => void;
  onSetEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

type Props = StateProps & DispatchProps;

export const TodoListItemDisplay: React.FC<Props> = (props: Props) => {
  const [taskDone, setTaskDone] = useState<boolean>(false);

  useEffect(() => {
    setTaskDone(props.taskDone);
  }, [props.taskDone]);

  const checkboxChangeHandler = (checked: boolean) => {
    setTaskDone(checked);
    props.onTaskChangeStatus(props.taskId, checked);
  };

  const editTaskHandler = () => {
    props.onSetEdit(props.taskId);
  };

  const deleteTaskHandler = () => {
    props.onDelete(props.taskId);
  };

  return (
    <div data-testid="todoItemDisplay" className={`themeWrapper task ${styles.itemDisplay}`}>
      <CheckBoxCrossed onChange={checkboxChangeHandler} text={props.taskName} initialChecked={taskDone} color={props.taskPriorityColor} />
      <div className={styles.itemDisplay__buttonGroup}>
        <Button size="big" displayText="Edit" buttonStyle="default" onClick={editTaskHandler} buttonType="icon" iconName="material-symbols:edit" />
        <Button size="big" displayText="Delete" buttonStyle="default" onClick={deleteTaskHandler} buttonType="icon" iconName="mdi:trash-can-outline" />
      </div>
    </div>
  );
};