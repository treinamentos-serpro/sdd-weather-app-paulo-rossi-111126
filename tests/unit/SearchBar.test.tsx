import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('exposes an accessible search landmark and city input', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    expect(screen.getByRole('search', { name: 'Buscar cidade' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toBeInTheDocument();
  });

  it('submits the trimmed city name', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), '  Campinas  ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch).toHaveBeenCalledWith('Campinas');
  });

  it('does not submit an empty query and announces the validation message', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), '   ');
    await user.keyboard('{Enter}');

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Digite o nome de uma cidade.');
    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('disables the input and prevents submission while disabled', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar disabled onSearch={onSearch} />);

    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
    expect(onSearch).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    expect(onSearch).not.toHaveBeenCalled();
  });
});
