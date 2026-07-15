import { useState } from 'react';

export default function PaymentForm({ total, onSubmit }) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += digits[i];
    }
    return formatted;
  };

  const formatExpiry = (value) => {
    let digits = value.replace(/\D/g, '');
    if (digits.length >= 2) digits = digits.substring(0, 2) + '/' + digits.substring(2, 4);
    return digits;
  };

  const getMaskedNumber = () => {
    const digits = cardNumber.replace(/\D/g, '');
    let masked = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) masked += ' ';
      masked += i < digits.length ? digits[i] : '•';
    }
    return masked;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ cardName, cardNumber, cardExpiry, cardCvv, saveCard });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
      <div className="lg:col-span-7 space-y-stack-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
            <span className="font-label-md text-label-md uppercase tracking-wider">Secure Checkout</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Payment Method</h1>
          <p className="text-on-surface-variant font-body-md">Your transaction is encrypted and secure.</p>
        </div>
        <div className="bg-surface-container-lowest p-stack-lg rounded-[24px] shadow-sm border border-outline-variant/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Name on Card</label>
              <input value={cardName} onChange={e => setCardName(e.target.value)} className="w-full h-14 px-4 bg-surface-container-low rounded-xl border-1.5 border-transparent focus:border-primary transition-all font-body-md" placeholder="Jane Doe" required />
            </div>
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Card Number</label>
              <div className="relative">
                <input value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} className="w-full h-14 pl-4 pr-12 bg-surface-container-low rounded-xl border-1.5 border-transparent focus:border-primary transition-all font-body-md tracking-widest" maxLength={19} placeholder="0000 0000 0000 0000" required />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">credit_card</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant">Expiry Date</label>
                <input value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))} className="w-full h-14 px-4 bg-surface-container-low rounded-xl border-1.5 border-transparent focus:border-primary transition-all font-body-md" maxLength={5} placeholder="MM/YY" required />
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant">CVV</label>
                <div className="relative">
                  <input value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} className="w-full h-14 pl-4 pr-12 bg-surface-container-low rounded-xl border-1.5 border-transparent focus:border-primary transition-all font-body-md" maxLength={3} placeholder="•••" required type="password" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline cursor-help">help_outline</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2">
              <input checked={saveCard} onChange={e => setSaveCard(e.target.checked)} className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" id="saveCard" type="checkbox" />
              <label className="font-label-md text-label-md text-on-surface cursor-pointer" htmlFor="saveCard">Save this card for future gourmet orders</label>
            </div>
            <div className="pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <p className="text-on-surface-variant text-label-sm font-label-sm uppercase tracking-tight">Total Amount</p>
                <p className="text-headline-md font-headline-md text-on-surface">${(total || 0).toFixed(2)}</p>
              </div>
              <button type="submit" className="w-full sm:w-auto bg-primary text-on-primary px-10 py-4 rounded-xl font-headline-md sm:text-label-md button-hover-effect active:scale-95 transition-all flex items-center justify-center gap-2">
                Confirm & Pay
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[20px]">lock</span><span className="text-label-sm font-label-sm">SSL Secure</span></div>
          <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[20px]">verified_user</span><span className="text-label-sm font-label-sm">PCI Compliant</span></div>
          <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[20px]">speed</span><span className="text-label-sm font-label-sm">Instant Verification</span></div>
        </div>
      </div>
      <div className="lg:col-span-5 sticky top-32 space-y-gutter">
        <div className="relative perspective-1000 group">
          <div className="credit-card-gradient w-full aspect-[1.58/1] rounded-[24px] p-8 text-white shadow-2xl relative overflow-hidden transition-all duration-500 animate-float">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
            <div className="h-full flex flex-col justify-between relative z-10">
              <div className="flex justify-between items-start">
                <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-lg shadow-inner" />
                <span className="material-symbols-outlined text-4xl opacity-80">contactless</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-mono tracking-[0.15em] drop-shadow-md">{getMaskedNumber()}</p>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-tighter opacity-70">Card Holder</p>
                  <p className="font-label-md text-label-md uppercase tracking-wider">{cardName || 'JANE DOE'}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] uppercase tracking-tighter opacity-70">Expires</p>
                  <p className="font-label-md text-label-md">{cardExpiry || 'MM/YY'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-surface-container p-6 rounded-[24px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface">Truffle Risotto & Fine Wine</p>
              <p className="text-label-sm font-label-sm text-on-surface-variant">L'Atelier de Gourmet</p>
            </div>
          </div>
          <p className="font-bold text-primary">${(total || 0).toFixed(2)}</p>
        </div>
        <div className="glass-card p-6 rounded-[24px] space-y-4">
          <div className="flex justify-between text-on-surface-variant"><span className="font-body-md">Subtotal</span><span className="font-body-md">${((total || 0) - 12.5).toFixed(2)}</span></div>
          <div className="flex justify-between text-on-surface-variant"><span className="font-body-md">Delivery Fee</span><span className="font-body-md">$5.00</span></div>
          <div className="flex justify-between text-on-surface-variant"><span className="font-body-md">Service Fee</span><span className="font-body-md">$7.50</span></div>
          <div className="h-px bg-outline-variant/30 w-full" />
          <div className="flex justify-between items-baseline pt-2"><span className="font-headline-md text-headline-md">Total</span><span className="font-headline-lg text-headline-lg text-primary">${(total || 0).toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
