import { describe, it, expect, afterEach } from 'vitest';

import { render, cleanup, screen, fireEvent } from '@testing-library/react';

// Components
import ThemeToggleButton from '../../../../components/presentational/ThemeToggleButton/ThemeToggleButton';
import ThemeProvider from '../../../../components/hoc/ThemeProvider/ThemeProvider';

describe('<ThemeToggleButton/>', () => {
  const renderUI = () => {
    return render(<ThemeProvider>
      <ThemeToggleButton />
    </ThemeProvider>);
  };
  
  afterEach(() => {
    cleanup();
  });

  it('should change the text and the icon when clicking on it', () => {
    // arrange
    renderUI();

    const button = screen.getByRole('button');

    expect(button.textContent).toBe('Light Mode');
    expect(button.getAttribute('title')).toBe('Switch to Dark Mode');

    // act
    fireEvent.click(button);

    // assert
    expect(button.textContent).toBe('Dark Mode');
    expect(button.getAttribute('title')).toBe('Switch to Light Mode');
  });
});