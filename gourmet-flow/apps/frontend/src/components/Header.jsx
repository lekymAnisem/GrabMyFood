import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-primary/10 transition-all duration-300 ${scrolled ? 'shadow-md h-16' : 'shadow-sm h-20'}`}>
      <div className="flex justify-between items-center h-full px-margin-desktop max-w-container-max mx-auto">
        <div className="flex items-center gap-stack-xl">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">Culinara</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-primary font-bold border-b-2 border-primary py-2 font-label-md text-label-md">Offers</Link>
            <span className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md cursor-pointer">Partners</span>
            <span className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md cursor-pointer">Corporate</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary">language</span>
            <span className="text-label-md font-label-md">EN</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <button onClick={logout} className="text-primary font-label-md text-label-md hover:bg-primary-container/10 px-4 py-2 rounded-xl transition-all">Logout</button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-primary font-label-md text-label-md hover:bg-primary-container/10 px-4 py-2 rounded-xl transition-all">Log In</button>
                <button onClick={() => navigate('/register')} className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-xl shadow-lg hover:shadow-primary/20 active:scale-95 transition-all">Sign Up</button>
              </>
            )}
          </div>
          <Link to="/cart" className="relative p-2 text-on-surface-variant hover:bg-primary-container/10 rounded-full transition-all">
            <span className="material-symbols-outlined">shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{itemCount}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
