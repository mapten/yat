// Styles
import styles from './Header.module.scss';

// Components
import ThemeToggleButton from '../ThemeToggleButton/ThemeToggleButton';
import HeaderLogo from './HeaderLogo/HeaderLogo';
import UserMenu from '../UserMenu/UserMenu';
import StoreMode from '../StoreMode/StoreMode';

const Header: React.FC = () => {
  return (
    <div className={styles.todoListHeader}>
      <HeaderLogo />
      <div className={styles.todoListHeader__menuGroup}>
        <StoreMode />
        <ThemeToggleButton />
        <UserMenu />
      </div>
    </div>
  );
};

export default Header;