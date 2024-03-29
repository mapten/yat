import { describe, it, vi, afterEach, expect, MockedFunction, beforeEach } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';

// Models
import { User } from '../../../../models/user.model';

// Store
import { useAuthStore } from '../../../../store/auth.store';
import { useTaskStore } from '../../../../store/task.store';
import { useConfigurationStore } from '../../../../store/configuration.store';

// Components
import Auth from '../../../../components/containers/Auth/Auth';

type Props = React.ComponentPropsWithoutRef<typeof Auth>;

vi.mock('../../../../store/auth.store', () => ({
  useAuthStore: vi.fn(),
}));
const mockAuthStore = useAuthStore as unknown as MockedFunction<typeof useAuthStore>;

vi.mock('../../../../store/task.store', () => ({
  useTaskStore: vi.fn(),
}));
const mockTaskStore = useTaskStore as unknown as MockedFunction<typeof useTaskStore>;

vi.mock('../../../../store/configuration.store', () => ({
  useConfigurationStore: vi.fn(),
}));
const mockConfigurationStore = useConfigurationStore as unknown as MockedFunction<typeof useConfigurationStore>;

describe('<Auth />', () => {
  const initialUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@doe.com',
  };

  beforeEach(() => {
    mockAuthStore.mockImplementation(() => ({
      user: initialUser,
      login: vi.fn(),
      logout: vi.fn(),
      createUser: vi.fn(),
      setLoginVisibleMode: vi.fn(),
    }));
    mockConfigurationStore.mockImplementation(() => ({
      setStoreMode: vi.fn(),
      getStoreMode: vi.fn(),
    }));
    mockTaskStore.mockImplementation(() => ({
      syncOfflineTasks: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  describe('online mode', () => {
    let baseProps: Props;

    beforeEach(() => {
      baseProps = {
        initialMode: 'online',
      };
    });

    const renderUI = (props: Partial<Props> = {}) => {
      return render(<Auth {...baseProps} {...props} />);
    };

    it('should change to sign in when clicking on create account button', () => {
      // arrange
      renderUI();

      const button = screen.getByRole('button', { name: /Create an account/i });

      expect(screen.getByRole('heading', { name: /Hello/i })).toBeTruthy();

      // act
      fireEvent.click(button);

      // assert
      expect(screen.getByRole('heading', { name: /Welcome/i })).toBeTruthy();
      expect(screen.getByRole('textbox', { name: /Name/i })).toBeTruthy();
    });

    it('should display name message when click on submit button but email is empty', () => {
      // arrange
      renderUI();

      const createAccountButton = screen.getByRole('button', { name: /Create an account/i });
      fireEvent.click(createAccountButton);

      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      // act
      fireEvent.click(submitButton);

      // assert
      expect(screen.getByText(/Name is required/i)).toBeTruthy();
    });

    it('should display email error message when click on submit button but email is empty', () => {
      // arrange
      renderUI();

      const submitButton = screen.getByRole('button', { name: /Login/i });

      // act
      fireEvent.click(submitButton);

      // assert
      expect(screen.getByText(/Email is required/i)).toBeTruthy();
    });

    it('should display email error message when click on submit button but email is invalid', () => {
      // arrange
      renderUI();

      const emailInput = screen.getByRole('textbox', { name: /Email/i });
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      const submitButton = screen.getByRole('button', { name: /Login/i });

      // act
      fireEvent.click(submitButton);

      // assert
      expect(screen.getByText(/Email is not valid/i)).toBeTruthy();
    });

    it('should display password length error message when it is "Sign in" mode', () => {
      // arrange
      renderUI();

      const createAccountButton = screen.getByRole('button', { name: /Create an account/i });
      fireEvent.click(createAccountButton);

      const passwordInput = screen.getByLabelText('Password');
      fireEvent.change(passwordInput, { target: { value: '1111' } });

      const submitButton = screen.getByRole('button', { name: /Create Account/i });

      // act
      fireEvent.click(submitButton);

      // assert
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeTruthy();
    });

    it('should not password length error message when it is "Login" mode', () => {
      // arrange
      renderUI();

      const passwordInput = screen.getByLabelText('Password');
      fireEvent.change(passwordInput, { target: { value: '1111' } });

      const submitButton = screen.getByRole('button', { name: /Login/i });

      // act
      fireEvent.click(submitButton);

      // assert
      expect(screen.queryByText(/Password must be at least 8 characters/i)).toBeNull();
    });

    it('should display password error message when click on submit button but password is empty', () => {
      // arrange
      renderUI();

      const submitButton = screen.getByRole('button', { name: /Login/i });

      // act
      fireEvent.click(submitButton);

      // assert
      expect(screen.getByText(/Password is required/i)).toBeTruthy();
    });

    it('should reset the form when clicking on create account button', () => {
      // arrange
      renderUI();

      const createAcountButton = screen.getByRole('button', { name: /Create an account/i });
      fireEvent.click(createAcountButton);

      const button = screen.getByRole('button', { name: /Create Account/i });
      fireEvent.click(button);

      expect(Array.from(screen.getByLabelText('Name').classList).find(f => f.includes('danger'))).toBeTruthy();
      expect(Array.from(screen.getByLabelText('Email').classList).find(f => f.includes('danger'))).toBeTruthy();
      expect(Array.from(screen.getByLabelText('Password').classList).find(f => f.includes('danger'))).toBeTruthy();

      expect(screen.getByText(/Name is required/i)).toBeTruthy();
      expect(screen.getByText(/Email is required/i)).toBeTruthy();
      expect(screen.getByText(/Password is required/i)).toBeTruthy();

      // click twice, in order to go back to Sign in mode
      fireEvent.click(createAcountButton);
      fireEvent.click(createAcountButton);

      expect(Array.from(screen.getByLabelText('Name').classList).find(f => f.includes('danger'))).toBeFalsy();
      expect(Array.from(screen.getByLabelText('Email').classList).find(f => f.includes('danger'))).toBeFalsy();
      expect(Array.from(screen.getByLabelText('Password').classList).find(f => f.includes('danger'))).toBeFalsy();

      expect(screen.queryByText(/Name is required/i)).toBeNull();
      expect(screen.queryByText(/Email is required/i)).toBeNull();
      expect(screen.queryByText(/Password is required/i)).toBeNull();

      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@doe.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: '1234' } });

      // act
      fireEvent.click(createAcountButton);

      // assert
      expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('');
      expect((screen.getByLabelText('Password') as HTMLInputElement).value).toBe('');

      // click on the create account button again, in order make name visible
      fireEvent.click(createAcountButton);
      expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('');
    });

    it('should call login when clicking on the submit button', () => {
      // arrange
      const mockLogin = vi.fn();
      mockAuthStore.mockImplementation(() => ({
        user: initialUser,
        login: mockLogin,
        createUser: vi.fn(),
        setLoginVisibleMode: vi.fn(),
      }));

      const mockSetStoreMode = vi.fn();
      mockConfigurationStore.mockImplementation(() => ({
        setStoreMode: mockSetStoreMode,
        getStoreMode: () => 'online',
      }));

      const mockSyncOfflineTasks = vi.fn();
      mockTaskStore.mockImplementation(() => ({
        syncOfflineTasks: mockSyncOfflineTasks,
      }));

      renderUI();

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@doe.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: '12345678' } });

      // act
      fireEvent.click(screen.getByRole('button', { name: /Login/i }));

      // assert
      expect(mockLogin).toHaveBeenCalledWith({ email: 'john@doe.com', password: '12345678' });
      waitFor(() => expect(mockSetStoreMode).toHaveBeenCalledWith('online'));
      expect(mockSyncOfflineTasks).not.toHaveBeenCalled();
    });

    it('should call register when clicking on the submit button', () => {
      // arrange
      const mockRegister = vi.fn();

      mockAuthStore.mockImplementation(() => ({
        user: initialUser,
        login: vi.fn(),
        createUser: mockRegister,
        setLoginVisibleMode: vi.fn(),
      }));

      const mockSetStoreMode = vi.fn();
      mockConfigurationStore.mockImplementation(() => ({
        setStoreMode: mockSetStoreMode,
        getStoreMode: () => 'online',
      }));

      const mockSyncOfflineTasks = vi.fn();
      mockTaskStore.mockImplementation(() => ({
        syncOfflineTasks: mockSyncOfflineTasks,
      }));

      renderUI();

      const createAccountButton = screen.getByRole('button', { name: /Create an account/i} );
      fireEvent.click(createAccountButton);

      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@doe.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: '12345678' } });

      // act
      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

      // assert
      expect(mockRegister).toHaveBeenCalledWith({ name: 'John Doe', email: 'john@doe.com', password: '12345678' });
      waitFor(() => expect(mockSetStoreMode).toHaveBeenCalledWith('online'));
      expect(mockSyncOfflineTasks).not.toHaveBeenCalled();
    });

    it('should call to logout when clicking on "offline" button', () => {
      // arrange
      mockAuthStore.mockImplementation(() => ({
        user: initialUser,
        login: vi.fn(),
        createUser: vi.fn(),
        setLoginVisibleMode: vi.fn(),
      }));

      const mockSetStoreMode = vi.fn();
      mockConfigurationStore.mockImplementation(() => ({
        setStoreMode: mockSetStoreMode,
        getStoreMode: () => 'online',
      }));

      renderUI();

      fireEvent.click(screen.getByRole('button', { name: /offline/i }));

      // act
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      // assert
      waitFor(() => expect(mockSetStoreMode).toHaveBeenCalledWith('offline'));
    });
  });

  describe('offline mode', () => {
    let baseProps: Props;

    beforeEach(() => {
      baseProps = {
        initialMode: 'offline',
      };
    });

    it('should call syncOfflineTasks when stored mode is "offline" and clicking on the submit button', () => {
      // arrange
      const mockSyncOfflineTasks = vi.fn();
      mockTaskStore.mockImplementation(() => ({
        syncOfflineTasks: mockSyncOfflineTasks
      }));

      mockConfigurationStore.mockImplementation(() => ({
        setStoreMode: vi.fn(),
        getStoreMode: () => 'offline',
      }));

      renderUI();

      fireEvent.click(screen.getByRole('button', { name: /online/i }));

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@doe.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: '12345678' } });

      // act
      fireEvent.click(screen.getByRole('button', { name: /Login/i }));

      // assert
      waitFor(() => expect(mockSyncOfflineTasks).toHaveBeenCalled());
    });

    const renderUI = (props: Partial<Props> = {}) => {
      return render(<Auth {...baseProps} {...props} />);
    };

    it('should call setStoreMode when clicking on the submit button', () => {
      // arrange
      const mockSetStoreMode = vi.fn();
      mockConfigurationStore.mockImplementation(() => ({
        setStoreMode: mockSetStoreMode,
        getStoreMode: () => 'offline',
      }));

      renderUI();

      // act
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      // assert
      expect(mockSetStoreMode).toHaveBeenCalledWith('offline');
    });
  });
});