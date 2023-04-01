import { useCallback } from 'react';

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
  buttonType?: 'button';
  iconName?: string;
}

type DispatchProps = {
  onClick: () => void;
}

type Props = (StateIconButtonProps | StateButtonProps) & CommonProps & DispatchProps;

export const Button: React.FC<Props> = ({displayText, buttonStyle, size = 'medium', buttonType = 'button', iconName, tooltip, className, onClick}: Props) => {

  const getTooltip = useCallback(() => {
    if (tooltip) {
      return tooltip;
    }
    if (buttonType === 'icon') {
      return displayText;
    }
    return '';
  }, [tooltip, buttonType, displayText]);

  const getClassNames = useCallback(() => {
    let style = '';

    if (buttonType === 'icon') {
      style += 'button--icon';
    } else {
      style += `button--${buttonStyle}`;
    }

    style += ` button--${size}`;

    style += ` ${className}`;

    return style;
  }, [buttonType, buttonStyle, size]);

  return (
    <button title={getTooltip()} className={getClassNames()} onClick={onClick}>
      { buttonType === 'button' && (
        <span>{displayText}</span>
      )}
      {iconName && <Icon role="img" icon={iconName} />}
    </button>
  );
};