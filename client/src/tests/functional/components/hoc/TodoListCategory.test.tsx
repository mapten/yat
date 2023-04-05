import { describe, it, afterEach, expect } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

// Components
import TodoListCategory from '../../../../components/hoc/TodoListCategory/TodoListCategory';

describe('<TodoListCategory/>', () => {
  afterEach(() => {
    cleanup();
  });

  it('should capitalize the category', () => {
    // arrange, act
    render(<TodoListCategory category='pending' displayCount={false}>
      <div>foo</div>
    </TodoListCategory>);

    // assert
    expect(screen.getByRole('button').textContent).toBe('Pending');
  });

  it('should not show the children when initialShowList is true', () => {
    // arrange, act
    render(<TodoListCategory category='pending' displayCount={false} initialShowList={true}>
      <div data-testid="foo">foo</div>
    </TodoListCategory>);

    // assert
    expect(screen.getByTestId('foo')).toBeTruthy();
  });

  it('should show the children when initialShowList is false', () => {
    // arrange, act
    render(<TodoListCategory category='pending' displayCount={false} initialShowList={false}>
      <div data-testid="foo">foo</div>
    </TodoListCategory>);

    // assert
    expect(screen.queryByTestId('foo')).toBeNull();
  });

  it('should show the children when initialShowList is false and the button is clicked', () => {
    // arrange
    render(<TodoListCategory category='pending' displayCount={false} initialShowList={false}>
      <div data-testid="foo">foo</div>
    </TodoListCategory>);

    expect(screen.queryByTestId('foo')).toBeNull();

    // act
    fireEvent.click(screen.getByRole('button'));

    // assert
    expect(screen.getByTestId('foo')).toBeTruthy();
  });

  it('should display the item count when displayCount is true', () => {
    // arrange, act
    render(<TodoListCategory category='pending' displayCount={true} itemCount={3} initialShowList={true}>
      <div data-testid="foo">foo</div>
    </TodoListCategory>);

    // assert
    expect(screen.getByText('(3)')).toBeTruthy();
  });

  it('should not display the item count when displayCount is false', () => {
    // arrange, act
    render(<TodoListCategory category='pending' displayCount={false} initialShowList={true}>
      <div data-testid="foo">foo</div>
    </TodoListCategory>);

    // assert
    expect(screen.queryByText('(0)')).toBeNull();
  });

  describe('key events', () => {
    it('should show the children when Enter is pressed', () => {
      // arrange
      render(<TodoListCategory category='pending' displayCount={false} initialShowList={false}>
        <div data-testid="foo">foo</div>
      </TodoListCategory>);

      expect(screen.queryByTestId('foo')).toBeNull();

      // act
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter', code: 'Enter' });

      // assert
      expect(screen.getByTestId('foo')).toBeTruthy();
    });

    it('should show the children when Space is pressed', () => {
      // arrange
      render(<TodoListCategory category='pending' displayCount={false} initialShowList={false}>
        <div data-testid="foo">foo</div>
      </TodoListCategory>);

      expect(screen.queryByTestId('foo')).toBeNull();

      // act
      fireEvent.keyDown(screen.getByRole('button'), { key: ' ', code: 'Space' });

      // assert
      expect(screen.getByTestId('foo')).toBeTruthy();
    });

    it('should show the children when ArrowDown is pressed', () => {
      // arrange
      render(<TodoListCategory category='pending' displayCount={false} initialShowList={false}>
        <div data-testid="foo">foo</div>
      </TodoListCategory>);

      expect(screen.queryByTestId('foo')).toBeNull();

      // act
      fireEvent.keyDown(screen.getByRole('button'), { key: 'ArrowDown', code: 'ArrowDown' });

      // assert
      expect(screen.getByTestId('foo')).toBeTruthy();
    });

    it('should hide the children when Escape is pressed', () => {
      // arrange
      render(<TodoListCategory category='pending' displayCount={false} initialShowList={true}>
        <div data-testid="foo">foo</div>
      </TodoListCategory>);

      expect(screen.getByTestId('foo')).toBeTruthy();

      // act
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape', code: 'Escape' });

      // assert
      expect(screen.queryByTestId('foo')).toBeNull();
    });

    it('should hide the children when ArrowUp is pressed', () => {
      // arrange
      render(<TodoListCategory category='pending' displayCount={false} initialShowList={true}>
        <div data-testid="foo">foo</div>
      </TodoListCategory>);

      expect(screen.getByTestId('foo')).toBeTruthy();

      // act
      fireEvent.keyDown(screen.getByRole('button'), { key: 'ArrowUp', code: 'ArrowUp' });

      // assert
      expect(screen.queryByTestId('foo')).toBeNull();
    });
  });
});