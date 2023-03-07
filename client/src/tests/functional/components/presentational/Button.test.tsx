import { describe, it, vi, expect, afterEach } from 'vitest';

import { render, screen, fireEvent, cleanup } from '@testing-library/react';

// Helpers
import { wait } from '../../../helpers';

// Components
import { Button } from '../../../../components/presentational/UI/Button/Button';

describe('<Button/>', () => {

  afterEach(() => {
    cleanup();
  });

  it('should display the icon when props.iconName is not undefined', async () => {
    // arrange, act
    const { container } = render(
      <Button
        iconName='material-symbols:save'
        buttonStyle='add'
        displayText='foo'
        size='small'
        onClick={vi.fn()} />
    );

    // wait for the icon to be loaded
    await wait(1000);

    const svg = container.querySelector('svg');

    // assert
    expect(svg).not.toBeNull();
  });

  it('should not display the icon when props.iconName is undefined', async () => {
    // arrange, act
    const { container } = render(
      <Button
        iconName={undefined}
        buttonStyle='add'
        displayText='foo'
        size='small'
        onClick={vi.fn()} />
    );

    // wait for the icon to be loaded
    await wait(1000);

    const svg = container.querySelector('svg');

    // assert
    expect(svg).toBeNull();
  });

  it('should trigger onClick when button is clicked', () => {
    // arrange
    const onClick = vi.fn();

    render(
      <Button
        buttonStyle='add'
        displayText='foo'
        size='small'
        onClick={onClick} />
    );

    const button = screen.getByRole('button') as HTMLButtonElement;

    // act
    fireEvent.click(button);

    // assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should display the displayText when props.buttonType is button', () => {
    // arrange, act
    render(
      <Button
        buttonStyle='add'
        buttonType='button'
        displayText='Test'
        size='small'
        onClick={vi.fn()} />
    );

    const span = screen.getByText('Test') as HTMLSpanElement;

    // assert
    expect(span).not.toBeNull();
  });

  it('should not display the displayText when props.buttonType is icon', () => {
    // arrange, act
    render(
      <Button
        buttonStyle='add'
        buttonType='icon'
        iconName='material-symbols:save'
        displayText='Test'
        size='small'
        onClick={vi.fn()} />
    );

    const span = screen.queryByText('Test') as HTMLSpanElement;

    // assert
    expect(span).toBeNull();
    expect(screen.getByTitle('Test')).not.toBeNull();
  });

  it(`should display the button with the class "button--icon" when props.buttonType is 'icon'`, () => {
    // arrange, act
    render(
      <Button
        buttonStyle='add'
        buttonType='icon'
        iconName='material-symbols:save'
        displayText='Test'
        size='small'
        onClick={vi.fn()} />
    );

    const button = screen.getByRole('button') as HTMLButtonElement;

    // assert
    expect(Array.from(button.classList).find(f => f.includes('button--icon'))).toBeTruthy();
  });

  it('should display the tooltip when props.tooltip is not undefined', () => {
    // arrange, act
    render(
      <Button
        buttonStyle='add'
        buttonType='button'
        iconName='material-symbols:save'
        displayText='foo'
        tooltip='Test'
        size='small'
        onClick={vi.fn()} />
    );

    const span = screen.getByTitle('Test') as HTMLSpanElement;

    // assert
    expect(span).not.toBeNull();
  });

  it('should not display the tooltip when props.tooltip is undefined', () => {
    // arrange, act
    render(
      <Button
        buttonStyle='add'
        buttonType='button'
        iconName='material-symbols:save'
        displayText='foo'
        size='small'
        onClick={vi.fn()} />
    );

    const span = screen.queryByTitle('Test') as HTMLSpanElement;

    // assert
    expect(span).toBeNull();
  });

  it('should display the tooltip when props.tooltip is undefined and props.buttonType is icon', () => {
    // arrange, act
    render(
      <Button
        buttonStyle='add'
        buttonType='icon'
        iconName='material-symbols:save'
        displayText='Test'
        size='small'
        onClick={vi.fn()} />
    );

    const span = screen.getByTitle('Test') as HTMLSpanElement;

    // assert
    expect(span).not.toBeNull();
  });

  it(`should display the button with the class 'button--default' when props.buttonStyle is default `, () => {
    // arrange, act
    render(
      <Button
        buttonStyle='default'
        displayText='Test'
        size='small'
        onClick={vi.fn()} />
    );

    const button = screen.getByRole('button') as HTMLButtonElement;

    // assert
    expect(Array.from(button.classList).find(f => f.includes('--default'))).toBeTruthy();
  });

  it(`should display the button with the class 'button--small' when props.size is small `, () => {
    // arrange, act
    render(
      <Button
        buttonStyle='default'
        displayText='Test'
        size='small'
        onClick={vi.fn()} />
    );

    const button = screen.getByRole('button') as HTMLButtonElement;

    // assert
    expect(Array.from(button.classList).find(f => f.includes('--small'))).toBeTruthy();
  });
});