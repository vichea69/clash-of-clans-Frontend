import { Base } from "@/types/base";
import { ComponentCard } from "./ComponentCard";
import { SkeletonCard } from "./SkeletonCard";

interface ComponentGridProps {
  components: Base[];
  loading: boolean;
  error: string | null;
  handleRetry: () => void;
}

export const ComponentGrid = ({
  components,
  loading,
  error,
  handleRetry,
}: ComponentGridProps) => {
  if (loading && components.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(16)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 text-center rounded-lg border border-red-200 bg-red-50 text-red-500 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <p className="font-medium mb-2">{error}</p>
        <button
          onClick={handleRetry}
          className="mt-2 px-5 py-3 bg-red-100 hover:bg-red-200 active:bg-red-300
            rounded-md text-sm font-medium transition-all hover:scale-105 active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (components.length === 0) {
    return (
      <div className="p-6 text-center rounded-lg border bg-background animate-in fade-in slide-in-from-bottom-5 duration-700">
        <p className="text-muted-foreground">No components available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {components.map((component, index) => (
        <div
          key={component.id}
          className="animate-in fade-in slide-in-from-bottom-5"
          style={{
            animationDelay: `${Math.min(index * 50, 500)}ms`,
            animationDuration: "500ms",
          }}
        >
          <ComponentCard component={component} />
        </div>
      ))}
    </div>
  );
};
