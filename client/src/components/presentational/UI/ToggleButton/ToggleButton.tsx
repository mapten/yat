import { useEffect, useState } from 'react';

// Constants
import { BUTTON_SIZE } from '../../../../constants/buttonStyles.constants';

// Components
import { Button } from '../Button/Button';

// Styles
import styles from './ToggleButton.module.scss';

type SelectedToggle = 'left' | 'right';

type StateProps = {
  leftName: string;
  leftIconName: string;
  rightName: string;
  rightIconName: string;
  size: BUTTON_SIZE;
  initialValue: SelectedToggle;
}

type DispatchProps = {
  onChange: () => void;
}

type Props = StateProps & DispatchProps;

const ToggleButton = ({ leftName, leftIconName, rightName, rightIconName, initialValue, size, onChange }: Props) => {
  const [value, setValue] = useState<SelectedToggle>('left');

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const toggleHandler = () => {
    setValue(value === 'left' ? 'right' : 'left');
    onChange();
  };

  return (
    <div className={styles.toggleButton}>
      <Button
        displayText={leftName}
        iconName={leftIconName}
        onClick={toggleHandler}
        buttonStyle={ value === 'left' ? 'default' : 'disabled'}
        size={size}
        className={styles.toggleButton__left} />
      <Button
        displayText={rightName}
        iconName={rightIconName}
        onClick={toggleHandler}
        buttonStyle={ value === 'right' ? 'default' : 'disabled'}
        size={size}
        className={styles.toggleButton__right} />
    </div>
  );
};

export default ToggleButton;