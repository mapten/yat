import { Icon } from '@iconify/react';

// Styles
import './Button.scss';

// Types
import { BUTTON_SIZE, BUTTON_STYLE } from '../../../../typings/common.types';

type CommonProps = {
  displayText: string;

  /** The button style used. The corresponding styles are:
   * 'default': for any type of button,
   * 'add': for actions related to adding or saving,
   * 'dismiss': to actions related to delete or cancel
   */
  buttonStyle: BUTTON_STYLE;
  size: BUTTON_SIZE;

  /** the tooltip to display when the mouse is over the button */
  tooltip?: string;
  className?: string;
}

type StateIconButtonProps = {
  buttonType?: 'icon';
  iconName: string;
}

type StateButtonProps = {
  buttonType?: 'solid';
  iconName?: string;
}

type StateLinkTypeButtonProps = {
  buttonType?: 'link';
  iconName?: string;
}

type DispatchProps = {
  onClick: () => void;
}

type Props = (StateIconButtonProps | StateButtonProps | StateLinkTypeButtonProps) & CommonProps & DispatchProps;

const Button: React.FC<Props> = ({
  displayText,
  buttonStyle,
  size = 'medium',
  buttonType = 'solid',
  iconName,
  tooltip,
  className,
  onClick
}: Props) => {

  const getTooltip = () => {
    if (tooltip) {
      return tooltip;
    }
    if (buttonType === 'icon') {
      return displayText;
    }
    return '';
  };

  return (
    <button
      title={getTooltip()}
      className={`button button--${buttonType} button--${buttonStyle} button--${size}${className ? ' ' + className : ''}`}
      onClick={onClick}>
      { (buttonType === 'solid' || buttonType === 'link') && (
        <span>{displayText}</span>
      )}
      {iconName && <Icon role="img" icon={iconName} />}
    </button>
  );
};

export default Button;