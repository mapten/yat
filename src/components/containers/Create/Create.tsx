import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Dispatch } from 'redux';
import { PRIORITY_LEVELS, PRIORITY_ORDER_TYPE } from '../../../constants/priorityLevels.constant';
import { Priority } from '../../../models/priority.model';
import { TodoAction } from '../../../store/reducers/todo.reducer';
import { Button } from '../../presentational/UI/Button/Button';
import styles from './Create.module.scss';

type DispatchProps = {
  onCancel: () => void;
  onSave: (displayName: string, priority: PRIORITY_ORDER_TYPE) => void;
}

type Props = DispatchProps;

export const Create: React.FC<Props> = (props: Props) => {
  const defaultPriorityLevel =
    PRIORITY_LEVELS.find((priorityLevel) => priorityLevel.isDefaultSelected === true) as Priority;

  const [name, setName] = useState<string>('');
  const [errorOnName, setErrorOnName] = useState<boolean>(false);
  const [priority, setPriority] = useState<PRIORITY_ORDER_TYPE>(defaultPriorityLevel.order);

  const saveHandler = () => {
    if (!name) {
      toast.warning('A task needs a name');
      setErrorOnName(true);
    } else {
      setErrorOnName(false);
      props.onSave(name, priority);
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
              tooltip='Cancel changes and go to task list'
              displayText='Cancel'
              buttonStyle='dismiss'
              iconName='arrow-left'
              onClick={props.onCancel} />
            <Button
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

const mapDispatchToProps = (dispatch: Dispatch<TodoAction>): DispatchProps => {
  return {
    onCancel: () => null,
    onSave: (displayName: string, priority: PRIORITY_ORDER_TYPE) => null,
  };
};


/**
 * {@link Create} component connected to Redux.
 * 
 * @example
 * <ConnectedCreate />
 */
export const ConnectedTodoList = connect(null, mapDispatchToProps)(Create);