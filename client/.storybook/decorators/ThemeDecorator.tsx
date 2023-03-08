import { useState } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

// Styles
import '../../src/App.scss';

// Context
import { ThemeContext } from '../../src/components/hoc/ThemeProvider/ThemeProvider';

// Constants
import { THEME } from '../../src/constants/theme.constants';

const ThemeDecorator = (Story: Story, context: Meta) => {

  const [theme, setTheme] = useState<THEME>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <button onClick={toggleTheme} style={{marginBottom: '20px'}}>Theme toggle</button>
      <div style={{padding: '20px'}} className={`${theme}-theme app`}>
        <Story {...context} />
      </div>
    </ThemeContext.Provider>
  );
}

export default ThemeDecorator;