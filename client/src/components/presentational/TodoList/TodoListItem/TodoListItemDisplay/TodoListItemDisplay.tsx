import { useState } from 'react';

// Styles
import styles from './TodoListItemDisplay.module.scss';

// Components
import Button from '../../../UI/Button/Button';
import CheckBoxCrossed from '../../../../presentational/UI/CheckBoxCrossed/CheckBoxCrossed';

type StateProps = {
  taskId: string;
  taskName: string;
  initialTaskDone: boolean;
  taskPriorityColor?: string;
}

type DispatchProps = {
  onTaskChangeStatus: (taskId: string, taskDone: boolean) => void;
  onSetEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

type Props = StateProps & DispatchProps;

const TodoListItemDisplay: React.FC<Props> = ({taskId, taskName, initialTaskDone, taskPriorityColor, onTaskChangeStatus, onSetEdit, onDelete}: Props) => {
  const [taskDone, setTaskDone] = useState<boolean>(initialTaskDone);

  const checkboxChangeHandler = (checked: boolean) => {
    setTaskDone(checked);
    onTaskChangeStatus(taskId, checked);
  };

  const editTaskHandler = () => {
    onSetEdit(taskId);
  };

  const deleteTaskHandler = async () => {
    onDelete(taskId);
  };

  return (
    <div data-testid="todoItemDisplay" className={`themeWrapper themeHover task ${styles.itemDisplay}`}>
      <CheckBoxCrossed onChange={checkboxChangeHandler} text={taskName} initialChecked={taskDone} color={taskPriorityColor} />
      <div className={styles.itemDisplay__buttonGroup}>
        <Button size="big" displayText="Edit" buttonStyle="default" onClick={editTaskHandler} buttonType="icon" iconName="material-symbols:edit" />
        <Button size="big" displayText="Delete" buttonStyle="default" onClick={deleteTaskHandler} buttonType="icon" iconName="mdi:trash-can-outline" />
      </div>
    </div>
  );
};

export default TodoListItemDisplay;