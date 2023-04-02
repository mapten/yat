import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';

// Components
import Button from '../../components/presentational/UI/Button/Button';

export default {
  title: 'Atoms/Button',
  component: Button,
  decorators: [ ThemeDecorator ]
} as Meta;

type Props = React.ComponentProps<typeof Button>;

const Template: Story<Props> = (args) => <Button {...args} />;

export const ButtonDefault = Template.bind({});
ButtonDefault.args = {
  displayText: 'Some text',
  buttonStyle: 'add',
  iconName: 'material-symbols:save',
};

export const ButtonIcon = Template.bind({});
ButtonIcon.args = {
  buttonStyle: 'add',
  buttonType: 'icon',
  iconName: 'material-symbols:save',
  displayText: 'Save',
};