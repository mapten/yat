import React from 'react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, cleanup, screen, waitFor, fireEvent } from '@testing-library/react';

// Components
import TodoListCreate from '../../../../components/presentational/TodoList/TodoListCreate/TodoListCreate';

type Props = React.ComponentProps<typeof TodoListCreate>;

describe('<TodoListCreate/>', () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      onAddTask: vi.fn(),
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<TodoListCreate {...baseProps} {...props} />);
  };

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should trigger onAddTask when the input changes and saves it and should reset the form when addTask returns "success"', async () => {
    // arrange
    const mockAddTask = vi.fn().mockResolvedValue('success');
    renderUI({ onAddTask: mockAddTask });

    const input = screen.getByRole('textbox') as HTMLInputElement;

    // act
    fireEvent.change(input, { target: { value: 'foo' }});
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // assert
    await waitFor(() => expect(mockAddTask).toHaveBeenCalledWith(expect.objectContaining({ displayName: 'foo' })));

    expect(input.value).toBe('');
  });

  it('should not reset the form when addTask does not return "success"', async () => {
    // arrange
    const mockAddTask = vi.fn().mockResolvedValue('error');
    renderUI({ onAddTask: mockAddTask });

    const input = screen.getByRole('textbox') as HTMLInputElement;

    // act
    fireEvent.change(input, { target: { value: 'foo' }});
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // assert
    expect(mockAddTask).toHaveBeenCalled();
    expect(input.value).toBe('foo');
  });

  it('should reset the form when clicks on Cancel', () => {
    // arrange
    renderUI();

    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'foo' } });

    expect(input.value).toBe('foo');

    // act
    fireEvent.click(screen.getByText('Cancel'));

    const updatedInput = screen.getByRole('textbox') as HTMLInputElement;

    // assert
    expect(updatedInput.value).toBe('');
  });
});