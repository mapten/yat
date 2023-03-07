import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

// Components
import TodoListCategory from '../../components/hoc/TodoListCategory';

export default {
  title: 'Molecules/Todo list category',
  component: TodoListCategory,
} as Meta;

type Props = React.ComponentProps<typeof TodoListCategory>;

const Template: Story<Props> = (args) => <TodoListCategory {...args}>
  <div>Low</div>
  <div>Medium</div>
  <div>High</div>
</TodoListCategory>;

export const TodoListCategoryDefault = Template.bind({});
TodoListCategoryDefault.args = {
  category: 'pending',
  displayCount: true,
  initialShowList: true,
  itemCount: 3
};

export const TodoListCategoryItemCountZero = Template.bind({});
TodoListCategoryItemCountZero.args = {
  category: 'pending',
  displayCount: true,
  initialShowList: true,
  itemCount: 0
};