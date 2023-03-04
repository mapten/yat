import React from 'react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';

// Components
import { TodoListItemEdit } from '../../../../components/presentational/TodoList/TodoListItem/TodoListItemEdit/TodoListItemEdit';

type Props = React.ComponentProps<typeof TodoListItemEdit>;

describe('<TodoListItemEdit/>', () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      taskId: '1',
      taskName: 'Paint the wall',
      taskPriority: 0,
      taskDone: false,
      onCancelEdit: vi.fn(),
      onEdit: vi.fn(),
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<TodoListItemEdit {...baseProps} {...props} />);
  };

  afterEach(() => {
    cleanup();
  });

  it('should trigger onEdit when the edit button is clicked and the name is not empty', () => {
    // arrange
    const props: Partial<Props> = {taskId: '1', taskName: 'foo', taskPriority: 1, taskDone: false};

    const { container } = renderUI(props);
    const buttonEdit = container.querySelector('button:nth-child(2)') as HTMLButtonElement;

    const nameInput = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(nameInput, {target: {value: 'foo modified'}});

    const prioritySelect = container.querySelector('select') as HTMLSelectElement;
    fireEvent.change(prioritySelect, {target: {value: 0}});

    // act
    fireEvent.click(buttonEdit);

    // assert
    expect(baseProps.onEdit).toHaveBeenCalledWith({
      id: '1',
      displayName: 'foo modified',
      priority: 0,
      done: false,
    });
  });

  it('should not trigger onEdit when the edit button is clicked and the name is empty', () => {
    // arrange
    const props: Partial<Props> = {taskName: ''};

    renderUI(props);
    const buttonEdit = screen.getByText('Save') as HTMLButtonElement;

    // act
    fireEvent.click(buttonEdit);

    // assert
    expect(baseProps.onEdit).not.toHaveBeenCalled();
  });

  it('should trigger onCancelEdit when the edit button is clicked', () => {
    // arrange
    const props: Partial<Props> = {taskDone: false};

    const { container } = renderUI(props);
    const buttonCancelEdit = container.querySelector('button:nth-child(1)') as HTMLButtonElement;

    // act
    buttonCancelEdit.click();

    // assert
    expect(baseProps.onCancelEdit).toHaveBeenCalledTimes(1);
  });
});