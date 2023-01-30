import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Button } from '../../components/presentational/UI/Button/Button';

export default {
  title: 'Atoms/Button',
  component: Button,
} as Meta;

type Props = React.ComponentProps<typeof Button>;

const Template: Story<Props> = (args) => <Button {...args} />;

export const ButtonDefault = Template.bind({});
ButtonDefault.args = {
  displayText: 'Some text',
  buttonStyle: 'add',
  iconName: 'save',
};