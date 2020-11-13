import React from 'react';
import { Button } from '../../UI/Button/Button';
import styles from './TodoListHeader.module.scss';

type DispatchProps = {
  onCreateNewTask: () => void;
}

type Props = DispatchProps;

export const TodoListHeader: React.FC<Props> = (props: Props) => {
	return (
    <header className={styles.wrapper}>
      <h1>Task list</h1>
      <Button
        tooltip='Create new task'
        displayText='New'
        buttonStyle='add'
        iconName='plus'
        onClick={props.onCreateNewTask} />
    </header>
  );
}