// Styles
import styles from './Header.module.scss';

// Components
import ThemeToggleButton from '../ThemeToggleButton/ThemeToggleButton';
import HeaderLogo from './HeaderLogo/HeaderLogo';

const Header: React.FC = () => {

  return (
    <div className={styles.todoList__Header}>
      <HeaderLogo />
      <ThemeToggleButton />
    </div>
  );
};

export default Header;