import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './CheckBoxCrossed.module.scss';

type Props = {
  initialChecked: boolean;
  text: string;
  color?: string;
  onChange: (checked: boolean) => void;
}

const CheckBoxCrossed: React.FC<Props> = ({initialChecked, text, color, onChange} : Props) => {
  const [checked, setChecked] = useState(false);
  const [icon, setIcon] = useState('mdi:checkbox-marked-circle');

  const iconValue: Record<string, string> = {
    checked: 'mdi:checkbox-marked-circle',
    unchecked: 'mdi:checkbox-blank-circle'
  };

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);

  useEffect(() => {
    setIcon(checked ? iconValue.checked : iconValue.unchecked);
  }, [checked, iconValue.checked, iconValue.unchecked]);

  const checkedHandler = () => {
    setChecked(!checked);
    onChange(!checked);
  };

  const mouseHoverHandler = () => {
    setIcon(checked ? iconValue.unchecked : iconValue.checked);
  };

  const mouseLeaveHandler = () => {
    setIcon(checked ? iconValue.checked : iconValue.unchecked);
  };

  return (
    <div
      onMouseLeave={mouseLeaveHandler}
      onMouseEnter={mouseHoverHandler}
      data-testid="checkboxCrossed"
      className={styles.checkboxCrossed}
      role="checkbox"
      tabIndex={0}
      aria-checked={checked}
      onClick={checkedHandler}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && checkedHandler()}
    >
      <Icon role="img" color={color} icon={icon} />
      <span className={checked ? styles.crossed : ''}>{text}</span>
    </div>
  );
};

export default CheckBoxCrossed;