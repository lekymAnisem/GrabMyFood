export default function MenuCategory({ name, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick?.(name)}
      className={`whitespace-nowrap px-4 py-3 rounded-xl text-left transition-all ${
        isActive
          ? 'bg-secondary-container text-primary font-bold'
          : 'text-on-surface-variant hover:bg-surface-container-low'
      }`}
    >
      {name}
    </button>
  );
}
