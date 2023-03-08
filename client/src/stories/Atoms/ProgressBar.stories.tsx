import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';
import ProgressBar from '../../components/presentational/ProgressBar/ProgressBar';

// Components


export default {
  title: 'Atoms/Progress Bar',
  component: ProgressBar,
  decorators: [ ThemeDecorator ]
} as Meta;

type Props = React.ComponentProps<typeof ProgressBar>;

const Template: Story<Props> = (args) => <ProgressBar {...args} />;

export const ProgressBarDefault = Template.bind({});
ProgressBarDefault.args = {
  progress: 50,
};