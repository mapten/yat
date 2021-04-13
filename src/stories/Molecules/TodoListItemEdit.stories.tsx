import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { TodoListItemEdit } from '../../components/presentational/TodoList/TodoListItem/TodoListItemEdit/TodoListItemEdit';

export default {
  title: 'Molecules/Todo list item edit',
  component: TodoListItemEdit,
} as Meta;

type Props = React.ComponentProps<typeof TodoListItemEdit>;

const Template: Story<Props> = (args) => <TodoListItemEdit {...args} />;

export const TodoListItemEditDefault = Template.bind({});
TodoListItemEditDefault.args = {
  taskId: '1',
  taskName: 'Paint the wall',
  taskPriority: 1,
  taskDone: false
};