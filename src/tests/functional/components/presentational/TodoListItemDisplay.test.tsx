import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Components
import { TodoListItemDisplay } from '../../../../components/presentational/TodoList/TodoListItem/TodoListItemDisplay/TodoListItemDisplay';

type Props = React.ComponentProps<typeof TodoListItemDisplay>;

describe(`<TodoListItemDisplay/>`, () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      taskId: '1',
      taskName: 'Paint the wall',
      taskPriorityColor: 'red',
      taskDone: false,
      onTaskChangeStatus: jest.fn(),
      onSetEdit: jest.fn(),
      onDelete: jest.fn()
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<TodoListItemDisplay {...baseProps} {...props} />);
  };

  afterEach(() => {
    cleanup();
  });

  it(`should display the crossed style on the task name when props.taskDone is true`, () => {
    // arrange
    const props: Partial<Props> = {taskDone: true};

    // act
    const renderResult = renderUI(props);
    const spanTaskName = renderResult.container.querySelector('span') as HTMLSpanElement;

    // assert
    expect(spanTaskName).toHaveClass('itemDisplay__task--crossed');
  });

  it(`should not display the crossed style on the task name when props.taskDone is false`, () => {
    // arrange
    const props: Partial<Props> = {taskDone: false};

    // act
    const renderResult = renderUI(props);
    const spanTaskName = renderResult.container.querySelector('span') as HTMLSpanElement;

    // assert
    expect(spanTaskName).not.toHaveClass('crossed');
  });

  it(`should trigger onTaskChangeStatus when the checkbox changes`, () => {
    // arrange
    const props: Partial<Props> = {taskDone: false};

    const renderResult = renderUI(props);
    const checkbox = renderResult.container.querySelector('input[type="checkbox"]') as HTMLInputElement;

    // act
    fireEvent.click(checkbox);

    // assert
    expect(baseProps.onTaskChangeStatus).toHaveBeenCalledWith('1', true);
  });

  it(`should trigger onSetEdit when the edit button is clicked`, () => {
    // arrange
    const renderResult = renderUI();
    const buttonEdit = renderResult.container.querySelector('button:nth-child(1)') as HTMLButtonElement;

    // act
    buttonEdit.click();

    // assert
    expect(baseProps.onSetEdit).toHaveBeenCalledTimes(1);
  });

  it(`should trigger onDelete when the edit button is clicked`, () => {
    // arrange
    const renderResult = renderUI();
    const buttonDelete = renderResult.container.querySelector('button:nth-child(2)') as HTMLButtonElement;

    // act
    buttonDelete.click();

    // assert
    expect(baseProps.onDelete).toHaveBeenCalledTimes(1);
  });
});