import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';

// Components
import Spinner from '../../components/presentational/UI/Spinner/Spinner';

export default {
  title: 'Atoms/Spinner',
  component: Spinner,
  decorators: [ ThemeDecorator ]
} as Meta;


type Props = React.ComponentProps<typeof Spinner>;
export const SmallSpinner: Story<Props> = (args) => <div style={{width: '20px', height: '20px'}}>
  <Spinner {...args} />
</div>;

export const MediumSpinner: Story<Props> = (args) => <div style={{width: '100px', height: '100px'}}>
  <Spinner {...args} />
</div>;

export const BigSpinner: Story<Props> = (args) => <div style={{width: '300px', height: '300px'}}>
  <Spinner {...args} />
</div>;