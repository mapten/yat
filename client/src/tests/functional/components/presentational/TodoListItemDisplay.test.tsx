import React from 'react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';

// Components
import TodoListItemDisplay from '../../../../components/presentational/TodoList/TodoListItem/TodoListItemDisplay/TodoListItemDisplay';

type Props = React.ComponentProps<typeof TodoListItemDisplay>;

describe(`<TodoListItemDisplay/>`, () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      taskId: '1',
      taskName: 'Paint the wall',
      taskPriorityColor: 'red',
      initialTaskDone: false,
      onTaskChangeStatus: vi.fn(),
      onSetEdit: vi.fn(),
      onDelete: vi.fn()
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<TodoListItemDisplay {...baseProps} {...props} />);
  };

  afterEach(() => {
    cleanup();
  });

  it(`should trigger onTaskChangeStatus when the checkbox changes`, () => {
    // arrange
    const props: Partial<Props> = { initialTaskDone: false };

    renderUI(props);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

    // act
    fireEvent.click(checkbox);

    // assert
    waitFor(() => expect(baseProps.onTaskChangeStatus).toHaveBeenCalled());
  });

  it(`should trigger onSetEdit when the edit button is clicked`, () => {
    // arrange
    renderUI();
    const buttonEdit = screen.getByTitle('Edit') as HTMLButtonElement;

    expect(baseProps.onSetEdit).toHaveBeenCalledTimes(0);

    // act
    fireEvent.click(buttonEdit);

    // assert
    expect(baseProps.onSetEdit).toHaveBeenCalledTimes(1);
  });

  it(`should trigger onDelete when the edit button is clicked`, () => {
    // arrange
    renderUI();
    const buttonDelete = screen.getByTitle('Delete') as HTMLButtonElement;

    expect(baseProps.onDelete).toHaveBeenCalledTimes(0);

    // act
    fireEvent.click(buttonDelete);

    // assert
    expect(baseProps.onDelete).toHaveBeenCalledTimes(1);
  });
});