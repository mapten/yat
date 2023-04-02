
import { createContext, useContext } from 'react';

// Types
import { THEME } from '../../../typings/common.types';

// Store
import { useConfigurationStore } from '../../../store/configuration.store';

type ThemeContextType = {
  theme: THEME;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const useTheme = () => useContext(ThemeContext);

type Props = {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ children }: Props) => {
  const { theme, setTheme } = useConfigurationStore(state => state);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;