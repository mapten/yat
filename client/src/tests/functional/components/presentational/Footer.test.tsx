import { describe, it, beforeEach, afterEach, expect } from 'vitest';

import React from 'react';
import { render, cleanup, waitFor, screen } from '@testing-library/react';

// Components
import { Footer } from '../../../../components/presentational/Footer/Footer';

type Props = React.ComponentPropsWithoutRef<typeof Footer>;

describe('<Footer/>', () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      taskList: [
        { id: '1', displayName: 'Task 1', priority: 2, done: false },
        { id: '2', displayName: 'Task 2', priority: 1, done: true },
        { id: '3', displayName: 'Task 3', priority: 3, done: false },
        { id: '4', displayName: 'Task 4', priority: 2, done: true },
        { id: '5', displayName: 'Task 5', priority: 1, done: false },
        { id: '6', displayName: 'Task 6', priority: 3, done: true }
      ]
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<Footer {...baseProps} {...props} />);
  };

  afterEach(() => {
    cleanup();
  });

  it('should render the ScrollBar with the percentage of done tasks', async () => {
    // arrange, act
    renderUI();

    const progressBar = screen.getByRole('progressbar');

    // assert
    await waitFor(() => expect(progressBar.textContent).toBe('50 %'));
  });

  it('should render the ScrollBar with the percentage of 0 when there are no tasks', async () => {
    // arrange, act
    renderUI({ taskList: [] });

    const progressBar = screen.getByRole('progressbar');

    // assert
    await waitFor(() => expect(progressBar.textContent).toBe('0 %'));
  });

  it('should render the ScrollBar with the percentage of 0 when the taskList is undefined', async () => {
    // arrange, act
    renderUI({ taskList: undefined });

    const progressBar = screen.getByRole('progressbar');

    // assert
    await waitFor(() => expect(progressBar.textContent).toBe('0 %'));
  });
});