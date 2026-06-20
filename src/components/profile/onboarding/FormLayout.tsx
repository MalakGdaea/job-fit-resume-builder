import type { ReactNode } from "react";

const secondaryButtonClasses =
  "flex-1 border border-zinc-300 dark:border-zinc-700 py-2 px-4 rounded-md font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50";

const primaryButtonClasses =
  "flex-1 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 py-2 px-4 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed";

type StepActionsProps = {
  backLabel?: string;
  nextLabel: string;
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
};

type StepSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

type ItemCardProps = {
  title: string;
  subtitle: string;
  onRemove: () => void;
  children: ReactNode;
};

export function StepSection({ title, description, children }: StepSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export function ItemCard({ title, subtitle, onRemove, children }: ItemCardProps) {
  return (
    <div className="space-y-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 dark:text-red-400 text-sm"
        >
          Remove
        </button>
      </div>
      {children}
    </div>
  );
}

export function AddItemButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 py-3 px-4 rounded-md text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
    >
      {label}
    </button>
  );
}

export function StepActions({
  backLabel = "Back",
  nextLabel,
  onBack,
  onNext,
  nextDisabled = false,
}: StepActionsProps) {
  return (
    <div className="flex gap-4">
      {onBack && (
        <button onClick={onBack} className={secondaryButtonClasses}>
          {backLabel}
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={onBack ? primaryButtonClasses : `w-full ${primaryButtonClasses}`}
      >
        {nextLabel}
      </button>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-zinc-600 dark:text-zinc-400">{children}</p>
  );
}

export function TagList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-sm text-zinc-700 dark:text-zinc-300"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
