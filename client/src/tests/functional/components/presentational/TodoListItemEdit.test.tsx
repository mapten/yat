import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

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
      onCancelEdit: jest.fn(),
      onEdit: jest.fn(),
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

    const renderResult = renderUI(props);
    const buttonEdit = renderResult.container.querySelector('button:nth-child(2)') as HTMLButtonElement;

    const nameInput = renderResult.container.querySelector('input') as HTMLInputElement;
    fireEvent.change(nameInput, {target: {value: 'foo modified'}});

    const prioritySelect = renderResult.container.querySelector('select') as HTMLSelectElement;
    fireEvent.change(prioritySelect, {target: {value: 3}});

    // act
    buttonEdit.click();

    // assert
    expect(baseProps.onEdit).toHaveBeenCalledWith({
      id: '1',
      displayName: 'foo modified',
      priority: 3,
      done: false,
    });
  });

  it('should not trigger onEdit when the edit button is clicked and the name is empty', () => {
    // arrange
    const props: Partial<Props> = {taskName: ''};

    const renderResult = renderUI(props);
    const buttonEdit = renderResult.container.querySelector('button:nth-child(2)') as HTMLButtonElement;

    // act
    buttonEdit.click();

    const nameInput = renderResult.container.querySelector('input') as HTMLInputElement;

    // assert
    expect(nameInput).toHaveClass('itemEdit--danger');
    expect(baseProps.onEdit).not.toHaveBeenCalled();
  });

  it('should trigger onCancelEdit when the edit button is clicked', () => {
    // arrange
    const props: Partial<Props> = {taskDone: false};

    const renderResult = renderUI(props);
    const buttonCancelEdit = renderResult.container.querySelector('button:nth-child(1)') as HTMLButtonElement;

    // act
    buttonCancelEdit.click();

    const nameInput = renderResult.container.querySelector('input') as HTMLInputElement;

    // assert
    expect(nameInput).not.toHaveClass('danger');
    expect(baseProps.onCancelEdit).toHaveBeenCalledTimes(1);
  });
});