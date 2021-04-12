import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Components
import { TodoList } from '../../../../components/containers/TodoList/TodoList';

type Props = React.ComponentProps<typeof TodoList>;

describe('<TodoList/>', () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      taskList: [
        {id: '1', displayName: 'Paint the wall', priority: 3, done: false},
        {id: '2', displayName: 'Create a todoList demo application', priority: 0, done: true},
        {id: '3', displayName: 'Learn Kubernetes', priority: 2, done: false},
        {id: '4', displayName: 'Buy an ukelele', priority: 0, done: true},
        {id: '5', displayName: 'Learn to play ukelele', priority: 1, done: false},
        {id: '6', displayName: 'Sell ukelele', priority: 1, done: true},
      ],
      onFetchTasks: jest.fn(),
      onTaskChangeStatus: jest.fn(),
      onSetTaskEditId: jest.fn(),
      onEditTask: jest.fn(),
      onDeleteTask: jest.fn()
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<TodoList {...baseProps} {...props} />);
  };

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it('should sort the task, displaying first the task with more priority (lowest number), then the lowest, and at the bottom the task marked as done', async() => {
    // arrange
    // act
    const renderResult = renderUI();

    const todoItemList = await renderResult.findAllByTestId('todoItemDisplay') as HTMLDivElement[];

    // assert
    expect(todoItemList[0].querySelector('span')).toHaveTextContent('Learn to play ukelele');
    expect(todoItemList[1].querySelector('span')).toHaveTextContent('Learn Kubernetes');
    expect(todoItemList[2].querySelector('span')).toHaveTextContent('Paint the wall');
    expect(todoItemList[3].querySelector('span')).toHaveTextContent('Create a todoList demo application');
    expect(todoItemList[4].querySelector('span')).toHaveTextContent('Buy an ukelele');
    expect(todoItemList[5].querySelector('span')).toHaveTextContent('Sell ukelele');
  });

  it('should reorder the list when a task is marked as done/undone', async() => {
    // arrange
    const renderResult = renderUI();

    const todoItemList = await renderResult.findAllByTestId('todoItemDisplay') as HTMLDivElement[];

    const buyUkeleleCheckbox = todoItemList[4].querySelector('input[type="checkbox"]') as HTMLInputElement;

    // act
    buyUkeleleCheckbox.click();

    const updatedTodoItemList = await renderResult.findAllByTestId('todoItemDisplay') as HTMLDivElement[];

    // assert
    expect(updatedTodoItemList[0].querySelector('span')).toHaveTextContent('Buy an ukelele');
    expect(updatedTodoItemList[1].querySelector('span')).toHaveTextContent('Learn to play ukelele');
    expect(updatedTodoItemList[2].querySelector('span')).toHaveTextContent('Learn Kubernetes');
    expect(updatedTodoItemList[3].querySelector('span')).toHaveTextContent('Paint the wall');
    expect(updatedTodoItemList[4].querySelector('span')).toHaveTextContent('Create a todoList demo application');
    expect(updatedTodoItemList[5].querySelector('span')).toHaveTextContent('Sell ukelele');
  });

  it('should fetch the task list the first time the component is loaded', async() => {
    // arrange
    // act
    const renderResult = renderUI();

    // do some changes in the component state
    const todoItemList = await renderResult.findAllByTestId('todoItemDisplay') as HTMLDivElement[];
    const buyUkeleleCheckbox = todoItemList[4].querySelector('input[type="checkbox"]') as HTMLInputElement;
    buyUkeleleCheckbox.click();

    // assert
    expect(baseProps.onFetchTasks).toHaveBeenCalledTimes(1);
  });

  it('should render a TodoListItemEdit when editTaskId equals that task id', async() => {
    // arrange
    const props: Partial<Props> = {editTaskId: '3'};

    // act
    const renderResult = renderUI(props);

    // do some changes in the component state
    const todoItemDetailsComponents = await renderResult.findAllByTestId('todoItemDisplay') as HTMLDivElement[];
    const todoItemEditComponents = await renderResult.findAllByTestId('todoItemEdit') as HTMLDivElement[];

    // assert
    expect(todoItemDetailsComponents).toHaveLength(5);
    expect(todoItemEditComponents).toHaveLength(1);
  });

  it('should trigger onTaskChangeStatus when a task is marked as done/undone', async() => {
    // arrange
    const renderResult = renderUI();

    const todoItemList = await renderResult.findAllByTestId('todoItemDisplay') as HTMLDivElement[];

    const lastTaskCheckBox = todoItemList[5].querySelector('input[type="checkbox"]') as HTMLInputElement;

    // act
    lastTaskCheckBox.click();

    // assert
    expect(baseProps.onTaskChangeStatus).toHaveBeenCalledWith('6', false);
  });

  it('should trigger onSetTaskEditId when button edit is clicked on TodoListItemDisplay', async() => {
    // arrange
    const renderResult = renderUI();

    const todoItemList = await renderResult.findAllByTestId('todoItemDisplay') as HTMLDivElement[];

    const buttonEdit = todoItemList[3].querySelector('button:nth-child(1)') as HTMLButtonElement;

    // act
    buttonEdit.click();

    // assert
    expect(baseProps.onSetTaskEditId).toHaveBeenCalledWith('2');
  });

  it('should trigger onDelete when button delete is clicked on TodoListItemDisplay', async() => {
    // arrange
    const renderResult = renderUI();

    const todoItemList = await renderResult.findAllByTestId('todoItemDisplay') as HTMLDivElement[];

    const buttonDelete = todoItemList[3].querySelector('button:nth-child(2)') as HTMLButtonElement;

    // act
    buttonDelete.click();

    // assert
    expect(baseProps.onDeleteTask).toHaveBeenCalledWith('2');
  });

  it(`should trigger onSetTaskEditId with 'undefined' value when button cancel is clicked on TodoListItemEdit`, async() => {
    // arrange
    const props: Partial<Props> = {editTaskId: '4'};

    const renderResult = renderUI(props);

    const todoItemEdit = await renderResult.findAllByTestId('todoItemEdit') as HTMLDivElement[];

    const buttonDelete = todoItemEdit[0].querySelector('button:nth-child(1)') as HTMLButtonElement;

    // act
    buttonDelete.click();

    // assert
    expect(baseProps.onSetTaskEditId).toHaveBeenCalledWith(undefined);
  });

  it(`should trigger onEditTask when button save is clicked on TodoListItemEdit`, async() => {
    // arrange
    const props: Partial<Props> = {editTaskId: '4'};

    const renderResult = renderUI(props);

    const todoItemEdit = await renderResult.findAllByTestId('todoItemEdit') as HTMLDivElement[];

    const buttonSave = todoItemEdit[0].querySelector('button:nth-child(2)') as HTMLButtonElement;

    // act
    buttonSave.click();

    // assert
    expect(baseProps.onEditTask).toHaveBeenCalledTimes(1);
  });
});
