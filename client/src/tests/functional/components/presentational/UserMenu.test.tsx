import { describe, it, vi, beforeEach, afterEach, expect, MockedFunction } from 'vitest';

import React from 'react';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';

// Components
import UserMenu from '../../../../components/presentational/UserMenu/UserMenu';

// Store
import { useAuthStore } from '../../../../store/auth.store';
import { useConfigurationStore } from '../../../../store/configuration.store';

vi.mock('../../../../store/auth.store', () => ({
  useAuthStore: vi.fn(),
}));
const mockAuthStore = useAuthStore as unknown as MockedFunction<typeof useAuthStore>;

vi.mock('../../../../store/configuration.store', () => ({
  useConfigurationStore: vi.fn(),
}));
const mockConfigurationStore = useConfigurationStore as unknown as MockedFunction<typeof useConfigurationStore>;

describe('<UserMenu/>', () => {
  const renderUI = () => {
    return render(<UserMenu />);
  };

  afterEach(() => {
    cleanup();
  });

  it('should trigger onSelect callback when click on an option', () => {
    // arrange
    renderUI();

    fireEvent.click(screen.getByTestId('select__selected'));

    const option = screen.getByRole('option', { name: 'Mid' });

    // act
    fireEvent.click(option);

    // assert
    expect(baseProps.onSelect).toHaveBeenCalledWith('1');
  });


  it('should hide the options when click on an option', () => {
    // arrange
    renderUI();

    fireEvent.click(screen.getByTestId('select__selected'));

    const option = screen.getByRole('option', { name: 'Mid' });

    // act
    fireEvent.click(option);

    // assert
    expect(screen.queryByRole('option')).toBeNull();
  });

  it('should hide the options when click outside the component', () => {
    // arrange
    renderUI();

    fireEvent.click(screen.getByTestId('select__selected'));

    // act
    fireEvent.click(document.body);

    // assert
    waitFor(() => {
      expect(screen.queryByRole('option')).toBeNull();
    });
  });

  it('should hide the options when press escape', () => {
    // arrange
    renderUI();

    fireEvent.click(screen.getByTestId('select__selected'));

    // act
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });

    // assert
    waitFor(() => {
      expect(screen.queryByRole('option')).toBeNull();
    });
  });
});