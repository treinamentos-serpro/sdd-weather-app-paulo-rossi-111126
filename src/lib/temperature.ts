import type { Unit } from '../types/weather';

export function celsiusToFahrenheit(valueC: number | null): number | null {
  return valueC === null ? null : (valueC * 9) / 5 + 32;
}

export function fahrenheitToCelsius(valueF: number | null): number | null {
  return valueF === null ? null : ((valueF - 32) * 5) / 9;
}

export function convertTemperature(valueC: number | null, unit: Unit): number | null {
  return unit === 'fahrenheit' ? celsiusToFahrenheit(valueC) : valueC;
}

export function formatTemperature(valueC: number | null, unit: Unit): string {
  const value = convertTemperature(valueC, unit);
  if (value === null) return 'Temperatura indisponível';

  const formattedValue = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value);
  const unitSymbol = unit === 'celsius' ? 'C' : 'F';
  return `${formattedValue} °${unitSymbol}`;
}
