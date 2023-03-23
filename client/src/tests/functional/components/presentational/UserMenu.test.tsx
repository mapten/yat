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
  beforeEach(() => {
    mockAuthStore.mockReturnValue({
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@doe.com',
      },
      logout: vi.fn(),
      isAuthenticated: vi.fn(),
      setIsLoginModalOpen: vi.fn(),
    });

    mockConfigurationStore.mockReturnValue({
      setStoreMode: vi.fn(),
    });
  });

  const renderUI = () => {
    return render(<UserMenu />);
  };

  afterEach(() => {
    cleanup();
  });

  it('should render the user name when user is not null', () => {
    // arrange
    renderUI();

    const menuItem = screen.getAllByRole('menuitem')[0];

    // assert
    expect(menuItem.textContent).toBe('Hi, John Doe');
  });

  it('should render "Anonymous" when user is null', () => {
    // arrange
    mockAuthStore.mockReturnValue({
      user: null
    });

    renderUI();

    const menuItem = screen.getAllByRole('menuitem')[0];

    // assert
    expect(menuItem.textContent).toBe('Hi, Anonymous');
  });

  it('should render "Anonymous" when user name is empty', () => {
    // arrange
    mockAuthStore.mockReturnValue({
      user: {
        id: '1',
        name: '',
        email: 'john@doe.com',
      },
    });

    renderUI();

    const menuItem = screen.getAllByRole('menuitem')[0];

    // assert
    expect(menuItem.textContent).toBe('Hi, Anonymous');
  });

  it('should show / hide the menu when move the mouse over / outside the component', () => {
    // arrange
    renderUI();

    // act
    fireEvent.mouseEnter(screen.getAllByRole('menuitem')[0]);
    // assert
    expect(screen.getByTestId('userMenu__options')).toBeTruthy();

    // act
    fireEvent.mouseLeave(screen.getAllByRole('menuitem')[0]);
    // assert
    expect(screen.queryByTestId('userMenu__options')).toBeNull();
  });

  it('should show / hide the menu when clicking on the component', () => {
    // arrange
    renderUI();

    // act
    fireEvent.click(screen.getAllByRole('menuitem')[0]);
    // assert
    expect(screen.getByTestId('userMenu__options')).toBeTruthy();

    // act
    fireEvent.click(screen.getAllByRole('menuitem')[0]);
    // assert
    expect(screen.queryByTestId('userMenu__options')).toBeNull();
  });

  it('should call logout when clicking on the logout option', async () => {
    // arrange
    const mockLogout = vi.fn();
    mockAuthStore.mockReturnValue({
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@doe.com',
      },
      logout: mockLogout,
      isAuthenticated: () => true,
      setIsLoginModalOpen: vi.fn(),
    });

    renderUI();

    fireEvent.click(screen.getAllByRole('menuitem')[0]);
    // act
    fireEvent.click(screen.getByText('Logout'));

    // assert
    expect(mockLogout).toHaveBeenCalled();
    expect(screen.queryByTestId('userMenu__options')).toBeNull();
  });

  it('should call openLoginHandler when clicking on the "Select how to connect (online / offline)" option', async () => {
    // arrange
    const mockSetIsLoginVisible = vi.fn();
    mockAuthStore.mockReturnValue({
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@doe.com',
      },
      logout: vi.fn(),
      isAuthenticated: vi.fn(),
      setIsLoginVisible: mockSetIsLoginVisible,
    });
    
    renderUI();

    fireEvent.click(screen.getAllByRole('menuitem')[0]);
    // act
    fireEvent.click(screen.getByText('Select how to connect (online / offline)'));

    // assert
    expect(mockSetIsLoginVisible).toHaveBeenCalledWith(true);
    expect(screen.queryByTestId('userMenu__options')).toBeNull();
  });
});