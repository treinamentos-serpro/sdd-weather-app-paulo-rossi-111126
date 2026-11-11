import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
  precipitationProbabilityByDate?: Readonly<Record<string, number | null>>;
}

export default function ForecastList({
  forecast,
  unit,
  precipitationProbabilityByDate,
}: ForecastListProps) {
  return (
    <section aria-label="Previsão para cinco dias">
      {forecast.length === 0 ? (
        <p className="text-sm text-white/70" role="status">
          Previsão indisponível.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {forecast.map((day) => (
            <ForecastCard
              day={day}
              key={day.date}
              precipitationProbability={precipitationProbabilityByDate?.[day.date] ?? null}
              unit={unit}
            />
          ))}
        </div>
      )}
    </section>
  );
}
