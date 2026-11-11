import { useId } from 'react';

interface EmptyStateProps {
  title: string;
  hint: string;
}

export default function EmptyState({ title, hint }: EmptyStateProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="py-10 text-center">
      <h2 className="text-lg font-semibold text-white" id={titleId}>
        {title}
      </h2>
      <p className="mt-2 text-sm text-white/65">{hint}</p>
    </section>
  );
}
