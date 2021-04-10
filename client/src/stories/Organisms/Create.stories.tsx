import React, { Fragment } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Create } from '../../components/containers/Create/Create';
import { ToastContainer } from 'react-toastify';

export default {
  title: 'Organisms/Create',
  component: Create,
} as Meta;

type Props = React.ComponentProps<typeof Create>;

const Template: Story<Props> = (args) =>
  <Fragment>
    <ToastContainer />
    <Create {...args} />
  </Fragment>;

export const CreateDefault = Template.bind({});