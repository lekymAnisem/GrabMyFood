export default function EmptyState({ icon = 'shopping_basket', title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <span className="material-symbols-outlined text-6xl text-outline">{icon}</span>
      {title && <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>}
      {description && <p className="text-on-surface-variant text-body-md text-center max-w-md">{description}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="mt-4 bg-primary text-on-primary px-8 py-3 rounded-xl font-label-md">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
