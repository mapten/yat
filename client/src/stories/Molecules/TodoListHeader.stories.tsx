import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';

import Header from '../../components/presentational/Header/Header';

export default {
  title: 'Molecules/Todo list header',
  component: Header,
  decorators: [ThemeDecorator]
} as Meta;

type Props = React.ComponentProps<typeof Header>;

const Template: Story<Props> = (args) => <Header {...args} />;

export const TodoListHeaderDefault = Template.bind({});
TodoListHeaderDefault.args = {
};