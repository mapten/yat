import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { MemoryRouter } from 'react-router-dom';

// Components
import { Create } from '../../components/containers/Create/Create';

export default {
  title: 'Organisms/Create',
  component: Create,
  decorators: [
    (Story, context) => (
      <MemoryRouter initialEntries={['/', '/create']}>
        <Story {...context} />
      </MemoryRouter>
    ),
  ]
} as Meta;

type Props = React.ComponentProps<typeof Create>;

const Template: Story<Props> = (args) => <Create {...args} />;

export const CreateDefault = Template.bind({});