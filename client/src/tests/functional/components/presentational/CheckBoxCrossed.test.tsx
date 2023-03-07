import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';

import React from 'react';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

// Helpers
import { wait } from '../../../helpers';

// Components
import CheckBoxCrossed  from '../../../../components/presentational/UI/CheckBoxCrossed/CheckBoxCrossed';


type Props = React.ComponentPropsWithoutRef<typeof CheckBoxCrossed>;

describe('<CheckBoxCrossed/>', () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      initialChecked: false,
      text: 'Clean the house',
      color: 'red',
      onChange: vi.fn(),
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<CheckBoxCrossed {...baseProps} {...props} />);
  };

  afterEach(() => {
    cleanup();
  });

  it('should display the crossed style on the task name when initialChecked is true', () => {
    // arrange
    const props: Partial<Props> = { initialChecked: true, text: 'foo' };

    // act
    renderUI(props);
    const spanTaskName = screen.getByText('foo') as HTMLSpanElement;

    // assert
    expect(Array.from(spanTaskName.classList).find(f => f.includes('crossed'))).toBeTruthy();
  });

  it('should not display the crossed style on the task name when initialChecked is false', () => {
    // arrange
    const props: Partial<Props> = { initialChecked: false, text: 'foo' };

    // act
    renderUI(props);
    const spanTaskName = screen.getByText('foo') as HTMLSpanElement;

    // assert
    expect(Array.from(spanTaskName.classList).find(f => f.includes('crossed'))).toBeFalsy();
  });

  it('should modify the icon when hover it', async () => {
    // arrange
    const props: Partial<Props> = { initialChecked: false, text: 'foo' };

    const {container} = renderUI(props);

    // as the svg is loaded asynchronously, we need to wait for it
    await wait(1000);

    const checkbox = container.querySelector('div[data-testid="checkboxCrossed"]') as HTMLInputElement;

    const oldPath = container.querySelector('svg > path') as SVGPathElement;

    // act
    fireEvent.mouseOver(checkbox);

    const newPath = container.querySelector('svg > path') as SVGPathElement;

    fireEvent.mouseLeave(checkbox);

    const newOldPath = container.querySelector('svg > path') as SVGPathElement;

    expect(oldPath.getAttribute('d')).not.toBe(newPath.getAttribute('d'));
    expect(oldPath.getAttribute('d')).toBe(newOldPath.getAttribute('d'));
  });
});