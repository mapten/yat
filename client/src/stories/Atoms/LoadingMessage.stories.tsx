import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';

// Components
import LoadingMessage from '../../components/presentational/UI/LoadingMessage/LoadingMessage';

export default {
  title: 'Atoms/Loading Message',
  component: LoadingMessage,
  decorators: [ThemeDecorator]
} as Meta;

type Props = React.ComponentProps<typeof LoadingMessage>;

const Template: Story<Props> = (args) => <LoadingMessage {...args} />;
export const LoadingMessageDefault = Template.bind({});
LoadingMessageDefault.args = {
  message: 'Loading...'
};