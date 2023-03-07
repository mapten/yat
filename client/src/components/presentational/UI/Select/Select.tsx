import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Icon } from '@iconify/react';

// Styles
import styles from './Select.module.scss';

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

type Props<T, I> = StateProps<T, I> & DispatchProps<T, I> & Pick<React.HTMLAttributes<HTMLSelectElement>, 'className' | 'id'>;

const Select = <T,I extends Index>({ items, initialItem, keyExtractor, textExtractor, onSelect, renderItem, ...otherProps }: Props<T, I>) => {
  const selectRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [item, setItem] = useState<I>(initialItem);

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

  const clickOutsideHandler = (e: MouseEvent) => {
    if (selectRef.current && !(selectRef.current as any).contains(e.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    setItem(initialItem);
  }, [initialItem]);

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler, true);
    document.addEventListener('click', clickOutsideHandler, true);
    return () => {
      document.removeEventListener('keydown', keydownHandler, true);
      document.removeEventListener('click', clickOutsideHandler, true);
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

  return (
    <div ref={selectRef} id={otherProps.id} role="combobox" className={`${otherProps.className} ${styles.select}`}>
      <div title={getSelectedTitle()} data-testid="select__selected" onClick={toggleMenuHandler} className={`select__selected ${styles.select__selected}`}>
        {renderSelectedItem()}
        <Icon icon='material-symbols:keyboard-arrow-down-rounded' rotate={menuOpen ? 2 : 0} />
      </div>
      {
        items && items.length > 0 && menuOpen && (
          <div data-testid="select__options" className={`inputWrapper element ${styles.select__options}`}>
            {
              items.map((item) => (
                <div role="option" className={styles.select__option} onClick={(_) => itemChangeHandler(item)} key={keyExtractor(item)}>
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