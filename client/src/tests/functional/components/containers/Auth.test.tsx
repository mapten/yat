import { describe, it, vi, afterEach, expect, MockedFunction, beforeEach } from 'vitest';
import { render, cleanup, screen, fireEvent, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Models
import { User } from '../../../../models/user.model';

// Store
import { useAuthStore } from '../../../../store/auth.store';

// Components
import TodoList from '../../../../components/containers/Auth/Auth';

vi.mock('../../../../store/auth.store', () => ({
  useAuthStore: vi.fn(),
}));
const mockAuthStore = useAuthStore as unknown as MockedFunction<typeof useAuthStore>;

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
      createUser: vi.fn(),
    }));
  });

  const renderUI = () => {
    return render(<TodoList />);
  };

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should change to sign in when clicking on the link', () => {
    // arrange
    renderUI();

    const link = screen.getByRole('link', { name: /Create an account/i });

    expect(screen.getByRole('heading', { name: /Hello/i })).toBeTruthy();

    // act
    fireEvent.click(link);

    // assert
    expect(screen.getByRole('heading', { name: /Welcome/i })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /Name/i })).toBeTruthy();
  });

  it('should display name message when click on submit button but email is empty', () => {
    // arrange
    renderUI();

    const link = screen.getByRole('link', { name: /Create an account/i });
    fireEvent.click(link);

    const submitButton = screen.getByRole('button');

    // act
    fireEvent.click(submitButton);

    // assert
    expect(screen.getByText(/Name is required/i)).toBeTruthy();
  });

  it('should display email error message when click on submit button but email is empty', () => {
    // arrange
    renderUI();

    const submitButton = screen.getByRole('button');

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

    const submitButton = screen.getByRole('button');

    // act
    fireEvent.click(submitButton);

    // assert
    expect(screen.getByText(/Email is not valid/i)).toBeTruthy();
  });

  it('should display password length error message when it is "Sign in" mode', () => {
    // arrange
    renderUI();

    const link = screen.getByRole('link', { name: /Create an account/i });
    fireEvent.click(link);

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: '1111' } });

    const submitButton = screen.getByRole('button');

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

    const submitButton = screen.getByRole('button');

    // act
    fireEvent.click(submitButton);

    // assert
    expect(screen.queryByText(/Password must be at least 8 characters/i)).toBeNull();
  });

  it('should display password error message when click on submit button but password is empty', () => {
    // arrange
    renderUI();

    const submitButton = screen.getByRole('button');

    // act
    fireEvent.click(submitButton);

    // assert
    expect(screen.getByText(/Password is required/i)).toBeTruthy();
  });

  it('should reset the form when clicking on the link', () => {
    // arrange
    renderUI();

    const link = screen.getByRole('link');
    fireEvent.click(link);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(Array.from(screen.getByLabelText('Name').classList).find(f => f.includes('danger'))).toBeTruthy();
    expect(Array.from(screen.getByLabelText('Email').classList).find(f => f.includes('danger'))).toBeTruthy();
    expect(Array.from(screen.getByLabelText('Password').classList).find(f => f.includes('danger'))).toBeTruthy();

    expect(screen.getByText(/Name is required/i)).toBeTruthy();
    expect(screen.getByText(/Email is required/i)).toBeTruthy();
    expect(screen.getByText(/Password is required/i)).toBeTruthy();

    // click twice, in order to go back to Sign in mode
    fireEvent.click(link);
    fireEvent.click(link);

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
    fireEvent.click(link);

    // assert
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Password') as HTMLInputElement).value).toBe('');

    // click on the link again, in order make name visible
    fireEvent.click(link);
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('');
  });

  it('should call login when clicking on the submit button', () => {
    // arrange
    const mockLogin = vi.fn();

    mockAuthStore.mockImplementation(() => ({
      user: initialUser,
      login: mockLogin,
      createUser: vi.fn(),
    }));

    renderUI();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@doe.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '12345678' } });

    // act
    fireEvent.click(screen.getByRole('button'));

    // assert
    expect(mockLogin).toHaveBeenCalledWith({ email: 'john@doe.com', password: '12345678' });
  });

  it('should call register when clicking on the submit button', () => {
    // arrange
    const mockRegister = vi.fn();

    mockAuthStore.mockImplementation(() => ({
      user: initialUser,
      login: vi.fn(),
      createUser: mockRegister,
    }));

    renderUI();

    const link = screen.getByRole('link');
    fireEvent.click(link);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@doe.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '12345678' } });

    // act
    fireEvent.click(screen.getByRole('button'));

    // assert
    expect(mockRegister).toHaveBeenCalledWith({ name: 'John Doe', email: 'john@doe.com', password: '12345678' });
  });
});