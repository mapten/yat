import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

// Components
import Select from '../../components/presentational/UI/Select/Select';
import { Icon } from '@iconify/react';

export default {
  title: 'Atoms/Select',
  component: Select,
} as Meta;

type Item = {
  id: string;
  displayName: string;
  color?: string;
}

type Props = React.ComponentProps<typeof Select<Item, string>>;

const items = [
  { id: '1', displayName: 'Low' },
  { id: '2', displayName: 'Medium' },
  { id: '3', displayName: 'High' }
];

const Template: Story<Props> = (args) => <Select {...args} />;

export const SelectSimple = Template.bind({});
SelectSimple.args = {
  items,
  initialItem: '1',
  keyExtractor: ({id}) => id,
  textExtractor: ({displayName}) => displayName,
  renderItem: ({displayName}) => displayName
};

const complexItems = [
  { id: '1', displayName: 'Low', color: 'green'},
  { id: '2', displayName: 'Medium', color: 'yellow' },
  { id: '3', displayName: 'High', color: 'red' }
];

export const SelectComplex = Template.bind({});
SelectComplex.args = {
  items: complexItems,
  initialItem: '1',
  keyExtractor: ({id}) => id,
  textExtractor: ({displayName}) => displayName,
  renderItem: (item) => <>
    <Icon icon="map:circle" color={item.color} />
    <span>{item.displayName}</span>
  </>
};