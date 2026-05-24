import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="text-5xl mb-4 select-none">{icon}</span>
      <h3 className="font-serif text-xl text-neutral-800 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">{description}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 text-sm font-medium text-primary-600 hover:text-primary-500 underline underline-offset-2 cursor-pointer bg-transparent border-0"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
