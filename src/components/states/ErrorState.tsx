interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section
      className="flex flex-col items-start gap-4 rounded-xl border border-red-300/20 bg-red-950/25 p-5 text-white sm:flex-row sm:items-center sm:justify-between"
      role="alert"
    >
      <p className="text-sm text-red-100">{message}</p>
      <button
        className="min-h-10 shrink-0 rounded-lg border border-red-200/30 px-4 font-medium text-white transition-colors hover:bg-red-100/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
        onClick={onRetry}
        type="button"
      >
        Tentar novamente
      </button>
    </section>
  );
}
