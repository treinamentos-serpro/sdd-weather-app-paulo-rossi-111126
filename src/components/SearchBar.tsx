import { type FormEvent, useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const id = useId();
  const [city, setCity] = useState('');
  const [showEmptyError, setShowEmptyError] = useState(false);
  const errorId = `${id}-error`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (disabled) return;

    const normalizedCity = city.trim();
    if (!normalizedCity) {
      setShowEmptyError(true);
      return;
    }

    setShowEmptyError(false);
    onSearch(normalizedCity);
  }

  function handleChange(value: string) {
    setCity(value);
    if (value.trim()) setShowEmptyError(false);
  }

  return (
    <form
      aria-label="Buscar cidade"
      className="flex w-full flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md sm:flex-row sm:items-end"
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <label className="text-sm font-medium text-white" htmlFor={`${id}-city`}>
          Cidade
        </label>
        <input
          aria-describedby={showEmptyError ? errorId : undefined}
          aria-invalid={showEmptyError || undefined}
          autoComplete="off"
          className="min-h-11 w-full rounded-lg border border-white/15 bg-night-800/80 px-3 text-white placeholder:text-white/50 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/50 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          id={`${id}-city`}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="Ex.: Campinas"
          type="search"
          value={city}
        />
        {showEmptyError && (
          <p className="text-sm text-red-300" id={errorId} role="alert">
            Digite o nome de uma cidade.
          </p>
        )}
      </div>
      <button
        className="min-h-11 rounded-lg bg-accent-500 px-5 font-semibold text-white transition-colors hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        type="submit"
      >
        Buscar
      </button>
    </form>
  );
}
