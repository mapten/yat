import React, { Fragment } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Create } from '../../components/containers/Create/Create';

export default {
  title: 'Organisms/Create',
  component: Create,
} as Meta;

type Props = React.ComponentProps<typeof Create>;

const Template: Story<Props> = (args) =>
  <Fragment>
    <Create {...args} />
  </Fragment>;

export const CreateDefault = Template.bind({});