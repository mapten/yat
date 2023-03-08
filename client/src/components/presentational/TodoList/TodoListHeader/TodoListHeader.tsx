// Styles
import styles from './TodoListHeader.module.scss';

// Components
import ThemeToggleButton from '../../ThemeToggleButton/ThemeToggleButton';

const TodoListHeader: React.FC = () => {

  return (
    <div className={styles.todoList__Header}>
      <h1>Task list</h1>
      <ThemeToggleButton />
    </div>
  );
};

export default TodoListHeader;