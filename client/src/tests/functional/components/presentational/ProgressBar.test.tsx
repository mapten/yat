import { describe, it, beforeEach, afterEach, expect } from 'vitest';

import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';

// Components
import ProgressBar from '../../../../components/presentational/ProgressBar/ProgressBar';


type Props = React.ComponentPropsWithoutRef<typeof ProgressBar>;

describe('<ProgressBar/>', () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      progress: 50,
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<ProgressBar {...baseProps} {...props} />);
  };

  afterEach(() => {
    cleanup();
  });

  it('should display the progress with rounded decimals', async () => {
    // arrange
    const props: Partial<Props> = { progress: 54.123 };

    // act
    renderUI(props);

    // assert
    expect(async () => screen.findByText('54 %')).toBeTruthy();
  });

  it('should set the text to the right of the progress bar when the progress is less than 5%', async () => {
    // arrange
    const props: Partial<Props> = { progress: 4.123 };

    // act
    renderUI(props);

    const span = await screen.findByText('4 %');

    // assert
    expect(span.style.marginRight).not.toBe('0px');
  });

  it('should not set the text to the right of the progress bar when the progress is more than 5%', async () => {
    // arrange
    const props: Partial<Props> = { progress: 60 };

    // act
    renderUI(props);

    const span = await screen.findByText('60 %');

    // assert
    expect(span.style.marginRight).toBe('0px');
  });

});