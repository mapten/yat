type StateProps<Item, Key> = {
  items: Item[];
  initialItem: Key;
}

type DispatchProps<Item, Key> = {
  keyExtractor: (item: Item) => Key;
  textExtractor: (item: Item) => string;
  renderItem: (item: Item, ref?: React.RefObject<HTMLElement>) => React.ReactNode;
  onSelect: (item: Key) => void;
}

export type SelectIndex = React.Key | null | undefined;

export type SelectProps<Item, Key> = StateProps<Item, Key> & DispatchProps<Item, Key> & Pick<React.HTMLAttributes<HTMLSelectElement>, 'className' | 'id' | 'aria-labelledby'>;
