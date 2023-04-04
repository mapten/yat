import { useCallback, useEffect, useState } from 'react';
import  { Icon } from '@iconify/react';

// Styles
import styles from './TodoListCategory.module.scss';

type StateProps = {
  children: React.ReactNode;
  category: 'pending' | 'completed' | 'create task';
  initialShowList?: boolean;
}

type StateNoCounterProps = {
  itemCount?: never;
  displayCount?: false;
}

type StateCounterProps = {
  itemCount: number;
  displayCount?: true;
}

type Props = StateProps & (StateNoCounterProps | StateCounterProps);

const TodoListCategory = ({ category, displayCount = true, itemCount, initialShowList = true, children }: Props) => {
  const [showList, setShowList] = useState<boolean>(true);

  const capitalizeCategory = useCallback(() => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }, [category]);

  useEffect(() => {
    setShowList(initialShowList);
  }, [initialShowList]);

  const toggleShowListHandler = () => {
    if (itemCount === 0) return;
    setShowList((prevState) => !prevState);
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (itemCount === 0) {
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      toggleShowListHandler();
    }

    if (e.key === 'Escape' || e.key === 'Esc' || e.key === 'ArrowUp') {
      setShowList(false);
    }

    if (e.key === 'ArrowDown') {
      setShowList(true);
    }
  };

  const iconStyle = {
    transform: showList ? '' : 'rotate(-90deg)', 
    transition: 'transform 170ms ease'
  };

  return (
    <section className={styles.todoListCategory}>
      <div>
        <div className={styles.todoListCategory__Text}
          role="button"
          tabIndex={0}
          onClick={toggleShowListHandler}
          onKeyDown={keyDownHandler}
        >
          <Icon icon="material-symbols:keyboard-arrow-down-rounded" rotate={4} style={iconStyle} />
          <span>{capitalizeCategory()}</span>
          <span>{displayCount ? ` (${itemCount})` : ''}</span>
        </div>
      </div>
      {
        showList && <div className={styles.todoListCategory__Items}>{children}</div>
      }
    </section>
  );
};

export default TodoListCategory;