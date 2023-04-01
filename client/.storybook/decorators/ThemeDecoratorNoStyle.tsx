import { useState } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

// Types
import { THEME } from '../../src/typings/common.types';

// Context
import { ThemeContext } from '../../src/components/hoc/ThemeProvider/ThemeProvider';

const ThemeDecoratorNoStyle = (Story: Story, context: Meta,) => {
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

export default ThemeDecoratorNoStyle;