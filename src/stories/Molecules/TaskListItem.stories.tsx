import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { TodoListItem } from '../../components/presentational/TodoList/TodoListItem/TodoListItem';

export default {
  title: 'Molecules/Todo list item',
  component: TodoListItem,
} as Meta;

type Props = React.ComponentProps<typeof TodoListItem>;

const Template: Story<Props> = (args) => <TodoListItem {...args} />;

export const TodoListItemDefault = Template.bind({});
TodoListItemDefault.args = {
  taskId: '1',
  taskName: 'Paint the wall',
  taskPriorityColor: 'red',
  taskDone: false,
};