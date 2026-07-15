const STEPS = [
  { key: 'confirmed', icon: 'check', label: 'Order Confirmed' },
  { key: 'preparing', icon: 'restaurant', label: 'Preparing your meal' },
  { key: 'out_for_delivery', icon: 'delivery_dining', label: 'Out for Delivery' },
  { key: 'arrived', icon: 'home_pin', label: 'Arrived' },
];

const STATUS_ORDER = ['confirmed', 'preparing', 'out_for_delivery', 'arrived'];

export default function DeliveryTimeline({ status, timestamps }) {
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div className="space-y-stack-xl relative">
      <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-outline-variant" />
      {STEPS.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isActive = idx === currentIdx;
        const isFuture = idx > currentIdx;

        let circleClass = 'w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-lg';
        if (isCompleted) circleClass += ' bg-primary text-white';
        else if (isActive) circleClass += ' bg-primary-container text-on-primary-container ring-4 ring-primary/20 timeline-pulse';
        else circleClass += ' bg-surface-container-highest text-on-surface-variant';

        return (
          <div key={step.key} className={`flex items-start gap-4 relative ${isFuture ? 'opacity-40' : ''}`}>
            <div className={circleClass}>
              <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
            </div>
            <div>
              <p className={`font-label-md text-label-md ${isActive ? 'text-primary font-bold' : 'text-on-surface'}`}>{step.label}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                {timestamps?.[step.key] || (isActive ? 'In progress...' : '')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
