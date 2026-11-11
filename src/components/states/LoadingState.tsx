export default function LoadingState() {
  return (
    <div
      aria-live="polite"
      className="flex items-center justify-center gap-3 py-8 text-white/75"
      role="status"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-accent-400"
      />
      <span>Carregando...</span>
    </div>
  );
}
