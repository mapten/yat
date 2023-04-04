import { useState, useEffect, useRef, useId } from 'react';
import { Icon } from '@iconify/react';

// Styles
import styles from './Select.module.scss';

// Hooks
import { useOutsideClick } from '../../../../hooks/useOutsideClick';
import { useEscape } from '../../../../hooks/useEscape';

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

type Index = React.Key | null | undefined;

type Props<Item, Key> = StateProps<Item, Key> & DispatchProps<Item, Key> & Pick<React.HTMLAttributes<HTMLSelectElement>, 'className' | 'id' | 'aria-labelledby'>;

const Select = <Item, Key extends Index>({ items, initialItem, keyExtractor, textExtractor, onSelect, renderItem, ...otherProps }: Props<Item, Key>) => {
  const optionsId = useId();

  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Key>(initialItem);

  /**
   * Preselected item is used to highlight the item in the menu, for example when
   * hovering over an item with the mouse or using the arrow keys to navigate.
   * 
   * Then, when it is selected, with a click or enter key, the preselected item
   * is used as the selected item.
   */
  const [preselectedItem, setPreselectedItem] = useState<Key | undefined>(undefined);

  useOutsideClick(selectRef, () => setMenuOpen(false));
  useEscape(() => setMenuOpen(false));

  /**
   * Given an item from the items array, get the next item in the array.
   */
  const getNextItem = (item: Key) => {
    const currentIndex = items.findIndex((i) => keyExtractor(i) === item);
    const nextIndex = currentIndex + 1;
    return items[nextIndex] || items[0];
  };

  /**
   * Given an item from the items array, get the previous item in the array.
   */
  const getPrevItem = (item: Key) => {
    const currentIndex = items.findIndex((i) => keyExtractor(i) === item);
    const prevIndex = currentIndex - 1;
    return items[prevIndex] || items[items.length - 1];
  };

  const selectNextItem = () => {  
    selectedItemChangeHandler(getNextItem(selectedItem));
  };

  const selectPrevItem = () => {
    selectedItemChangeHandler(getPrevItem(selectedItem));
  };

  const preselectNextItem = () => {
    const nextItem = preselectedItem !== undefined ? getNextItem(preselectedItem) : items[0];
    setPreselectedItem(keyExtractor(nextItem));
  };  

  const preselectPrevItem = () => {
    const previousItem = preselectedItem !== undefined ? getPrevItem(preselectedItem) : items[0];
    setPreselectedItem(keyExtractor(previousItem));
  };

  const getSelectedItem = () => {
    return items.find((i) => keyExtractor(i) === selectedItem) as Item;
  };

  const getSelectedTitle = () => {
    return textExtractor(getSelectedItem());
  };

  const toggleMenuHandler = () => {
    setMenuOpen((open) => !open);
  };

  const selectedItemChangeHandler = (newSelectedItem: Item) => {
    setMenuOpen(false);
    const newSelectedId = keyExtractor(newSelectedItem);
    if (newSelectedId === selectedItem) {
      return;
    }
    setSelectedItem(newSelectedId);
    onSelect(newSelectedId);
  };

  const keydownDocumentHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMenuOpen(false);
    }
  };

  const keyDownSelectHandler = (e: React.KeyboardEvent) => {
    if (!items?.length) {
      return;
    }
    if (e.key === 'Escape') {
      setMenuOpen(false);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      setMenuOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      if (!menuOpen) {
        selectNextItem();
        return;
      }
      preselectNextItem();
      return;
    }
    if (e.key === 'ArrowUp') {
      if (!menuOpen) {
        selectPrevItem();
        return;
      }
      preselectPrevItem();
      return;
    }
  };

  const keyDownOptionHandler = (e: React.KeyboardEvent, item: Item) => {
    if (!items?.length) {
      return;
    }
    if (e.key === 'Escape') {
      setMenuOpen(false);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      if (preselectedItem) {
        const pi = items.find((i) => keyExtractor(i) === preselectedItem) as Item;
        selectedItemChangeHandler(pi);
        return;
      }
    }
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (keyExtractor(item) === keyExtractor(items[0])) {
          setMenuOpen(false);
          return;
        }
      }
      if (keyExtractor(item) === keyExtractor(items[items.length - 1])) {
        setMenuOpen(false);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      preselectNextItem();
      return;
    }
    if (e.key === 'ArrowUp') {
      preselectPrevItem();
      return;
    }
  };

  const renderItemHandler = (item: Item) => {
    return renderItem(item);
  };

  const renderSelectedItemHandler = () => {
    const si = items.find((i) => keyExtractor(i) === selectedItem) as Item;
    return renderItem(si);
  };

  useEffect(() => {
    document.addEventListener('keydown', keydownDocumentHandler, true);
    return () => {
      document.removeEventListener('keydown', keydownDocumentHandler, true);
    };
  });

  useEffect(() => {
    setSelectedItem(initialItem);
  }, [initialItem]);

  useEffect(() => {
    if (!menuOpen) {
      setPreselectedItem(undefined);
      return;
    }
    /** When menu opens, focus to the first element, in order
     * to allow keyboard navigation with arrow keys and then
     * select an option with Enter or Spacebar.
     */
    optionsRef.current[0]?.focus();
  }, [menuOpen]);

  return (
    <div ref={selectRef}
      id={otherProps.id}
      role="combobox"
      aria-expanded={menuOpen}
      aria-controls={optionsId}
      aria-labelledby={otherProps['aria-labelledby']}
      className={`${otherProps.className} ${styles.select}`}
    >
      <div
        role="button"
        title={getSelectedTitle()}
        data-testid="select__selected"
        tabIndex={0}
        onClick={toggleMenuHandler}
        onKeyDown={keyDownSelectHandler}
        className={`select select__selected ${styles.select__selected}`}
      >
        {renderSelectedItemHandler()}
        <Icon icon='material-symbols:keyboard-arrow-down-rounded' rotate={menuOpen ? 2 : 0} />
      </div>
      {
        items && items.length > 0 && menuOpen && (
          <div data-testid="select__options" className={`options themeBorder themeBg ${styles.select__options}`}>
            {
              items.map((item, index) => (
                <div role="option"
                  key={keyExtractor(item)}
                  ref={(ref) => optionsRef.current[index] = ref} 
                  tabIndex={0}
                  aria-selected={keyExtractor(item) === keyExtractor(getSelectedItem())}
                  className={`option ${styles.select__option} ${keyExtractor(item) === preselectedItem ? 'preselected' : ''}`}
                  onFocus={() => setPreselectedItem(keyExtractor(item))}
                  onClick={() => selectedItemChangeHandler(item)}
                  onKeyDown={(e) => keyDownOptionHandler(e, item)}
                  onMouseEnter={() => setPreselectedItem(keyExtractor(item))}
                  onMouseLeave={() => setPreselectedItem(undefined)}
                >
                  {renderItemHandler(item)}
                </div>)
              )
            }
          </div>
        )
      }
    </div>
  );
};

export default Select;