import { useVisitCounter } from '@/hooks/useVisitCounter';

export function VisitCounter() {
  const { visits, loading, error } = useVisitCounter();

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading visit count...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-muted-foreground">
        Visits: --
      </div>
    );
  }

  return (
    <div className="text-sm text-muted-foreground">
      Visits: {visits.toLocaleString()}
    </div>
  );
}