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

  describe('mouse events', () => {
    describe('selected', () => {
      it('should hide the options when click outside the component', () => {
        // arrange
        renderUI();
    
        fireEvent.click(screen.getByTestId('select__selected'));
    
        // act
        fireEvent.click(document.body);
    
        // assert
        waitFor(() => {
          expect(screen.queryByRole('option')).toBeNull();
        });
      });

      it('should add /remove preselect an option when mouse enters / leaves it', () => {
        // arrange
        renderUI();

        const selected = screen.getByTestId('select__selected');

        expect(selected.textContent).toBe('Low');

        fireEvent.click(selected);

        const options = screen.getAllByRole('option');

        // act
        fireEvent.mouseOver(options[1]);

        // assert
        expect(options[1].classList.contains('preselected')).toBeTruthy();

        // act
        fireEvent.mouseLeave(options[1]);

        // assert
        expect(options[1].classList.contains('preselected')).toBeFalsy();
      });
    });
  });

  describe('keyboard events', () => {
    describe('selected', () => {
      it('should hide the options when click outside the component', () => {
        // arrange
        renderUI();
    
        fireEvent.click(screen.getByTestId('select__selected'));
    
        // act
        fireEvent.click(document.body);
    
        // assert
        waitFor(() => {
          expect(screen.queryByRole('option')).toBeNull();
        });
      });
    
      it('should hide the options when press escape', () => {
        // arrange
        renderUI();

        const selected = screen.getByTestId('select__selected');
    
        // act
        fireEvent.keyDown(selected, { key: 'Escape', code: 'Escape' });
    
        // assert
        waitFor(() => {
          expect(screen.queryByRole('option')).toBeNull();
        });
      });
    
      it('should select the next option when press arrow down', () => {
        // arrange
        renderUI();
    
        const selected = screen.getByTestId('select__selected');
    
        expect(selected.textContent).toBe('Low');
    
        // act
        fireEvent.keyDown(selected, { key: 'ArrowDown', code: 'ArrowDown' });
    
        // assert
        expect(selected.textContent).toBe('Mid');
      });
    
      it('should select the previous option when press arrow up', () => {
        // arrange
        renderUI();
    
        const selected = screen.getByTestId('select__selected');
    
        expect(selected.textContent).toBe('Low');
    
        // act
        fireEvent.keyDown(selected, { key: 'ArrowUp', code: 'ArrowUp' });
    
        // assert
        expect(selected.textContent).toBe('High');
    
        // act
        fireEvent.keyDown(selected, { key: 'ArrowUp', code: 'ArrowUp' });
    
        // assert
        expect(selected.textContent).toBe('Mid');
      });
    
      it('should select the first option when press arrow down and the last option is selected', () => {
        // arrange
        renderUI();
    
        const selected = screen.getByTestId('select__selected');
    
        expect(selected.textContent).toBe('Low');
    
        // act
        fireEvent.keyDown(selected, { key: 'ArrowDown', code: 'ArrowDown' });
        fireEvent.keyDown(selected, { key: 'ArrowDown', code: 'ArrowDown' });
        fireEvent.keyDown(selected, { key: 'ArrowDown', code: 'ArrowDown' });
    
        // assert
        expect(selected.textContent).toBe('Low');
      });
    
      it('should select the last option when press arrow up and the first option is selected', () => {
        // arrange
        renderUI();
    
        const selected = screen.getByTestId('select__selected');
    
        expect(selected.textContent).toBe('Low');
    
        // act
        fireEvent.keyDown(selected, { key: 'ArrowUp', code: 'ArrowUp' });
    
        // assert
        expect(selected.textContent).toBe('High');
      });
    
      it('should select the option when press enter', () => {
        // arrange
        renderUI();
    
        const selected = screen.getByTestId('select__selected');
    
        expect(selected.textContent).toBe('Low');
    
        // act
        fireEvent.keyDown(selected, { key: 'ArrowDown', code: 'ArrowDown' });
        fireEvent.keyDown(selected, { key: 'Enter', code: 'Enter' });
    
        // assert
        expect(selected.textContent).toBe('Mid');
      });
    });

    describe('options', () => {
      it('should preselect the next option when press arrow down', () => {
        // arrange
        renderUI();
    
        fireEvent.click(screen.getByTestId('select__selected'));
    
        const options = screen.getAllByRole('option');
    
        expect(options[0].classList.contains('preselected')).toBeTruthy();  // "Low"
    
        // act
        fireEvent.keyDown(options[0], { key: 'ArrowDown', code: 'ArrowDown' });
    
        // assert
        expect(options[1].classList.contains('preselected')).toBeTruthy(); // "Mid"
        expect(options[0].classList.contains('preselected')).toBeFalsy();
      });

      it('should preselect the previous option when press arrow up', () => {
        // arrange
        renderUI();
    
        fireEvent.click(screen.getByTestId('select__selected'));
    
        const options = screen.getAllByRole('option');
    
        expect(options[0].classList.contains('preselected')).toBeTruthy();  // "Low"
    
        // act
        fireEvent.keyDown(options[0], { key: 'ArrowUp', code: 'ArrowUp' });
    
        // assert
        expect(options[2].classList.contains('preselected')).toBeTruthy(); // "High"
        expect(options[0].classList.contains('preselected')).toBeFalsy();
      });

      it('should select the preselected option when press enter', () => {
        // arrange
        renderUI();
    
        fireEvent.click(screen.getByTestId('select__selected'));
    
        const options = screen.getAllByRole('option');
    
        expect(options[0].classList.contains('preselected')).toBeTruthy();  // "Low"
    
        // act
        fireEvent.keyDown(options[0], { key: 'ArrowDown', code: 'ArrowDown' });
        fireEvent.keyDown(options[1], { key: 'Enter', code: 'Enter' });
    
        // assert
        expect(options[0].classList.contains('preselected')).toBeFalsy();
        expect(options[1].classList.contains('preselected')).toBeTruthy();
        expect(screen.getByTestId('select__selected').textContent).toBe('Mid');
      });

      it('should select the preselected option when click', () => {
        // arrange
        renderUI();
    
        fireEvent.click(screen.getByTestId('select__selected'));
    
        const options = screen.getAllByRole('option');
    
        expect(options[0].classList.contains('preselected')).toBeTruthy();  // "Low"
    
        // act
        fireEvent.keyDown(options[0], { key: 'ArrowDown', code: 'ArrowDown' });
        fireEvent.click(options[1]);
    
        // assert
        expect(options[0].classList.contains('preselected')).toBeFalsy();
        expect(options[1].classList.contains('preselected')).toBeTruthy();
        expect(screen.getByTestId('select__selected').textContent).toBe('Mid');
      });

      it('should hide the options when press escape', () => {
        // arrange
        renderUI();

        fireEvent.click(screen.getByTestId('select__selected'));

        const options = screen.getAllByRole('option');
    
        // act
        fireEvent.keyDown(options[0], { key: 'Escape', code: 'Escape' });
    
        // assert
        waitFor(() => {
          expect(screen.queryByRole('option')).toBeNull();
        });
      });

      it('should hide the options when press "Tab" in the last option', () => {
        // arrange
        renderUI();

        fireEvent.click(screen.getByTestId('select__selected'));

        const options = screen.getAllByRole('option');
    
        // act
        fireEvent.keyDown(options[2], { key: 'Tab', code: 'Tab' });
    
        // assert
        waitFor(() => {
          expect(screen.queryByRole('option')).toBeNull();
        });
      });

      it('should hide the options when press "Shift" + "Tab" in the first option', () => {
        // arrange
        renderUI();

        fireEvent.click(screen.getByTestId('select__selected'));

        const options = screen.getAllByRole('option');
    
        // act
        fireEvent.keyDown(options[0], { key: 'Tab', code: 'Tab', shiftKey: true });
    
        // assert
        waitFor(() => {
          expect(screen.queryByRole('option')).toBeNull();
        });
      });
    });
  });
});