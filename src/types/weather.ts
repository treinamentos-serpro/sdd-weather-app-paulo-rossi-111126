export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number;
  name: string;
  admin1: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperatureC: number | null;
  weatherCode: number | null;
  time: string | null;
}

export interface ForecastDay {
  date: string;
  minTemperatureC: number | null;
  maxTemperatureC: number | null;
  weatherCode: number | null;
}

export interface WeatherData {
  city: City;
  timeZone: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
  retrievedAt: string;
}
