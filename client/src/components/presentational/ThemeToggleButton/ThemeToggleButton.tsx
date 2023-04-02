import { Icon } from '@iconify/react';

// Styles
import styles from './ThemeToggleButton.module.scss';

// Context
import { useTheme } from '../../hoc/ThemeProvider/ThemeProvider';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.themeToggleButton}
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <Icon icon={theme === 'dark' ? 'ph:moon-fill' : 'ph:sun-fill'} />
      <span className={styles.themeToggleButton__text}>{ theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  );
};

export default ThemeToggleButton;