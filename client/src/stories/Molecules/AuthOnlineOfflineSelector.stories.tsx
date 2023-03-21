import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';

// Components
import AuthOnlineOfflineSelector from '../../components/containers/Auth/AuthOnlineOfflineSelector/AuthOnlineOfflineSelector';

export default {
  title: 'Molecules/Auth Online Offline Selector',
  component: AuthOnlineOfflineSelector,
  decorators: [ ThemeDecorator ]
} as Meta;

type Props = React.ComponentProps<typeof AuthOnlineOfflineSelector>;

const Template: Story<Props> = (args) => <AuthOnlineOfflineSelector {...args} />;

export const AuthOnlineOfflineSelectorDefault = Template.bind({});
AuthOnlineOfflineSelectorDefault.args = {
  selectedMode: 'online'
};