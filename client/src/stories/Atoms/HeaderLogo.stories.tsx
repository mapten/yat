import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';

// Components
import HeaderLogo from '../../components/presentational/Header/HeaderLogo/HeaderLogo';

export default {
  title: 'Atoms/Header logo',
  component: HeaderLogo,
  decorators: [ ThemeDecorator ]
} as Meta;

type Props = React.ComponentProps<typeof HeaderLogo>;

const Template: Story<Props> = () => <HeaderLogo />;

export const ButtonDefault = Template.bind({});
