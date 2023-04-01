import { describe, it, afterEach, expect, vi, MockedFunction, beforeEach } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

// Store
import { useConfigurationStore } from '../../../../store/configuration.store';

// Components
import ThemeProvider, { useTheme } from '../../../../components/hoc/ThemeProvider/ThemeProvider';

vi.mock('../../../../store/configuration.store', () => ({
  useConfigurationStore: vi.fn(),
}));
const mockConfigurationStore = useConfigurationStore as unknown as MockedFunction<typeof useConfigurationStore>;


describe('ThemeProviver', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    mockConfigurationStore.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
  });

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
    // arrange, act
    renderUI();

    // assert
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('should toggle the theme', () => {
    // arrange
    renderUI();

    // act
    fireEvent.click(screen.getByTestId('toggle-theme'));

    // assert
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});