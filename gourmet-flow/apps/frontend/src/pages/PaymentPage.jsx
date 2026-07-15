import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import { useCart } from '../hooks/useCart';

export default function PaymentPage() {
  const { total } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handlePayment = async (paymentData) => {
    setSubmitting(true);
    console.log('Processing payment:', paymentData);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    navigate('/orders/1/tracking');
  };

  return (
    <div className="pt-32 pb-stack-xl px-4 md:px-margin-desktop max-w-container-max mx-auto">
      <PaymentForm total={total || 124.50} onSubmit={handlePayment} />
      {submitting && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center">
          <div className="bg-surface p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl">
            <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
            <p className="font-label-md text-on-surface">Processing payment...</p>
          </div>
        </div>
      )}
    </div>
  );
}
