import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/orders');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-margin-mobile md:px-margin-desktop pt-20">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-8 shadow-xl border border-outline-variant/30">
        <div className="text-center mb-8">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Welcome Back</h1>
          <p className="text-on-surface-variant">Sign in to your Culinara account</p>
        </div>
        {error && <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-label-md text-on-surface-variant block mb-1">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary transition-all" type="email" required />
          </div>
          <div>
            <label className="text-label-md text-on-surface-variant block mb-1">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary transition-all" type="password" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-md text-label-md shadow-lg hover:shadow-primary/20 active:scale-95 transition-all disabled:opacity-60">
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>
        <p className="text-center mt-6 text-on-surface-variant text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
