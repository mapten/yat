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

  useOutsideClick(selectRef, () => setMenuOpen(false));

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

  const keydownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    setItem(initialItem);
  }, [initialItem]);

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler, true);
    return () => {
      document.removeEventListener('keydown', keydownHandler, true);
    };
  });

  const getSelectedItem = () => {
    return items.find((i) => keyExtractor(i) === item) as T;
  };

  const renderSelectedItem = () => {
    const selectedItem = items.find((i) => keyExtractor(i) === item) as T;
    return renderItem(selectedItem);
  };

  const getSelectedTitle = () => {
    return textExtractor(getSelectedItem());
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    const { key } = e;
    if (key === 'Escape' || key === 'Tab' || key === 'ArrowUp') {
      setMenuOpen(false);
      return;
    }
    if (key === 'ArrowDown' || key === 'Enter' || key === ' ') {
      setMenuOpen(true);
      return;
    }
  };

  return (
    <div
      ref={selectRef}
      id={otherProps.id}
      role="combobox"
      tabIndex={0}
      onClick={toggleMenuHandler}
      onKeyDown={keyDownHandler}
      aria-expanded={menuOpen}
      aria-controls={optionsId}
      className={`${otherProps.className} ${styles.select}`}
      aria-labelledby={otherProps['aria-labelledby']}
    >
      <div
        title={getSelectedTitle()}
        data-testid="select__selected"
        className={`select select__selected ${styles.select__selected}`}
      >
        {renderSelectedItem()}
        <Icon icon='material-symbols:keyboard-arrow-down-rounded' rotate={menuOpen ? 2 : 0} />
      </div>
      {
        items && items.length > 0 && menuOpen && (
          <div id={optionsId} data-testid="select__options" className={`options themeBg themeBorder ${styles.select__options}`}>
            {
              items.map((item) => (
                <div role="option"
                  tabIndex={0}
                  key={keyExtractor(item)}
                  className={`option ${styles.select__option}`}
                  aria-selected={keyExtractor(item) === keyExtractor(getSelectedItem())}
                  onClick={(_) => itemChangeHandler(item)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && itemChangeHandler(item)}
                >
                  {renderItem(item)}
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