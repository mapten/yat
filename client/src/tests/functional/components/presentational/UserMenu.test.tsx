import { describe, it, vi, beforeEach, afterEach, expect, MockedFunction } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

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
      isAuthenticated: () => true
    });

    renderUI();

    fireEvent.click(screen.getAllByRole('menuitem')[0]);
    // act
    fireEvent.click(screen.getByText('Logout'));

    // assert
    expect(mockLogout).toHaveBeenCalled();
    expect(screen.queryByTestId('userMenu__options')).toBeNull();
  });

  it('should call openLoginHandler when clicking on "Login"', async () => {
    // arrange
    const mockSetLoginVisibleMode = vi.fn();
    mockAuthStore.mockReturnValue({
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@doe.com',
      },
      logout: vi.fn(),
      isAuthenticated: vi.fn(),
      setLoginVisibleMode: mockSetLoginVisibleMode
    });
    
    renderUI();

    fireEvent.click(screen.getAllByRole('menuitem')[0]);
    // act
    fireEvent.click(screen.getByText('Login'));

    // assert
    expect(mockSetLoginVisibleMode).toHaveBeenCalledWith('online');
    expect(screen.queryByTestId('userMenu__options')).toBeNull();
  });

  describe('keyboard events', () => {
    it('should show / hide the menu when pressing the "Enter" key', () => {
      // arrange
      renderUI();

      // act
      fireEvent.keyDown(screen.getAllByRole('menuitem')[0], { key: 'Enter' });
      // assert
      expect(screen.getByTestId('userMenu__options')).toBeTruthy();

      // act
      fireEvent.keyDown(screen.getAllByRole('menuitem')[0], { key: 'Enter' });
      // assert
      expect(screen.queryByTestId('userMenu__options')).toBeNull();
    });

    it('should show / hide the menu when pressing the "Space" key', () => {
      // arrange
      renderUI();

      // act
      fireEvent.keyDown(screen.getAllByRole('menuitem')[0], { key: ' ' });
      // assert
      expect(screen.getByTestId('userMenu__options')).toBeTruthy();

      // act
      fireEvent.keyDown(screen.getAllByRole('menuitem')[0], { key: ' ' });
      // assert
      expect(screen.queryByTestId('userMenu__options')).toBeNull();
    });

    it('should show the menu when pressing the "ArrowDown" key', () => {
      // arrange
      renderUI();

      // act
      fireEvent.keyDown(screen.getAllByRole('menuitem')[0], { key: 'ArrowDown' });
      // assert
      expect(screen.getByTestId('userMenu__options')).toBeTruthy();
    });

    it('should hide the menu when pressing the "Escape" key', () => {
      // arrange
      renderUI();

      // act
      fireEvent.keyDown(screen.getAllByRole('menuitem')[0], { key: 'Escape' });
      // assert
      expect(screen.queryByTestId('userMenu__options')).toBeNull();
    });

    it('should hide the menu when pressing the "ArrowUp" key', () => {
      // arrange
      renderUI();

      // act
      fireEvent.keyDown(screen.getAllByRole('menuitem')[0], { key: 'ArrowUp' });
      // assert
      expect(screen.queryByTestId('userMenu__options')).toBeNull();
    });

    it('should logout when pressing the "Enter" key on the logout option', () => {
      // arrange
      const mockLogout = vi.fn();
      mockAuthStore.mockReturnValue({
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@doe.com',
        },
        logout: mockLogout,
        isAuthenticated: () => true
      });
      renderUI();

      fireEvent.click(screen.getAllByRole('menuitem')[0]);
      // act
      fireEvent.keyDown(screen.getByText('Logout'), { key: 'Enter' });
  
      // assert
      expect(mockLogout).toHaveBeenCalled();
      expect(screen.queryByTestId('userMenu__options')).toBeNull();
    });

    it('should logout when pressing the "Space" key on the logout option', () => {
      // arrange
      const mockLogout = vi.fn();
      mockAuthStore.mockReturnValue({
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@doe.com',
        },
        logout: mockLogout,
        isAuthenticated: () => true
      });
      renderUI();

      fireEvent.click(screen.getAllByRole('menuitem')[0]);
      // act
      fireEvent.keyDown(screen.getByText('Logout'), { key: ' ' });
  
      // assert
      expect(mockLogout).toHaveBeenCalled();
      expect(screen.queryByTestId('userMenu__options')).toBeNull();
    });

    it('should login when pressing "Enter" on the login option', () => {
      // arrange
      const mockSetLoginVisibleMode = vi.fn();
      mockAuthStore.mockReturnValue({
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@doe.com',
        },
        isAuthenticated: () => false,
        setLoginVisibleMode: mockSetLoginVisibleMode,
      });
      renderUI();

      fireEvent.click(screen.getAllByRole('menuitem')[0]);
      // act
      fireEvent.keyDown(screen.getByText('Login'), { key: 'Enter' });
  
      // assert
      expect(mockSetLoginVisibleMode).toHaveBeenCalled();
      expect(screen.queryByTestId('userMenu__options')).toBeNull();
    });

    it('should login when pressing "Space" on the login option', () => {
      // arrange
      const mockSetLoginVisibleMode = vi.fn();
      mockAuthStore.mockReturnValue({
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@doe.com',
        },
        isAuthenticated: () => false,
        setLoginVisibleMode: mockSetLoginVisibleMode,
      });
      renderUI();

      fireEvent.click(screen.getAllByRole('menuitem')[0]);
      // act
      fireEvent.keyDown(screen.getByText('Login'), { key: ' ' });
  
      // assert
      expect(mockSetLoginVisibleMode).toHaveBeenCalled();
      expect(screen.queryByTestId('userMenu__options')).toBeNull();
    });
  });
});