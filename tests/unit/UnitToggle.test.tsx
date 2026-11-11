import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UnitToggle from '../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('exposes a named group and marks the selected unit as pressed', () => {
    render(<UnitToggle onChange={vi.fn()} unit="celsius" />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('selects Fahrenheit with keyboard input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<UnitToggle onChange={onChange} unit="celsius" />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('fahrenheit');
  });

  it('selects Celsius with Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<UnitToggle onChange={onChange} unit="fahrenheit" />);

    await user.tab();
    await user.keyboard(' ');

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('celsius');
  });
});
