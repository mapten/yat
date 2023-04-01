import { useEffect, useState, useRef, useId, forwardRef, useImperativeHandle, Ref } from 'react';
import { Icon } from '@iconify/react';

// Styles
import styles from './TodoListItemEdit.module.scss';

// Constants
import { DEFAULT_PRIORITY, PRIORITY_LEVELS, PRIORITY_ORDER_TYPE } from '../../../../../constants/priorityLevels.constants';
import { NEW_TASK_ID } from '../../../../../constants/common.constants';

// Models
import { Priority } from '../../../../../models/priority.model';
import { Task } from '../../../../../models/task.model';

// Components
import { Button } from '../../../UI/Button/Button';
import Select from '../../../UI/Select/Select';

type StateProps = {
  taskId?: string;
  initialTaskPriority?: PRIORITY_ORDER_TYPE;
  taskDone?: boolean;
  initialTaskName?: string;
  placeholder?: string;
}

type DispatchProps = {
  onCancelEdit: () => void;
  onSave: (task: Partial<Task>) => void;
}

export type RefType = {
  reset: () => void;
}

type Props = StateProps & DispatchProps;

const TodoListItemEdit = ({ taskId, initialTaskName, initialTaskPriority, taskDone, placeholder, onCancelEdit, onSave }: Props, ref: Ref<RefType>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectId = useId();
  const taskNameId = useId();

  const [name, setName] = useState<string>(initialTaskName || '');
  const [priority, setPriority] = useState<PRIORITY_ORDER_TYPE>(initialTaskPriority || DEFAULT_PRIORITY);
  const [errorOnName, setErrorOnName] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useImperativeHandle(ref, () => ({
    reset() {
      setName('');
      setPriority(DEFAULT_PRIORITY);
    }
  }));

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value) {
      setErrorOnName(false);
    }
  };

  const saveHandler = () => {
    if (!name) {
      setErrorOnName(true);
    } else {
      setErrorOnName(false);
      onSave({
        id: taskId ?? NEW_TASK_ID,
        displayName: name,
        priority,
        done: taskDone ?? false,
      });
    }
  };

  const selectDisplay = (priority: Priority) => {
    return (<div className={styles.itemEdit__selectOption}>
      <Icon icon="map:circle" color={priority.displayColor} />
      <span className={styles.select__item}>{priority.displayText}</span>
    </div>);
  };

  return (
    <div data-testid="todoItemEdit" className={`themeWrapper task ${styles.itemEdit}`}>
      <div className={styles.itemEdit__formItem}>
        <label htmlFor={taskNameId}>Task: </label>
        <input
          id={taskNameId}
          ref={inputRef}
          data-testid="todoItemEdit_InputName"
          placeholder={placeholder}
          onBlur={() => setErrorOnName(false)}
          onChange={inputChangeHandler}
          onKeyDown={(e) => e.key === 'Enter' && saveHandler()}
          value={name}
          type='text'
          className={`${errorOnName ? 'danger' : ''}`} />
      </div>
      <div className={styles.itemEdit__formItem}>
        <label htmlFor={selectId}>Priority: </label>
        <Select
          id={selectId}
          className={styles.itemEdit__select}
          items={PRIORITY_LEVELS}
          initialItem={priority}
          keyExtractor={(item) => item.order}
          textExtractor={(item) => item.displayText}
          renderItem={selectDisplay}
          onSelect={(order) => setPriority(order)}
        />
      </div>
      <div className={styles.itemEdit__buttonGroup}>
        <Button size="medium" displayText="Cancel" buttonStyle="dismiss" onClick={onCancelEdit} iconName="uil:times" />
        <Button size="medium" displayText="Save" buttonStyle="add" onClick={saveHandler} iconName="material-symbols:save" />
      </div>
    </div>
  );
};

export default forwardRef(TodoListItemEdit);