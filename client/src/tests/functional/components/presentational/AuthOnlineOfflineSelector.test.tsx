import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

import { render, cleanup, screen, fireEvent } from '@testing-library/react';

// Components
import AuthOnlineOfflineSelector from '../../../../components/presentational/AuthOnlineOfflineSelector/AuthOnlineOfflineSelector';

type Props = React.ComponentPropsWithoutRef<typeof AuthOnlineOfflineSelector>;

describe('<AuthOnlineOfflineSelector/>', () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      initialSelectedMode: 'online',
      onChange: vi.fn(),
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<AuthOnlineOfflineSelector {...baseProps} {...props} />);
  };
  
  afterEach(() => {
    cleanup();
  });

  it('should change the text when clicking on toggle button', () => {
    // arrange
    renderUI({ initialSelectedMode: 'online' });

    expect(screen.getByText(/The data will be saved online/i)).toBeTruthy();
    expect(screen.queryByText(/The data will be saved offline/i)).toBeFalsy();

    const offlineButton = screen.getByRole('button', { name: /offline/i });
    // act
    fireEvent.click(offlineButton);

    // assert
    expect(screen.getByText(/The data will be saved offline/i)).toBeTruthy();
    expect(screen.queryByText(/The data will be saved online/i)).toBeNull();
  });

  it('should display the specific offline test when initialSelectedMode is "offline"', () => {
    // arrange, act
    renderUI({ initialSelectedMode: 'offline' });

    // assert
    expect(screen.getByText(/The data will be saved offline/i)).toBeTruthy();
    expect(screen.queryByText(/The data will be saved online/i)).toBeNull();
  });

  it('should call onChange when clicking on toggle button', () => {
    // arrange
    renderUI({ initialSelectedMode: 'online' });

    const offlineButton = screen.getByRole('button', { name: /offline/i });
    // act
    fireEvent.click(offlineButton);

    // assert
    expect(baseProps.onChange).toBeCalledWith('offline');
  });
});