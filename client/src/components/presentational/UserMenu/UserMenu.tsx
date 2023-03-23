
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

  const { user, logout, isAuthenticated, setIsLoginVisible } = useAuthStore((state) => state);
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
    setIsLoginVisible(true);
  };

  const logoutHandler = () => {
    setMenuOpen(false);
    setStoreMode('offline');
    logout();
  };

  return (
    <div ref={ref} role="menu" className={styles.userMenu} onMouseEnter={openMenuHandler} onMouseLeave={closeMenuHandler}>
      <div role="menuitem" className={`${styles.userMenu__displayName}`} onClick={toggleMenuHandler}>
        <span>Hi, {user?.name || 'Anonymous'}</span>
      </div>
      {
        menuOpen && (
          <div data-testid="userMenu__options" className={`themeBg themeBorder ${styles.userMenu__options}`}>
            {
              isAuthenticated() && (
                <div className={`${styles.userMenu__option}`} onClick={logoutHandler} role="menuitem">
                  <span>Logout</span>
                  <Icon icon="websymbol:logout" />
                </div>
              )
            }
            <div className={`${styles.userMenu__option}`} onClick={openLoginHandler} role="menuitem">
              <span>Select how to connect (online / offline)</span>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default UserMenu;