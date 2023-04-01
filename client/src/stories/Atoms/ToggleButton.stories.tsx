import { Meta, Story } from '@storybook/react/types-6-0';

// Themes
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';

// Components
import ToggleButton from '../../components/presentational/UI/ToggleButton/ToggleButton';

export default {
  title: 'Atoms/Toggle Button',
  component: ToggleButton,
  decorators: [ ThemeDecorator ]
} as Meta;

type Props = React.ComponentProps<typeof ToggleButton>;

const Template: Story<Props> = (args: Props) => <ToggleButton {...args} />;

export const ToggleButtonDefault = Template.bind({});
ToggleButtonDefault.args = {
  initialValue: 'left',
  leftName: 'Sun',
  leftIconName: 'ph:sun-duotone',
  rightName: 'Rain',
  rightIconName: 'iconoir:heavy-rain'
};
