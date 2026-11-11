import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../../src/App';

describe('App', () => {
  it('starts in idle with search and unit controls available', () => {
    render(<App />);

    expect(screen.getByRole('search', { name: 'Buscar cidade' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Aguardando busca' })).toBeInTheDocument();
  });

  it('shows loading and then the mock weather for Campinas', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'Campinas');
    await user.keyboard('{Enter}');

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
    expect(await screen.findByText('24,5 °C')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
  });

  it('shows the empty state when the search does not match the mock city', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'Lisboa');
    await user.keyboard('{Enter}');

    expect(
      await screen.findByRole('region', { name: 'Cidade não encontrada' }),
    ).toBeInTheDocument();
  });

  it('converts displayed temperatures when the unit changes without re-searching', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'Campinas');
    await user.keyboard('{Enter}');
    expect(await screen.findByText('24,5 °C')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(screen.getByText('76,1 °F')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
  });
});
