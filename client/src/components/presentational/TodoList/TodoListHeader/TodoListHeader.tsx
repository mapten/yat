import { Button } from '../../UI/Button/Button';
import { useNavigate } from 'react-router-dom';

// Styles
import styles from './TodoListHeader.module.scss';

export const TodoListHeader: React.FC = () => {
  const navigate = useNavigate();

  function clickHandler() {
    navigate('/create');
  }

  return (
    <header className={styles.todoList__Header}>
      <h1>Task list</h1>
      <Button
        tooltip='Create new task'
        displayText='New'
        buttonStyle='add'
        iconName='material-symbols:add'
        size='big'
        onClick={clickHandler} />
    </header>
  );
};