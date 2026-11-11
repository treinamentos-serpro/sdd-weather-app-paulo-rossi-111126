import type { WeatherData } from '../types/weather';

export const MOCK_WEATHER_DATA: WeatherData = {
  city: {
    id: 3467865,
    name: 'Campinas',
    admin1: 'Sao Paulo',
    country: 'Brasil',
    latitude: -22.9056,
    longitude: -47.0608,
  },
  timeZone: 'America/Sao_Paulo',
  current: {
    temperatureC: 24.5,
    weatherCode: 2,
    time: '2026-11-11T12:00',
  },
  forecast: [
    { date: '2026-11-11', minTemperatureC: 18.2, maxTemperatureC: 27.1, weatherCode: 2 },
    { date: '2026-11-12', minTemperatureC: 17.8, maxTemperatureC: 28.3, weatherCode: 1 },
    { date: '2026-11-13', minTemperatureC: 19.1, maxTemperatureC: 26.4, weatherCode: 61 },
    { date: '2026-11-14', minTemperatureC: 18.5, maxTemperatureC: 25.8, weatherCode: 3 },
    { date: '2026-11-15', minTemperatureC: 17.9, maxTemperatureC: 27.6, weatherCode: 0 },
  ],
  retrievedAt: '2026-11-11T15:00:00.000Z',
};
