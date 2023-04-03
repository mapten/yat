import { useState, useEffect, useRef, useId } from 'react';
import { Icon } from '@iconify/react';

// Styles
import styles from './Select.module.scss';

// Hooks
import { useOutsideClick } from '../../../../hooks/useOutsideClick';

type StateProps<T, I> = {
  items: T[];
  initialItem: I;
}

type DispatchProps<T, I> = {
  keyExtractor: (item: T) => I;
  textExtractor: (item: T) => string;
  renderItem: (item: T, ref?: React.RefObject<HTMLElement>) => React.ReactNode;
  onSelect: (item: I) => void;
}

type Index = React.Key | null | undefined;

type Props<T, I> = StateProps<T, I> & DispatchProps<T, I> & Pick<React.HTMLAttributes<HTMLSelectElement>, 'className' | 'id' | 'aria-labelledby'>;

const Select = <T,I extends Index>({ items, initialItem, keyExtractor, textExtractor, onSelect, renderItem, ...otherProps }: Props<T, I>) => {
  const optionsId = useId();

  const selectRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [item, setItem] = useState<I>(initialItem);
  const [preselectedItem, setPreselectedItem] = useState<I | undefined>(undefined);

  useOutsideClick(selectRef, () => setMenuOpen(false));

  const selectNextItem = () => {
    const currentIndex = items.findIndex((i) => keyExtractor(i) === item);
    const nextIndex = currentIndex + 1;
    const nextItem = items[nextIndex] || items[0];
    itemChangeHandler(nextItem);
  };

  const selectPrevItem = () => {
    const currentIndex = items.findIndex((i) => keyExtractor(i) === item);
    const prevIndex = currentIndex - 1;
    const prevItem = items[prevIndex] || items[items.length - 1];
    itemChangeHandler(prevItem);
  };

  const preselectNextItem = () => {
    const currentIndex = items.findIndex((i) => keyExtractor(i) === preselectedItem);
    const nextIndex = currentIndex + 1;
    const nextItem = items[nextIndex] || items[0];
    setPreselectedItem(keyExtractor(nextItem));
  };

  const preselectPrevItem = () => {
    const currentIndex = items.findIndex((i) => keyExtractor(i) === preselectedItem);
    const prevIndex = currentIndex - 1;
    const prevItem = items[prevIndex] || items[items.length - 1];
    setPreselectedItem(keyExtractor(prevItem));
  };

  const toggleMenuHandler = () => {
    setMenuOpen((open) => !open);
  };

  const itemChangeHandler = (newSelectedItem: T) => {
    setMenuOpen(false);
    const newSelectedId = keyExtractor(newSelectedItem);
    if (newSelectedId === item) {
      return;
    }
    setItem(newSelectedId);
    onSelect(newSelectedId);
  };

  const keydownDocumentHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    setItem(initialItem);
  }, [initialItem]);

  useEffect(() => {
    document.addEventListener('keydown', keydownDocumentHandler, true);
    return () => {
      document.removeEventListener('keydown', keydownDocumentHandler, true);
    };
  });

  const getSelectedItem = () => {
    return items.find((i) => keyExtractor(i) === item) as T;
  };

  const getSelectedTitle = () => {
    return textExtractor(getSelectedItem());
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

  const keyDownOptionHandler = (e: React.KeyboardEvent, item: T) => {
    if (!items?.length) {
      return;
    }
    if (e.key === 'Escape') {
      setMenuOpen(false);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      itemChangeHandler(item);
      return;
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

  const renderItemHandler = (item: T) => {
    return renderItem(item);
  };

  const renderSelectedItemHandler = () => {
    const selectedItem = items.find((i) => keyExtractor(i) === item) as T;
    return renderItem(selectedItem);
  };

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
          <div data-testid="select__options" className={`options themeBg themeBorder ${styles.select__options}`}>
            {
              items.map((item) => (
                <div role="option"
                  key={keyExtractor(item)}
                  tabIndex={0}
                  aria-selected={keyExtractor(item) === keyExtractor(getSelectedItem())}
                  className={`option ${styles.select__option} ${keyExtractor(item) === preselectedItem ? 'preselected' : ''}`}
                  onFocus={(_) => setPreselectedItem(keyExtractor(item))}
                  onClick={(_) => itemChangeHandler(item)}
                  onKeyDown={(e) => keyDownOptionHandler(e, item)}
                  onMouseEnter={(_) => setPreselectedItem(keyExtractor(item))}
                  onMouseLeave={(_) => setPreselectedItem(undefined)}
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