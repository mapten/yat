import React from 'react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, cleanup, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
  });

  it('should trigger onAddTask when the input changes and saves it', async () => {
    // arrange
    renderUI();

    const input = screen.getByRole('textbox') as HTMLInputElement;

    // act
    userEvent.type(input, 'foo{enter}');

    // assert
    await waitFor(() => expect(baseProps.onAddTask).toHaveBeenCalledWith(expect.objectContaining({ displayName: 'foo' })));
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