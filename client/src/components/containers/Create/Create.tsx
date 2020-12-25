import React, { Fragment, useState } from 'react';
import styles from './Create.module.scss';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Dispatch } from 'redux';
import { PRIORITY_LEVELS, PRIORITY_ORDER_TYPE } from '../../../constants/priorityLevels.constants';
import { Priority } from '../../../models/priority.model';
import { TaskActionPartial } from '../../../store/reducers/task.reducer';
import { Button } from '../../presentational/UI/Button/Button';
import { useHistory } from 'react-router-dom';
import * as actions from '../../../store/actions';
import { Task } from '../../../models/task.model';
import { NEW_TASK_ID } from '../../../constants/common';

type DispatchProps = {
  onSave: (newTask: Task) => void;
}

type Props = DispatchProps;

export const Create: React.FC<Props> = (props: Props) => {
  const history = useHistory();

  const defaultPriorityLevel =
    PRIORITY_LEVELS.find((priorityLevel) => priorityLevel.isDefaultSelected === true) as Priority;

  const [name, setName] = useState<string>('');
  const [errorOnName, setErrorOnName] = useState<boolean>(false);
  const [priority, setPriority] = useState<PRIORITY_ORDER_TYPE>(defaultPriorityLevel.order);

  const cancelHandler = () => {
    history.push('/todolist');
  }

  const saveHandler = () => {
    if (!name) {
      toast.warning('A task needs a name');
      setErrorOnName(true);
    } else {
      setErrorOnName(false);

      const newTask: Task = {
        id: NEW_TASK_ID,
        displayName: name,
        priority,
        done: false,
      }
      props.onSave(newTask);

      history.push('/todolist');
    }
  }

  const priorityChangeHandler = (event: React.SyntheticEvent<HTMLSelectElement, Event>) => {
    const priorityOrder = Number((event.target as HTMLSelectElement).value);
    setPriority(priorityOrder);
  }

	return (
    <Fragment>
      <header className={styles.header}>
        <h1>Create task</h1>
      </header>
      <main>
        <section>
          <form>
            <div className={styles.formRow}>
              <label className={styles.formLabel}>
                Task:
              </label>
              <input
                onBlur={() => setErrorOnName(false)}
                onChange={(e) => setName(e.target.value)}
                value={name}
                type='text'
                className={`${styles.formControl} ${errorOnName ? styles.danger : ''}`} />
            </div>
            <div className={styles.formRow}>
              <label className={styles.formLabel}>
                Priority:
              </label>
              <select
                className={styles.formControl}
                onChange={(e) => priorityChangeHandler(e)}
                value={priority}>
                {PRIORITY_LEVELS.map((priorityLevel) => {
                  return <option key={priorityLevel.order} value={priorityLevel.order}>{priorityLevel.displayText}</option>
                })}
              </select>
            </div>
          </form>
          <div className={styles.buttonGroup}>
            <Button
              data-testid="create-button-cancel"
              tooltip='Cancel changes and go to task list'
              displayText='Cancel'
              buttonStyle='dismiss'
              iconName='arrow-left'
              onClick={cancelHandler} />
            <Button
              data-testid="create-button-save"
              tooltip='Save changes and go to task list'
              displayText='Save'
              buttonStyle='add'
              iconName='save'
              onClick={saveHandler} />
          </div>
        </section>
      </main>
    </Fragment>
  );
}

const mapDispatchToProps = (dispatch: Dispatch<TaskActionPartial>): DispatchProps => {
  return {
    onSave: (newTask) => dispatch(actions.task.taskCreate(newTask)),
  };
};


/**
 * {@link Create} component connected to Redux.
 * 
 * @example
 * <ConnectedCreate />
 */
export const ConnectedCreate = connect(null, mapDispatchToProps)(Create);