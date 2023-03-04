import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './CheckBoxCrossed.module.scss';

type Props = {
  initialChecked: boolean;
  text: string;
  color: string;
  onChange: (checked: boolean) => void;
}

const CheckBoxCrossed: React.FC<Props> = ({initialChecked, text, color, onChange} : Props) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);

  const checkedHandler = () => {
    setChecked(!checked);
    onChange(!checked);
  };

  return (
    <div data-testid="checkboxCrossed" className={styles.checkboxCrossed} role="checkbox" onClick={checkedHandler}>
      <Icon color={color} icon={checked ? 'ri:checkbox-circle-fill' : 'ri:checkbox-blank-circle-fill'} />
      <span className={checked ? styles.crossed : ''}>{text}</span>
    </div>
  );
};

export default CheckBoxCrossed;