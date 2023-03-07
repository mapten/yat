// Styles
import styles from './TodoListHeader.module.scss';

export const TodoListHeader: React.FC = () => {

  return (
    <header className={styles.todoList__Header}>
      <h1>Task list</h1>
    </header>
  );
};