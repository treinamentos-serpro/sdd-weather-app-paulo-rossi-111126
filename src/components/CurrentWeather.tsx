import { useId } from 'react';
import { formatTemperature } from '../lib/temperature';
import { getWeatherDescription, getWeatherIcon } from '../lib/weatherCode';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const headingId = useId();
  const condition = getWeatherDescription(current.weatherCode);

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-md sm:p-7"
    >
      <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-lg font-medium text-white/75" id={headingId}>
            {city.name}
          </h2>
          <p className="mt-2 text-5xl font-semibold leading-tight text-white sm:text-6xl">
            {formatTemperature(current.temperatureC, unit)}
          </p>
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:gap-1 sm:text-center">
          <span aria-hidden="true" className="text-4xl" role="img">
            {getWeatherIcon(current.weatherCode)}
          </span>
          <p className="text-base text-white/80">{condition}</p>
        </div>
      </div>
      {current.time && (
        <p className="mt-4 text-sm text-white/55">
          Observado <time dateTime={current.time}>{current.time}</time>
        </p>
      )}
    </section>
  );
}
