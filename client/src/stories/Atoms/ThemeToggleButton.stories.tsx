import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';

// Components
import ThemeToggleButton from '../../components/presentational/ThemeToggleButton/ThemeToggleButton';

export default {
  title: 'Atoms/Theme Toggle Button',
  component: ThemeToggleButton,
  decorators: [
    ThemeDecorator
  ]
};

const Template = () => <ThemeToggleButton />;

export const ThemeToggleButtonDefault = Template.bind({});