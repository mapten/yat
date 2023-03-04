import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';

import React from 'react';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

// Components
import { Button } from '../../../../components/presentational/UI/Button/Button';

type Props = React.ComponentPropsWithoutRef<typeof Button>;

describe('<Button/>', () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      size: 'small',
      displayText: '',
      buttonStyle: 'default',
      onClick: vi.fn(),
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<Button {...baseProps} {...props} />);
  };

  afterEach(() => {
    cleanup();
  });

  it('should display the icon when props.iconName is not undefined', () => {
    // arrange
    const props: Partial<Props> = { iconName: 'material-symbols:save'};

    // act
    renderUI(props);

    const imgWrapper = screen.getByRole('img');

    // assert
    expect(imgWrapper).not.toBeNull();
  });

  it('should not display the icon when props.iconName is undefined', () => {
    // arrange
    const props: Partial<Props> = {iconName: undefined};

    // act
    renderUI(props);

    const imgWrapper = screen.queryByRole('img') as HTMLSpanElement;

    // assert
    expect(imgWrapper).toBeNull();
  });

  it('should trigger onClick when button is clicked', () => {
    // arrange
    const props: Partial<Props> = { onClick: vi.fn() };

    renderUI(props);

    const button = screen.getByRole('button') as HTMLButtonElement;

    // act
    fireEvent.click(button);

    // assert
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });
});