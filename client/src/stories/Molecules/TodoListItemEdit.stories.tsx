import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';

import { TodoListItemEdit } from '../../components/presentational/TodoList/TodoListItem/TodoListItemEdit/TodoListItemEdit';

export default {
  title: 'Molecules/Todo list item edit',
  component: TodoListItemEdit,
  decorators: [ ThemeDecorator ]
} as Meta;

type Props = React.ComponentProps<typeof TodoListItemEdit>;

const Template: Story<Props> = (args) => <TodoListItemEdit {...args} />;

export const TodoListItemEditWithFilledValues = Template.bind({});
TodoListItemEditWithFilledValues.args = {
  taskId: '1',
  initialTaskName: 'Paint the wall',
  initialTaskPriority: 1,
  taskDone: false
};

export const TodoListItemEditEmpty = Template.bind({});
TodoListItemEditEmpty.args = {
  placeholder: 'Enter a task name',
  taskDone: false
};