import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';

// Components
import TodoListCreate from '../../components/presentational/TodoList/TodoListCreate/TodoListCreate';

export default {
  title: 'Molecules/Todo list create',
  component: TodoListCreate,
  decorators: [ ThemeDecorator ]
} as Meta;

type Props = React.ComponentProps<typeof TodoListCreate>;

const Template: Story<Props> = (args) => <TodoListCreate {...args} />;

export const TodoListCreateDefault = Template.bind({});