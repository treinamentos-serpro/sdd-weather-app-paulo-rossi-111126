import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../src/components/ForecastList';
import type { ForecastDay } from '../../src/types/weather';

const forecast: ForecastDay[] = [
  { date: '2026-11-11', minTemperatureC: 0, maxTemperatureC: 10, weatherCode: 2 },
  { date: '2026-11-12', minTemperatureC: 1, maxTemperatureC: 11, weatherCode: 1 },
  { date: '2026-11-13', minTemperatureC: 2, maxTemperatureC: 12, weatherCode: 61 },
  { date: '2026-11-14', minTemperatureC: 3, maxTemperatureC: 13, weatherCode: 3 },
  { date: '2026-11-15', minTemperatureC: null, maxTemperatureC: null, weatherCode: null },
];

describe('ForecastList', () => {
  it('renders five dated cards with conditions and converted temperatures', () => {
    render(<ForecastList forecast={forecast} unit="fahrenheit" />);

    const region = screen.getByRole('region', { name: 'Previsão para cinco dias' });
    const cards = within(region).getAllByRole('article');

    expect(cards).toHaveLength(5);
    expect(within(cards[0]).getByText('qua., 11 de nov.')).toBeInTheDocument();
    expect(within(cards[0]).getByText('Parcialmente nublado')).toBeInTheDocument();
    expect(within(cards[0]).getByText('50 °F')).toBeInTheDocument();
    expect(within(cards[0]).getByText('32 °F')).toBeInTheDocument();
  });

  it('renders a supplied rain probability and marks an absent one unavailable', () => {
    render(
      <ForecastList
        forecast={forecast.slice(0, 2)}
        precipitationProbabilityByDate={{ '2026-11-11': 25 }}
        unit="celsius"
      />,
    );

    const cards = screen.getAllByRole('article');
    expect(within(cards[0]).getByText('25%')).toBeInTheDocument();
    expect(within(cards[1]).getByText('Indisponível')).toBeInTheDocument();
  });

  it('announces an empty forecast', () => {
    render(<ForecastList forecast={[]} unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent('Previsão indisponível.');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
