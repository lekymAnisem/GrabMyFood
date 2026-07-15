import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    setLocalError(null);
    try {
      await register(name, email, password);
      navigate('/orders');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-margin-mobile md:px-margin-desktop pt-20">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-8 shadow-xl border border-outline-variant/30">
        <div className="text-center mb-8">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Create Account</h1>
          <p className="text-on-surface-variant">Join Culinara for premium dining</p>
        </div>
        {(error || localError) && <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-4 text-sm">{localError || error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-label-md text-on-surface-variant block mb-1">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary transition-all" type="text" required />
          </div>
          <div>
            <label className="text-label-md text-on-surface-variant block mb-1">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary transition-all" type="email" required />
          </div>
          <div>
            <label className="text-label-md text-on-surface-variant block mb-1">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary transition-all" type="password" required />
          </div>
          <div>
            <label className="text-label-md text-on-surface-variant block mb-1">Confirm Password</label>
            <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary transition-all" type="password" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-md text-label-md shadow-lg hover:shadow-primary/20 active:scale-95 transition-all disabled:opacity-60">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-6 text-on-surface-variant text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
