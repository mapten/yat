import { describe, it, afterEach, expect } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

// Components
import ThemeProvider, { useTheme } from '../../../../components/hoc/ThemeProvider/ThemeProvider';

describe('ThemeProviver', () => {

  const TestComponent: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
      <div>
        <span data-testid='theme'>{theme}</span>
        <button data-testid='toggle-theme' onClick={toggleTheme}>Toggle theme</button>
      </div>
    );
  };

  const renderUI = () => {
    return render(<ThemeProvider>
      <TestComponent />
    </ThemeProvider>);
  };

  afterEach(() => {
    cleanup();
  });

  it('should render the default theme', () => {
    renderUI();

    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('should toggle the theme', () => {
    renderUI();

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });
});