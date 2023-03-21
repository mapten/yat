import { describe, it, vi, afterEach, expect, MockedFunction, beforeEach } from 'vitest';
import { render, cleanup, screen, fireEvent, within, waitFor } from '@testing-library/react';

// Models
import { Task } from '../../../../models/task.model';

// Store
import { useTaskStore } from '../../../../store/task.store';

// Components
import TodoList from '../../../../components/containers/TodoList/TodoList';
import userEvent from '@testing-library/user-event';

vi.mock('../../../../store/task.store', () => ({
  useTaskStore: vi.fn(),
  getPercentageCompletedTasks: vi.fn(),
}));
const mockTaskStore = useTaskStore as unknown as MockedFunction<typeof useTaskStore>;

describe('<TodoList />', () => {
  const initialTaskList: Task[] = [
    { id: '1', displayName: 'Paint the wall', priority: 3, done: false },
    { id: '2', displayName: 'Create a todoList demo application', priority: 0, done: true },
    { id: '3', displayName: 'Learn Kubernetes', priority: 2, done: false },
    { id: '4', displayName: 'Buy an ukelele', priority: 0, done: true },
    { id: '5', displayName: 'Learn to play ukelele', priority: 1, done: false },
    { id: '6', displayName: 'Sell ukelele', priority: 1, done: true },
  ];

  const mockChangeTaskStatus = vi.fn();
  const mockAddTask = vi.fn();
  const mockDeleteTask = vi.fn();
  const mockUpdateTask = vi.fn();
  const mockFetchTasks = vi.fn();

  beforeEach(() => {
    mockTaskStore.mockImplementation(() => ({
      getPendingTasks: () => initialTaskList.filter((task) => !task.done).sort((a, b) => a.priority - b.priority),
      getCompletedTasks: () => initialTaskList.filter((task) => task.done).sort((a, b) => a.priority - b.priority),
      addTask: mockAddTask,
      fetchTasks: mockFetchTasks,
      changeTaskStatus: mockChangeTaskStatus,
      deleteTask: mockDeleteTask,
      updateTask: mockUpdateTask,
    }));
  });

  const renderUI = () => {
    return render(<TodoList />);
  };

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should display pending tasks sorted by priority', () => {
    // arrange, act
    renderUI();

    const pendingSection = within(screen.getByText(/Pending/i).closest('section') as HTMLDivElement);

    const todoItemList = pendingSection.getAllByTestId('todoItemDisplay') as HTMLDivElement[];

    // assert
    expect(todoItemList[0].textContent).toContain('Learn to play ukelele');
    expect(todoItemList[1].textContent).toContain('Learn Kubernetes');
    expect(todoItemList[2].textContent).toContain('Paint the wall');
  });

  it('should display completed tasks sorted by priority', () => {
    // arrange
    renderUI();

    const completedSection = within(screen.getByText(/Completed/i).closest('section') as HTMLDivElement);

    const header = completedSection.getByText(/Completed/i) as HTMLHeadingElement;

    // act
    fireEvent.click(header);

    const todoItemList = completedSection.getAllByTestId('todoItemDisplay') as HTMLDivElement[];

    // assert
    expect(todoItemList[0].textContent).toContain('Create a todoList demo application');
    expect(todoItemList[1].textContent).toContain('Buy an ukelele');
    expect(todoItemList[2].textContent).toContain('Sell ukelele');
  });

  it('should fetch the task list the first time the component is loaded', async () => {
    // arrange, act
    renderUI();

    // assert
    expect(mockFetchTasks).toHaveBeenCalledTimes(1);
  });

  it('should trigger changeTaskStatus when a task is marked as done/undone', () => {
    // arrange
    renderUI();

    const todoItemDetailsComponents = screen.getAllByTestId('todoItemDisplay') as HTMLDivElement[];

    const checkBox = within(todoItemDetailsComponents[0]).getByRole('checkbox') as HTMLInputElement;

    // act
    fireEvent.click(checkBox);

    // assert
    expect(mockChangeTaskStatus).toHaveBeenCalledWith('5', true);
  });

  it('should trigger deleteTask when button delete is clicked on TodoListItemDisplay', () => {
    // arrange
    renderUI();

    const todoItemDetailsComponents = screen.getAllByTestId('todoItemDisplay') as HTMLDivElement[];

    const buttonDelete = within(todoItemDetailsComponents[0]).getByTitle('Delete') as HTMLButtonElement;

    // act
    buttonDelete.click();

    // assert
    expect(mockDeleteTask).toHaveBeenCalledWith('5');
  });

  it('should trigger addTask when a task is created', () => {
    // arrange
    renderUI();

    const editSection = screen.getByText(/Create/i).closest('section') as HTMLDivElement;

    const input = within(editSection).getByRole('textbox') as HTMLInputElement;

    // act
    userEvent.type(input, 'New task name{enter}');

    // assert
    waitFor(() => expect(mockAddTask).toHaveBeenCalledWith(expect.objectContaining({ displayName: 'New task name' })));
  });

  it('should trigger updateTask when button Save is clicked on TodoListItemEdit', async () => {
    // arrange 
    renderUI();

    const pendingSection = within(screen.getByText(/Pending/i).closest('section') as HTMLDivElement);

    const todoItemDetailsComponents = await pendingSection.findAllByTestId('todoItemDisplay') as HTMLDivElement[];

    const buttonEdit = within(todoItemDetailsComponents[0]).getByTitle('Edit') as HTMLButtonElement;

    fireEvent.click(buttonEdit);

    const todoItemEditComponents = await pendingSection.findAllByTestId('todoItemEdit') as HTMLDivElement[];

    const input = within(todoItemEditComponents[0]).getByRole('textbox') as HTMLInputElement;

    // act
    userEvent.clear(input);
    userEvent.type(input, 'New task name{enter}');

    // assert
    waitFor(() => expect(mockUpdateTask).toHaveBeenCalledWith(expect.objectContaining({ id: '5' })));
  });
});
