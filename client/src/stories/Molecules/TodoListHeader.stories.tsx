import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { TodoListHeader } from '../../components/presentational/TodoList/TodoListHeader/TodoListHeader';

export default {
  title: 'Molecules/Todo list header',
  component: TodoListHeader,
} as Meta;

type Props = React.ComponentProps<typeof TodoListHeader>;

const Template: Story<Props> = (args) => <TodoListHeader {...args} />;

export const TodoListHeaderDefault = Template.bind({});
TodoListHeaderDefault.args = {
};