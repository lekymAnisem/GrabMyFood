export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex gap-4 mx-2 py-3 border-b border-outline-variant/10">
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <span className="font-label-md">{item.name}</span>
          <span className="font-label-md">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center bg-surface-container-low rounded-lg px-2 py-1 gap-4">
            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="text-primary font-bold">-</button>
            <span className="text-xs">{item.quantity}</span>
            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="text-primary font-bold">+</button>
          </div>
          <button onClick={() => onRemove(item.id)} className="text-on-surface-variant text-xs underline">Remove</button>
        </div>
      </div>
    </div>
  );
}
