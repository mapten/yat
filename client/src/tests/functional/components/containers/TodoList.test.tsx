import React from 'react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, cleanup, screen, fireEvent, within } from '@testing-library/react';

// Components
import { TodoList } from '../../../../components/containers/TodoList/TodoList';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

type Props = React.ComponentProps<typeof TodoList>;

describe('<TodoList/>', () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      initialTaskList: [
        { id: '1', displayName: 'Paint the wall', priority: 3, done: false },
        { id: '2', displayName: 'Create a todoList demo application', priority: 0, done: true },
        { id: '3', displayName: 'Learn Kubernetes', priority: 2, done: false },
        { id: '4', displayName: 'Buy an ukelele', priority: 0, done: true },
        { id: '5', displayName: 'Learn to play ukelele', priority: 1, done: false },
        { id: '6', displayName: 'Sell ukelele', priority: 1, done: true },
      ],
      onFetchTasks: vi.fn(),
      onTaskChangeStatus: vi.fn(),
      onSetTaskEditId: vi.fn(),
      onEditTask: vi.fn(),
      onDeleteTask: vi.fn()
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<TodoList {...baseProps} {...props} />);
  };

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should sort the task, displaying first the task with more priority (lowest number), then the lowest, and at the bottom the task marked as done', async () => {
    // arrange, act
    renderUI();

    const todoItemList = await screen.findAllByTestId('todoItemDisplay') as HTMLDivElement[];

    // assert
    expect(todoItemList[0].textContent).toContain('Learn to play ukelele');
    expect(todoItemList[1].textContent).toContain('Learn Kubernetes');
    expect(todoItemList[2].textContent).toContain('Paint the wall');
    expect(todoItemList[3].textContent).toContain('Create a todoList demo application');
    expect(todoItemList[4].textContent).toContain('Buy an ukelele');
    expect(todoItemList[5].textContent).toContain('Sell ukelele');
  });

  it('should reorder the list when a task is marked as done/undone', async () => {
    // arrange
    renderUI();

    const todoItemList = await screen.findAllByTestId('todoItemDisplay') as HTMLDivElement[];

    expect(todoItemList[4].textContent).toContain('Buy an ukelele');

    const buyUkeleleCheckbox = within(todoItemList[4]).getByRole('checkbox') as HTMLInputElement;

    // act
    fireEvent.click(buyUkeleleCheckbox);

    const updatedTodoItemList = await screen.findAllByTestId('todoItemDisplay') as HTMLDivElement[];

    // assert
    expect(updatedTodoItemList[0].textContent).toContain('Buy an ukelele');
  });

  it('should fetch the task list the first time the component is loaded', async () => {
    // arrange
    // act
    renderUI();

    // do some changes in the component state
    const todoItemList = await screen.findAllByTestId('todoItemDisplay') as HTMLDivElement[];
    const buyUkeleleCheckbox = within(todoItemList[4]).getByRole('checkbox') as HTMLInputElement;
    buyUkeleleCheckbox.click();

    // assert
    expect(baseProps.onFetchTasks).toHaveBeenCalledTimes(1);
  });

  it('should render a TodoListItemEdit when editTaskId equals that task id', async () => {
    // arrange
    const props: Partial<Props> = { editTaskId: '3' };

    // act
    renderUI(props);

    // do some changes in the component state
    const todoItemDetailsComponents = await screen.findAllByTestId('todoItemDisplay') as HTMLDivElement[];
    const todoItemEditComponents = await screen.findAllByTestId('todoItemEdit') as HTMLDivElement[];

    // assert
    expect(todoItemDetailsComponents).toHaveLength(5);
    expect(todoItemEditComponents).toHaveLength(1);
  });

  it('should trigger onTaskChangeStatus when a task is marked as done/undone', async () => {
    // arrange
    renderUI();

    const todoItem = screen.getByText('Paint the wall');

    // act
    fireEvent.click(todoItem);

    // assert
    expect(baseProps.onTaskChangeStatus).toHaveBeenCalledWith('1', true);
  });

  it('should trigger onSetTaskEditId when button edit is clicked on TodoListItemDisplay', async () => {
    // arrange
    renderUI();

    const todoItemList = await screen.findAllByTestId('todoItemDisplay') as HTMLDivElement[];

    const buttonEdit = within(todoItemList[3]).getByRole('button', { name: /Edit/i }) as HTMLButtonElement;

    // act
    buttonEdit.click();

    // assert
    expect(baseProps.onSetTaskEditId).toHaveBeenCalledWith('2');
  });

  it('should trigger onDelete when button delete is clicked on TodoListItemDisplay', async () => {
    // arrange
    const renderResult = renderUI();

    const todoItemList = await renderResult.findAllByTestId('todoItemDisplay') as HTMLDivElement[];

    const buttonDelete = within(todoItemList[3]).getByRole('button', { name: /Delete/i }) as HTMLButtonElement;

    // act
    buttonDelete.click();

    // assert
    expect(baseProps.onDeleteTask).toHaveBeenCalledWith('2');
  });

  it(`should trigger onSetTaskEditId with 'undefined' value when button cancel is clicked on TodoListItemEdit`, async () => {
    // arrange
    const props: Partial<Props> = { editTaskId: '4' };

    renderUI(props);

    const todoItemEdit = await screen.findAllByTestId('todoItemEdit') as HTMLDivElement[];

    const buttonDelete = todoItemEdit[0].querySelector('button:nth-child(1)') as HTMLButtonElement;

    // act
    fireEvent.click(buttonDelete);

    // assert
    expect(baseProps.onSetTaskEditId).toHaveBeenCalledWith(undefined);
  });

  it('should trigger onEditTask when button save is clicked on TodoListItemEdit', async () => {
    // arrange
    const props: Partial<Props> = { editTaskId: '4' };

    renderUI(props);

    const todoItemEdit = await screen.findAllByTestId('todoItemEdit') as HTMLDivElement[];

    const buttonSave = within(todoItemEdit[0]).getByRole('button', { name: /Save/i }) as HTMLButtonElement;

    // act
    fireEvent.click(buttonSave);

    // assert
    expect(baseProps.onEditTask).toHaveBeenCalledWith(expect.objectContaining({ id: '4' }));
  });
});
