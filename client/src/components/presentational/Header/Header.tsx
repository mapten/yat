// Styles
import styles from './Header.module.scss';

// Components
import ThemeToggleButton from '../ThemeToggleButton/ThemeToggleButton';

const Header: React.FC = () => {

  return (
    <div className={styles.todoList__Header}>
      <h1>Task list</h1>
      <ThemeToggleButton />
    </div>
  );
};

export default Header;