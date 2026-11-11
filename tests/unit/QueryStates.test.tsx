import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';
import ErrorState from '../../src/components/states/ErrorState';
import LoadingState from '../../src/components/states/LoadingState';

describe('query states', () => {
  it('announces loading with a status role', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
  });

  it('announces the error and calls retry when requested', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState message="Não foi possível carregar os dados." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar os dados.');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders the empty title and hint in a named region', () => {
    render(
      <>
        <EmptyState hint="Tente buscar por outra cidade." title="Nenhuma cidade encontrada" />
        <EmptyState hint="Digite uma cidade para iniciar." title="Busque uma cidade" />
      </>,
    );

    expect(screen.getByRole('region', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    expect(screen.getByText('Tente buscar por outra cidade.')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Busque uma cidade' })).toBeInTheDocument();
  });
});
