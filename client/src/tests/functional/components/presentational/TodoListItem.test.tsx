import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoListItem } from '../../../../components/presentational/TodoList/TodoListItem/TodoListItem';

type Props = React.ComponentProps<typeof TodoListItem>;

describe(`<TaskListItem/>`, () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      taskId: '1',
      taskName: 'Paint the wall',
      taskPriorityColor: 'red',
      taskDone: false,
      onTaskChangeStatus: jest.fn(),
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<TodoListItem {...baseProps} {...props} />);
  }

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
    expect(spanTaskName).toHaveClass('crossed');
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

  it(`should call to onTaskChangeStatus when the checkbox changes`, () => {
    // arrange
    const props: Partial<Props> = {taskDone: false};

    const renderResult = renderUI(props);
    const checkbox = renderResult.container.querySelector('input[type="checkbox"]') as HTMLInputElement;

    // act
    fireEvent.click(checkbox);

    // assert
    expect(baseProps.onTaskChangeStatus).toHaveBeenCalledWith('1', true);
  });
});