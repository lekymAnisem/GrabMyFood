export default function LoadingSpinner({ size = 'text-4xl', message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <span className={`material-symbols-outlined animate-spin text-primary ${size}`}>progress_activity</span>
      {message && <p className="text-on-surface-variant text-label-md">{message}</p>}
    </div>
  );
}
