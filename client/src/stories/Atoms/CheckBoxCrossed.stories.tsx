import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';

// Components
import CheckBoxCrossed from '../../components/presentational/UI/CheckBoxCrossed/CheckBoxCrossed';

export default {
  title: 'Atoms/CheckBoxCrossed',
  component: CheckBoxCrossed,
  decorators: [ ThemeDecorator ]
} as Meta;

type Props = React.ComponentProps<typeof CheckBoxCrossed>;

const Template: Story<Props> = (args) => <CheckBoxCrossed {...args} />;

export const CheckBoxCrossedDefault = Template.bind({});
CheckBoxCrossedDefault.args = {
  initialChecked: false,
  text: 'Clean the house',
  color: 'red',
};