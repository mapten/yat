import React from 'react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';

// Models
import { Priority } from '../../../../models/priority.model';

// Components
import { TodoListItemEdit } from '../../../../components/presentational/TodoList/TodoListItem/TodoListItemEdit/TodoListItemEdit';


const mockPriorityLevelsValueGetter = vi.fn();
vi.mock('../../../../constants/priorityLevels.constants', () => ({
  get PRIORITY_LEVELS() {
    return mockPriorityLevelsValueGetter();
  },
  get DEFAULT_PRIORITY() {
    return 1;
  }
}));

type Props = React.ComponentProps<typeof TodoListItemEdit>;

describe('<TodoListItemEdit/>', () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      taskId: '1',
      initialTaskName: 'Paint the wall',
      initialTaskPriority: 0,
      taskDone: false,
      onCancelEdit: vi.fn(),
      onSave: vi.fn(),
    };

    const fakePriorityLevels: Priority[] = [
      {
        order: 0,
        displayText: 'First',
        displayColor: '#000000',
        isDefaultSelected: false,
      },
      {
        order: 1,
        displayText: 'Second',
        displayColor: '#111111',
        isDefaultSelected: true,
      },
    ];

    mockPriorityLevelsValueGetter.mockReturnValue(fakePriorityLevels);
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<TodoListItemEdit {...baseProps} {...props} />);
  };

  afterEach(() => {
    cleanup();
  });

  it('should trigger onEdit when the edit button is clicked and the name is not empty', () => {
    // arrange
    const props: Partial<Props> = { taskId: '1', initialTaskName: 'foo', initialTaskPriority: 1, taskDone: false };

    renderUI(props);
    const buttonSave = screen.getByRole('button', { name: /Save/i }) as HTMLButtonElement;

    const nameInput = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.input(nameInput, { target: { value: 'foo modified' } });

    fireEvent.click(screen.getByTestId('select__selected'));

    const option = screen.getByRole('option', { name: 'First' });

    // act
    fireEvent.click(option);

    // act
    fireEvent.click(buttonSave);

    // assert
    expect(baseProps.onSave).toHaveBeenCalledWith({
      id: '1',
      displayName: 'foo modified',
      priority: 0,
      done: false,
    });
  });

  it('should not trigger onEdit when the edit button is clicked and the name is empty', () => {
    // arrange
    const props: Partial<Props> = { initialTaskName: '' };

    renderUI(props);
    const buttonEdit = screen.getByText('Save') as HTMLButtonElement;

    // act
    fireEvent.click(buttonEdit);

    // assert
    expect(baseProps.onSave).not.toHaveBeenCalled();
  });

  it('should trigger onCancelEdit when the edit button is clicked', () => {
    // arrange
    const props: Partial<Props> = { taskDone: false };

    renderUI(props);
    const buttonCancel = screen.getByText('Cancel') as HTMLButtonElement;

    // act
    buttonCancel.click();

    // assert
    expect(baseProps.onCancelEdit).toHaveBeenCalledTimes(1);
  });
});