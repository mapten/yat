import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecoratorNoStyle from '../../../.storybook/decorators/ThemeDecoratorNoStyle';

// Components
import LoadingScreen from '../../components/presentational/UI/LoadingScreen/LoadingScreen';

export default {
  title: 'Atoms/Loading Screen',
  component: LoadingScreen,
  decorators: [ThemeDecoratorNoStyle]
} as Meta;


const Template: Story = () => <div style={{position: 'fixed', width: '100%', height: '100%'}}><LoadingScreen /></div>;
export const LoadingDefault = Template.bind({});