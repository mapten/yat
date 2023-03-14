import { Meta, Story } from '@storybook/react/types-6-0';
import { MemoryRouter } from 'react-router-dom';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';
import MswDecorator, { mswParameters } from '../../../.storybook/decorators/MswDecorator';

// Components
import TodoList from '../../components/containers/TodoList/TodoList';
import { Task } from '../../models/task.model';

// Store
import { useTaskStore } from '../../store/task.store';

export default {
  title: 'Organisms/TodoList',
  component: TodoList,
  decorators: [
    (Story, context) => (
      <MemoryRouter initialEntries={['/', '/create']}>
        <Story {...context} />
      </MemoryRouter>
    ),
    ThemeDecorator,
    MswDecorator
  ]
} as Meta;

const initialTaskList: Task[] = [
  { id: '1', displayName: 'Paint the wall', priority: 3, done: false },
  { id: '2', displayName: 'Create a todoList demo application', priority: 0, done: true },
  { id: '3', displayName: 'Learn Kubernetes', priority: 2, done: false },
  { id: '4', displayName: 'Buy an ukelele', priority: 0, done: true },
  { id: '5', displayName: 'Learn to play ukelele', priority: 1, done: false },
  { id: '6', displayName: 'Sell ukelele', priority: 1, done: true },
  { id: '7', displayName: 'Paint the wall again', priority: 1, done: false },
];

type Props = {
  initialTasks: Task[];
}

const Wrapper = ({initialTasks}: Props) => {
  const setTasks = useTaskStore(state => state.setTasks);

  setTasks(initialTasks);

  return (
    <TodoList />
  );
};

export const Template: Story<Props> = () => <Wrapper initialTasks={initialTaskList} />;
Template.parameters = mswParameters;