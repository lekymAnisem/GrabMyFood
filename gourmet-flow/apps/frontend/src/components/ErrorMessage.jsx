export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <span className="material-symbols-outlined text-6xl text-error">error</span>
      <p className="text-on-surface-variant text-body-md text-center">{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 bg-primary text-on-primary px-8 py-3 rounded-xl font-label-md">
          Try Again
        </button>
      )}
    </div>
  );
}
