import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';

import React from 'react';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';

// Components
import Select from '../../../../components/presentational/UI/Select/Select';

type Option = {
  id: string;
  text: string;
};

type Props = React.ComponentPropsWithoutRef<typeof Select<Option, string>>;

describe('<Select/>', () => {
  let baseProps: Props;

  beforeEach(() => {
    baseProps = {
      initialItem: '0',
      items: [
        { id: '0', text: 'Low' },
        { id: '1', text: 'Mid' },
        { id: '2', text: 'High' },
      ] as Option[],
      onSelect: vi.fn(),
      keyExtractor: (item: Option) => item.id,
      textExtractor: (item: Option) => item.text,
      renderItem: (item: Option) => <div>{item.text}</div>,
    };
  });

  const renderUI = (props: Partial<Props> = {}) => {
    return render(<Select {...baseProps} {...props} />);
  };

  afterEach(() => {
    cleanup();
  });

  it('should display / hide the options when clicking on the select', () => {
    // arrange
    renderUI();

    // at first, the options should be hidden
    expect(screen.queryByRole('option')).toBeNull();

    // act
    fireEvent.click(screen.getByTestId('select__selected'));

    // assert
    // options should be visible
    expect(screen.queryAllByRole('option').length).toBe(3);

    // act
    fireEvent.click(screen.getByTestId('select__selected'));

    // assert
    // options should be hidden
    expect(screen.queryByRole('option')).toBeNull();
  });

  it('should display the default selected option', () => {
    // arrange
    // act
    renderUI({ initialItem: '2' });

    const select = screen.getByRole('combobox');

    // assert
    expect(select.textContent).toBe('High');
  });

  it('should display the selected option in the select area when click on an option', () => {
    // arrange
    renderUI();

    const select = screen.getByRole('combobox');

    expect(select.textContent).toBe('Low');

    fireEvent.click(screen.getByTestId('select__selected'));

    const option = screen.getByRole('option', { name: 'High' });

    // act
    fireEvent.click(option);

    // assert
    expect(select.textContent).toBe('High');
  });

  it('should trigger onSelect callback when click on an option', () => {
    // arrange
    renderUI();

    fireEvent.click(screen.getByTestId('select__selected'));

    const option = screen.getByRole('option', { name: 'Mid' });

    // act
    fireEvent.click(option);

    // assert
    expect(baseProps.onSelect).toHaveBeenCalledWith('1');
  });

  it('should not trigger onSelect callback when the option is the same as the selected one', () => {
    // arrange
    renderUI();

    fireEvent.click(screen.getByTestId('select__selected'));

    const option = screen.getByRole('option', { name: 'Low' });

    // act
    fireEvent.click(option);

    // assert
    expect(baseProps.onSelect).not.toHaveBeenCalled();
  });

  it('should hide the options when click on an option', () => {
    // arrange
    renderUI();

    fireEvent.click(screen.getByTestId('select__selected'));

    const option = screen.getByRole('option', { name: 'Mid' });

    // act
    fireEvent.click(option);

    // assert
    expect(screen.queryByRole('option')).toBeNull();
  });

  it('should hide the options when click outside the component', async () => {
    // arrange
    renderUI();

    fireEvent.click(screen.getByTestId('select__selected'));

    // act
    fireEvent.click(document.body);

    // assert
    await waitFor(() => {
      expect(screen.queryByRole('option')).toBeNull();
    });
  });

  it('should hide the options when press escape', async () => {
    // arrange
    renderUI();

    fireEvent.click(screen.getByTestId('select__selected'));

    // act
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });

    // assert
    await waitFor(() => {
      expect(screen.queryByRole('option')).toBeNull();
    });
  });
});