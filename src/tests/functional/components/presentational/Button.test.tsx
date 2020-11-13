import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../../../../components/presentational/UI/Button/Button';

type Props = React.ComponentProps<typeof Button>;

describe(`<Button/>`, () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      displayText: '',
      buttonStyle: 'default',
      onClick: jest.fn(),
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<Button {...baseProps} {...props} />);
  }

  afterEach(() => {
    cleanup();
  });

  it(`should display the icon when props.iconName is not undefined`, () => {
    // arrange
    const props: Partial<Props> = { iconName: 'save'};

    // act
    const renderResult = renderUI(props);
    const svg = renderResult.container.querySelector('svg') as SVGElement;

    // assert
    expect(svg).not.toBeNull();
  });

  it(`should not display the icon when props.iconName is undefined`, () => {
    // arrange
    const props: Partial<Props> = {iconName: undefined};

    // act
    const renderResult = renderUI(props);
    const svg = renderResult.container.querySelector('svg') as SVGElement;

    // assert
    expect(svg).toBeNull();
  });
});