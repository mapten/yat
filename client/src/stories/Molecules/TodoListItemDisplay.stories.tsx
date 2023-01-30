import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { TodoListItemDisplay } from '../../components/presentational/TodoList/TodoListItem/TodoListItemDisplay/TodoListItemDisplay';

export default {
  title: 'Molecules/Todo list item display',
  component: TodoListItemDisplay,
} as Meta;

type Props = React.ComponentProps<typeof TodoListItemDisplay>;

const Template: Story<Props> = (args) => <TodoListItemDisplay {...args} />;

export const TodoListItemDisplayDefault = Template.bind({});
TodoListItemDisplayDefault.args = {
  taskId: '1',
  taskName: 'Paint the wall',
  taskPriorityColor: 'red',
  taskDone: false,
};