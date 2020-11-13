import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Create } from '../../../../components/containers/Create/Create';
import * as toastify from 'react-toastify';
import { Priority } from '../../../../models/priority.model';

const mockPriorityLevelsValueGetter = jest.fn();
jest.mock('../../../../constants/priorityLevels.constant', () => ({
  get PRIORITY_LEVELS() {
    return mockPriorityLevelsValueGetter();
  },
}));

type Props = React.ComponentProps<typeof Create>;

describe(`<Create/>`, () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      onCancel: jest.fn(),
      onSave: jest.fn(),
    };

    const fakePriorityLevels: Priority[] = [
      {
        order: 0,
        displayText: 'First',
        displayColor: '#000000',
        isDefaultSelected: false,
      },
      {
        order: 1,
        displayText: 'Second',
        displayColor: '#111111',
        isDefaultSelected: true,
      },
    ];

    mockPriorityLevelsValueGetter.mockReturnValue(fakePriorityLevels);
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<Create {...baseProps} {...props} />);
  };

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it(`should load as many options in the select as items are in PRIORITY_LEVELS`, () => {
    // arrange
    // act
    const renderResult = renderUI();

    const options = renderResult.container.querySelectorAll('select option');

    // assert
    expect(options[0]).toHaveTextContent('First');
    expect(options[1]).toHaveTextContent('Second');
  });

  it(`should display a toast error and the input border in red when saving changes but the todo name is empty`, () => {
    // arrange
    const mockToastifyError = jest.spyOn(toastify.toast, 'warning');

    const renderResult = renderUI();

    const saveButton = renderResult.container.querySelector('button:nth-child(2)') as HTMLButtonElement;
    // act
    saveButton.click();

    const todoNameInput = renderResult.container.querySelector('input') as HTMLInputElement;

    // assert
    expect(todoNameInput).toHaveClass('danger');
    expect(mockToastifyError).toHaveBeenCalledTimes(1);
    expect(baseProps.onSave).not.toHaveBeenCalled();
  });

  it(`should not display a toast error nor the input border in red when saving changes and the todo name is not empty`, () => {
    // arrange
    const mockToastifyError = jest.spyOn(toastify.toast, 'warning');

    const renderResult = renderUI();

    const todoNameInput = renderResult.container.querySelector('input') as HTMLInputElement;
    fireEvent.change(todoNameInput, {target: {value: 'foo'}});

    const saveButton = renderResult.container.querySelector('button:nth-child(2)') as HTMLButtonElement;
    // act
    saveButton.click();

    // assert
    expect(todoNameInput).not.toHaveClass('danger');
    expect(mockToastifyError).not.toHaveBeenCalled();
    expect(baseProps.onSave).toHaveBeenCalled();
  });
});
