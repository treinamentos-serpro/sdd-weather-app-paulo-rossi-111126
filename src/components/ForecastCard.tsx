import { useId } from 'react';
import { formatForecastDate } from '../lib/dateTime';
import { formatTemperature } from '../lib/temperature';
import { getWeatherDescription, getWeatherIcon } from '../lib/weatherCode';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
  precipitationProbability?: number | null;
}

export default function ForecastCard({
  day,
  unit,
  precipitationProbability = null,
}: ForecastCardProps) {
  const headingId = useId();
  const condition = getWeatherDescription(day.weatherCode);

  return (
    <article
      aria-labelledby={headingId}
      className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md"
    >
      <h3 className="text-sm font-semibold capitalize text-white" id={headingId}>
        <time dateTime={day.date}>{formatForecastDate(day.date, 'pt-BR')}</time>
      </h3>
      <div className="mt-3 flex items-center gap-2">
        <span aria-hidden="true" className="text-3xl">
          {getWeatherIcon(day.weatherCode)}
        </span>
        <p className="text-sm text-white/75">{condition}</p>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div>
          <dt className="text-white/55">Máx.</dt>
          <dd className="font-medium text-white">{formatTemperature(day.maxTemperatureC, unit)}</dd>
        </div>
        <div>
          <dt className="text-white/55">Mín.</dt>
          <dd className="font-medium text-white">{formatTemperature(day.minTemperatureC, unit)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-white/55">Probabilidade de chuva</dt>
          <dd className="font-medium text-white">
            {precipitationProbability === null
              ? 'Indisponível'
              : `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(precipitationProbability)}%`}
          </dd>
        </div>
      </dl>
    </article>
  );
}
