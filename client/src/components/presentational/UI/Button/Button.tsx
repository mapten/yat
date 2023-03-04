import { Icon } from '@iconify/react';

// Styles
import './Button.scss';

// Constants
import { BUTTON_STYLE } from '../../../../constants/buttonStyles.constants';

type StateProps = {
  displayText: string;

  /** the tooltip to display when the mouse is over the button */
  tooltip?: string;

  /** The button style used. The corresponding styles are:
   * 'default': for any type of button,
   * 'add': for actions related to adding or saving,
   * 'dismiss': to actions related to delete or cancel
   */
  buttonStyle: BUTTON_STYLE;
  size: 'small' | 'medium' | 'big';
  iconName?: string;
}

type DispatchProps = {
  onClick: () => void;
}

type Props = StateProps & DispatchProps;

export const Button: React.FC<Props> = (props: Props) => {
  return (
    <button title={props.tooltip || ''} className={`button--${props.buttonStyle} button--${props.size}`} onClick={props.onClick}>
      <span>{props.displayText}</span>
      {props.iconName && <span role="img"><Icon role="img" icon={props.iconName} /></span>}
    </button>
  );
};