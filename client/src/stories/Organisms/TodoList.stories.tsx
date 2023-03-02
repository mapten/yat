import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { MemoryRouter } from 'react-router-dom';

// Components
import { TodoList } from '../../components/containers/TodoList/TodoList';

export default {
  title: 'Organisms/TodoList',
  component: TodoList,
  decorators: [
    (Story, context) => (
      <MemoryRouter initialEntries={['/', '/create']}>
        <Story {...context} />
      </MemoryRouter>
    )
  ]
} as Meta;

type Props = React.ComponentProps<typeof TodoList>;

const Template: Story<Props> = (args) => <TodoList {...args} />;

export const TodoListDefault = Template.bind({});
TodoListDefault.args = {
  taskList: [
    { id: '1', displayName: 'Paint the wall', priority: 3, done: false },
    { id: '2', displayName: 'Create a todoList demo application', priority: 0, done: true },
    { id: '3', displayName: 'Learn Kubernetes', priority: 2, done: false },
    { id: '4', displayName: 'Buy an ukelele', priority: 0, done: true },
    { id: '5', displayName: 'Learn to play ukelele', priority: 1, done: false },
    { id: '6', displayName: 'Sell ukelele', priority: 1, done: true },
  ],
};