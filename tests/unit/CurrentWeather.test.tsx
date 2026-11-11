import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import type { City, CurrentWeather as CurrentWeatherData } from '../../src/types/weather';

const city: City = {
  id: 1,
  name: 'Campinas',
  admin1: 'Sao Paulo',
  country: 'Brasil',
  latitude: -22.9056,
  longitude: -47.0608,
};

const current: CurrentWeatherData = {
  temperatureC: 0,
  weatherCode: 2,
  time: '2026-11-11T12:00',
};

describe('CurrentWeather', () => {
  it('renders the city, current temperature, condition, and icon', () => {
    render(<CurrentWeather city={city} current={current} unit="celsius" />);

    expect(screen.getByRole('region', { name: 'Campinas' })).toBeInTheDocument();
    expect(screen.getByText('0 °C')).toBeInTheDocument();
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toHaveTextContent('⛅');
  });

  it('converts Celsius to the selected display unit', () => {
    render(<CurrentWeather city={city} current={current} unit="fahrenheit" />);

    expect(screen.getByText('32 °F')).toBeInTheDocument();
  });

  it('identifies unavailable temperature and condition without inventing values', () => {
    render(
      <CurrentWeather
        city={city}
        current={{ temperatureC: null, weatherCode: null, time: null }}
        unit="celsius"
      />,
    );

    expect(screen.getByText('Temperatura indisponível')).toBeInTheDocument();
    expect(screen.getByText('Condição indisponível')).toBeInTheDocument();
    expect(screen.queryByText('0 °C')).not.toBeInTheDocument();
  });
});
