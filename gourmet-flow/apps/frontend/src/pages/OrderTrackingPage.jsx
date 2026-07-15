import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DeliveryTimeline from '../components/DeliveryTimeline';
import DriverCard from '../components/DriverCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const DRIVER = {
  name: 'Marco Santoro',
  rating: 4.9,
  orderCount: '2,400+',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB95DpENtV7SYWT2f1vRqBFwWTYo9dEtqzax9zZqiMIUPSA7jVIp4BZVhcbnMnKc5e5h73Kx3iJg0rmvO9gOgcLl8BILXNP6qdZKhUdffyxiKoV7z1NbB2R_iLzjhWBkr0YtwcCxIBDoUhlCkpUkg_NucZYGJfoXftptqyRHwvaz0kO0qb_9i1BkS5grlGRmqkJbprUHQU0L9ycLMwUBsmg5BNNkwCPafjxteNHNKiq-Wxf0Lmq6tKG3YzVKzAcxlRm0RZueJnJ7vM',
};

const TIMESTAMPS = {
  confirmed: '12:15 PM',
  preparing: 'The chef is perfecting your dish',
  out_for_delivery: 'Marco is 1.2km away',
};

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [cartOpen, setCartOpen] = useState(false);
  const [loading] = useState(false);
  const [error] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const amount = 10;
      const x = (window.innerWidth / 2 - e.pageX) / amount;
      const y = (window.innerHeight / 2 - e.pageY) / amount;
      const map = document.querySelector('[data-location]');
      if (map) {
        map.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (loading) return <LoadingSpinner message="Loading tracking..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen relative">
      <section className="absolute inset-0 z-0 pt-20">
        <div className="w-full h-full relative overflow-hidden bg-surface-container-low">
          <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-full h-full bg-cover bg-center transition-all duration-700"
              data-location="Paris"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEl8buRbjIITxJk7-kMUtxnGZWETAN0V_z1WQt2xQ8vhlUoQAzuCjWfnlwYul80tKOhEWz5WYeZyJt4a6vXjJQOo1i9xpgnXdznssIvAx04-6n4p_XGVmoqBFrWXWFsiOwr3ZWmV2873fnW_4b7naUyUqv9TG168YwMOpanDRD1YGHH7rOQu_qUxG1EHPXKo6Y7rJkrNFSmpiluglwiY0Rr-M4KLh0l5ge6IVocKHXik1tyq4miVhclG88MycMgrPfaz9uCNCP-d4')" }}
            />
          </div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000">
            <path className="route-line opacity-60" d="M200,800 Q400,600 600,700 T800,400" fill="none" stroke="#b90058" strokeLinecap="round" strokeWidth="6" />
            <circle className="timeline-pulse" cx="600" cy="700" fill="#b90058" r="12" />
            <circle className="animate-ping" cx="600" cy="700" fill="#b90058" fillOpacity="0.2" r="24" />
          </svg>
        </div>
      </section>
      <div className="relative z-10 px-6 md:px-margin-desktop py-stack-lg flex flex-col md:flex-row gap-gutter pointer-events-none min-h-screen pt-24">
        <div className="w-full md:w-1/3 space-y-gutter pointer-events-auto">
          <div className="glass-panel rounded-3xl p-stack-lg shadow-xl transform transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-center mb-stack-md">
              <span className="font-label-md text-label-md text-on-surface-variant">Estimated Delivery</span>
              <div className="px-3 py-1 bg-primary-container rounded-full text-on-primary-container text-[10px] font-bold uppercase tracking-widest">Live</div>
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="font-display-lg text-display-lg text-primary">12-18</h1>
              <span className="font-headline-md text-headline-md text-primary/60">mins</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Arriving at 12:45 PM from <span className="font-bold text-on-surface">Le Gourmet Bistrot</span>
            </p>
          </div>
          <DriverCard driver={DRIVER} />
        </div>
        <div className="w-full md:w-1/4 pointer-events-auto ml-auto">
          <div className="glass-panel rounded-3xl p-stack-lg shadow-xl h-full">
            <h4 className="font-label-md text-label-md text-on-surface-variant mb-stack-lg flex items-center gap-2">
              <span className="material-symbols-outlined">list_alt</span> ORDER PROGRESS
            </h4>
            <DeliveryTimeline status="out_for_delivery" timestamps={TIMESTAMPS} />
          </div>
        </div>
      </div>

      <aside className={`fixed inset-y-0 right-0 w-full md:w-96 z-[60] bg-surface shadow-2xl transition-transform duration-500 border-l border-outline-variant ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-stack-lg border-b border-outline-variant/30 flex justify-between items-center">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary">Your Order</h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Order #92841 • Premium Selection</p>
            </div>
            <button onClick={() => setCartOpen(false)} className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container-low rounded-full transition-all">close</button>
          </div>
          <div className="flex-1 overflow-y-auto p-stack-lg space-y-stack-lg">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4"><span className="font-label-md text-primary">1x</span><div><p className="font-label-md text-on-surface">Truffle Tagliatelle</p><p className="text-xs text-on-surface-variant">No garlic, extra parm</p></div></div>
                <span className="font-label-md text-on-surface">€24.00</span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex gap-4"><span className="font-label-md text-primary">2x</span><div><p className="font-label-md text-on-surface">Burrata con Pesto</p></div></div>
                <span className="font-label-md text-on-surface">€18.00</span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex gap-4"><span className="font-label-md text-primary">1x</span><div><p className="font-label-md text-on-surface">Mineral Water</p></div></div>
                <span className="font-label-md text-on-surface">€4.50</span>
              </div>
            </div>
            <div className="pt-stack-lg border-t border-dashed border-outline-variant/50 space-y-2">
              <div className="flex justify-between text-on-surface-variant"><span className="text-sm">Subtotal</span><span className="text-sm">€46.50</span></div>
              <div className="flex justify-between text-on-surface-variant"><span className="text-sm">Delivery Fee</span><span className="text-sm">€0.00</span></div>
              <div className="flex justify-between text-on-surface-variant"><span className="text-sm">Service Fee</span><span className="text-sm">€2.50</span></div>
              <div className="flex justify-between font-bold text-lg text-on-surface pt-2"><span>Total</span><span>€49.00</span></div>
            </div>
            <div className="bg-secondary-container/30 p-4 rounded-2xl flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">card_giftcard</span>
              <p className="text-sm text-on-secondary-container">You've earned <span className="font-bold">49 Culinara Points</span> on this order!</p>
            </div>
          </div>
          <div className="p-stack-lg space-y-stack-md">
            <button className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20 active:scale-95 transition-all">
              <span className="material-symbols-outlined">receipt_long</span> Download PDF Receipt
            </button>
            <button className="w-full py-4 border border-primary/20 text-primary rounded-xl font-bold hover:bg-primary-container/5 transition-all">Support Case</button>
          </div>
        </div>
      </aside>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] transition-opacity duration-500 ${cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setCartOpen(false)}
      />
    </div>
  );
}
