
import { useRef, useState } from 'react';
import { Icon } from '@iconify/react';

// Styles
import styles from './UserMenu.module.scss';

// Hooks
import { useOutsideClick } from '../../../hooks/useOutsideClick';

// Store
import { useAuthStore } from '../../../store/auth.store';
import { useConfigurationStore } from '../../../store/configuration.store';

const UserMenu: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout, isAuthenticated, setLoginVisibleMode } = useAuthStore((state) => state);
  const { setStoreMode } = useConfigurationStore((state) => state);

  useOutsideClick(ref, () => setMenuOpen(false));

  const toggleMenuHandler = () => {
    setMenuOpen((displayMenu) => !displayMenu);
  };

  const openMenuHandler = () => {
    setMenuOpen(true);
  };

  const closeMenuHandler = () => {
    setMenuOpen(false);
  };

  const openLoginHandler = () => {
    setMenuOpen(false);
    setLoginVisibleMode('online');
  };

  const logoutHandler = () => {
    setMenuOpen(false);
    setStoreMode('offline');
    logout();
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleMenuHandler();
      return;
    }
    if (e.key === 'Escape') {
      setMenuOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      setMenuOpen(true);
      return;
    }
    if (e.key === 'ArrowUp') {
      setMenuOpen(false);
      return;
    }
  };

  return (
    <div ref={ref} role="menu" tabIndex={0} className={styles.userMenu} onMouseEnter={openMenuHandler} onMouseLeave={closeMenuHandler}>
      <div
        role="menuitem"
        tabIndex={0}
        className={`${styles.userMenu__displayName}`}
        onClick={toggleMenuHandler}
        onKeyDown={keyDownHandler}
      >
        <span>Hi, {user?.name || 'Anonymous'}</span>
      </div>
      {
        menuOpen && (
          <div className={styles.userMenu__options}>
            <div className={`${styles.userMenu__optionsSeparator}`} />
            <div data-testid="userMenu__options" className={`themeBg themeBorder ${styles.userMenu__optionsContent}`}>
              {
                isAuthenticated() ? (
                  <div
                    className={`${styles.userMenu__option}`}
                    onClick={logoutHandler}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && logoutHandler()}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <span>Logout</span>
                    <Icon icon="websymbol:logout" />
                  </div>
                ) : (
                  <div
                    className={`${styles.userMenu__option}`}
                    onClick={openLoginHandler}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openLoginHandler()}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <span>Login</span>
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  );
};

export default UserMenu;