import { describe, it, vi, afterEach, expect } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';

// Store
import * as taskStore from '../../../../store/task.store';

// Components
import ProgressBar from '../../../../components/presentational/ProgressBar/ProgressBar';

describe('<ProgressBar/>', () => {

  const renderUI = () => {
    return render(<ProgressBar />);
  };

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should display the progress with rounded decimals', async () => {
    // arrange
    vi.spyOn(taskStore, 'getPercentageCompletedTasks').mockReturnValueOnce(33.3333333);

    //mockGetPercentageCompletedTasks.mockReturnValueOnce(33.33333333333333);

    // act
    renderUI();

    // assert
    expect(async () => screen.findByText('33 %')).toBeTruthy();
  });

  it('should set the text to the right of the progress bar when the progress is less than 5%', async () => {
    // arrange
    vi.spyOn(taskStore, 'getPercentageCompletedTasks').mockReturnValueOnce(4);

    // act
    renderUI();

    const span = await screen.findByText('4 %');

    // assert
    expect(span.style.marginRight).not.toBe('0px');
  });

  it('should not set the text to the right of the progress bar when the progress is more than 5%', async () => {
    // arrange
    vi.spyOn(taskStore, 'getPercentageCompletedTasks').mockReturnValueOnce(60);

    // act
    renderUI();

    const span = await screen.findByText('60 %');

    // assert
    expect(span.style.marginRight).toBe('0px');
  });
});