import { useEffect, useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { MOCK_WEATHER_DATA } from './mocks/weatherData';
import type { Unit, WeatherData } from './types/weather';

type ViewStatus = 'idle' | 'loading' | 'empty' | 'error' | 'success';

function normalizeCityName(city: string): string {
  return city
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('pt-BR');
}

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [status, setStatus] = useState<ViewStatus>('idle');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const searchTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeout.current !== null) window.clearTimeout(searchTimeout.current);
    };
  }, []);

  function handleSearch(city: string) {
    if (searchTimeout.current !== null) window.clearTimeout(searchTimeout.current);

    setQuery(city);
    setWeatherData(null);
    setStatus('loading');

    searchTimeout.current = window.setTimeout(() => {
      searchTimeout.current = null;

      try {
        const mockCityName = MOCK_WEATHER_DATA?.city?.name;
        if (!mockCityName) throw new Error('Dados de demonstração indisponíveis.');

        if (normalizeCityName(city) === normalizeCityName(mockCityName)) {
          setWeatherData(MOCK_WEATHER_DATA);
          setStatus('success');
          return;
        }

        setStatus('empty');
      } catch {
        setErrorMessage('Não foi possível carregar os dados meteorológicos.');
        setStatus('error');
      }
    }, 250);
  }

  function renderContent() {
    if (status === 'idle') {
      return <EmptyState hint="Nenhuma localidade selecionada." title="Aguardando busca" />;
    }

    if (status === 'loading') return <LoadingState />;

    if (status === 'empty') {
      return (
        <EmptyState
          hint={`Não há dados de demonstração para ${query}. Experimente Campinas.`}
          title="Cidade não encontrada"
        />
      );
    }

    if (status === 'error') {
      return <ErrorState message={errorMessage} onRetry={() => handleSearch(query)} />;
    }

    if (!weatherData) {
      return (
        <ErrorState
          message="Os dados meteorológicos estão indisponíveis."
          onRetry={() => handleSearch(query)}
        />
      );
    }

    return (
      <div className="space-y-8">
        <CurrentWeather city={weatherData.city} current={weatherData.current} unit={unit} />
        <section aria-labelledby="forecast-heading" className="space-y-4">
          <h2 className="text-lg font-semibold text-white" id="forecast-heading">
            Próximos dias
          </h2>
          <ForecastList forecast={weatherData.forecast} unit={unit} />
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10 bg-night-900/90">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-4 py-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:px-6">
          <a
            aria-label="Clima, voltar ao conteúdo"
            className="flex min-h-11 items-center gap-3 justify-self-start rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            href="#main-content"
          >
            <span
              aria-hidden="true"
              className="grid h-10 w-10 place-items-center rounded-xl bg-accent-500 font-bold text-white"
            >
              C
            </span>
            <span className="text-xl font-semibold tracking-wide text-white">Clima</span>
          </a>
          <SearchBar disabled={status === 'loading'} onSearch={handleSearch} />
          <UnitToggle onChange={setUnit} unit={unit} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6" id="main-content">
        <h1 className="mb-5 text-2xl font-semibold text-white">Previsão do tempo</h1>
        {renderContent()}
      </main>
    </div>
  );
}
