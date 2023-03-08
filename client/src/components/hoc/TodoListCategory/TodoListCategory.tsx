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
    setShowList((prevState) => !prevState);
  };

  return (
    <section className={styles.todoListCategory}>
      <h2 role="button" onClick={toggleShowListHandler}>
        <Icon icon="material-symbols:keyboard-arrow-down-rounded" rotate={showList ? 4 : 3} />
        <span>{capitalizeCategory()}</span>
        <span>{displayCount ? ` (${itemCount})` : ''}</span>
      </h2>
      {
        showList && <div className={styles.todoListCategory__Items}>{children}</div>
      }
    </section>
  );
};

export default TodoListCategory;