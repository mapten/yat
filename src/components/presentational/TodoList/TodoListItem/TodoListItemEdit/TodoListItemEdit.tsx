import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Styles
import styles from './TodoListItemEdit.module.scss';

// Components
import { Button } from '../../../UI/Button/Button';
import { Task } from '../../../../../models/task.model';

// Constants
import { PRIORITY_LEVELS, PRIORITY_ORDER_TYPE } from '../../../../../constants/priorityLevels.constants';


type StateProps = {
  taskId: string;
  taskName: string;
  taskPriority: PRIORITY_ORDER_TYPE;
  taskDone: boolean;
}

type DispatchProps = {
  onCancelEdit: () => void;
  onEdit: (task: Task) => void;
}

type Props = StateProps & DispatchProps;

export const TodoListItemEdit: React.FC<Props> = (props: Props) => {
  const [name, setName] = useState<string>('');
  const [priority, setPriority] = useState<PRIORITY_ORDER_TYPE>(0);
  const [errorOnName, setErrorOnName] = useState<boolean>(false);

  useEffect(() => {
    setName(props.taskName);
  }, [props.taskName]);

  useEffect(() => {
    setPriority(props.taskPriority);
  }, [props.taskPriority]);

  const onEdit = () => {
    if (!name) {
      toast.warning('The task name is empty');
      setErrorOnName(true);
    } else {
      setErrorOnName(false);
      props.onEdit({
        id: props.taskId,
        displayName: name,
        priority,
        done: props.taskDone
      });
    }

  };

  const priorityChangeHandler = (event: React.SyntheticEvent<HTMLSelectElement, Event>) => {
    const priorityOrder = Number((event.target as HTMLSelectElement).value);
    setPriority(priorityOrder);
  };

  return (
    <div data-testid="todoItemEdit" className={styles.wrapper}>
      <div>
        <input
          data-testid="todoItemEdit_InputName"
          onBlur={() => setErrorOnName(false)}
          onChange={(e) => setName(e.target.value)}
          value={name}
          type='text'
          className={`${styles.formControl} ${errorOnName ? styles.danger : ''}`} />
        <label>Priority: </label>
        <select
          data-testid="todoItemEdit_PrioritySelect"
          className={styles.formControl}
          onChange={(e) => priorityChangeHandler(e)}
          value={priority}>
          {PRIORITY_LEVELS.map((priorityLevel) => {
            return <option key={priorityLevel.order} value={priorityLevel.order}>{priorityLevel.displayText}</option>;
          })}
        </select>
      </div>
      <div>
        <Button size="small" displayText="Cancel" buttonStyle="dismiss" onClick={props.onCancelEdit} iconName="times" />
        <Button size="small" displayText="Save" buttonStyle="add" onClick={onEdit} iconName="save" />
      </div>
    </div>
  );
};