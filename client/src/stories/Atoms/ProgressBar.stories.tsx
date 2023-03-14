import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';

// Components
import ProgressBar from '../../components/presentational/ProgressBar/ProgressBar';

// Store
import { useTaskStore } from '../../store/task.store';

export default {
  title: 'Atoms/Progress Bar',
  component: ProgressBar,
  decorators: [ ThemeDecorator ]
} as Meta;

type Props = {
  percent: number;
}

const Wrapper = ({percent}: Props) => {
  const setTasks = useTaskStore(state => state.setTasks);

  const tasks = Array.from({ length: 100 }, (_, i) => ({  id: `${i}`, displayName: `Task ${i}`, priority: 3, done: i < percent }));

  setTasks(tasks);

  return (
    <ProgressBar />
  );
};

const Template: Story<Props> = (args) => <Wrapper {...args} />;

export const ProgressBarDefault = Template.bind({});
ProgressBarDefault.args = {
  percent: 40
};
