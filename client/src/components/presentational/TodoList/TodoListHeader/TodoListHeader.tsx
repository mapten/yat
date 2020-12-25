import React from 'react';
import { Button } from '../../UI/Button/Button';
import styles from './TodoListHeader.module.scss';
import { useHistory } from 'react-router-dom';

export const TodoListHeader: React.FC = () => {
  const history = useHistory();

  function clickHandler() {
    history.push('/create');
  }

	return (
    <header className={styles.wrapper}>
      <h1>Task list</h1>
      <Button
        tooltip='Create new task'
        displayText='New'
        buttonStyle='add'
        iconName='plus'
        onClick={clickHandler} />
    </header>
  );
}