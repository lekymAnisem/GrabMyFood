import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email) console.log('Subscribe:', email);
  };

  return (
    <footer className="w-full py-stack-xl mt-stack-xl bg-surface-container-lowest border-t border-outline-variant/30">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col">
          <div className="font-headline-md text-headline-md text-on-surface mb-4">Culinara</div>
          <p className="text-on-surface-variant font-body-md text-body-md max-w-xs">Elevating your daily dining experience with artisanal food and premium delivery service.</p>
        </div>
        <div>
          <h5 className="text-primary font-bold text-label-md mb-6 uppercase tracking-wider">Company</h5>
          <ul className="space-y-4">
            <li><span className="text-on-surface-variant hover:text-on-surface hover:underline decoration-primary/30 transition-all text-body-md font-body-md cursor-pointer">About Us</span></li>
            <li><span className="text-on-surface-variant hover:text-on-surface hover:underline decoration-primary/30 transition-all text-body-md font-body-md cursor-pointer">Press Center</span></li>
            <li><span className="text-on-surface-variant hover:text-on-surface hover:underline decoration-primary/30 transition-all text-body-md font-body-md cursor-pointer">Global Locations</span></li>
          </ul>
        </div>
        <div>
          <h5 className="text-primary font-bold text-label-md mb-6 uppercase tracking-wider">Support</h5>
          <ul className="space-y-4">
            <li><span className="text-on-surface-variant hover:text-on-surface hover:underline decoration-primary/30 transition-all text-body-md font-body-md cursor-pointer">Contact Support</span></li>
            <li><span className="text-on-surface-variant hover:text-on-surface hover:underline decoration-primary/30 transition-all text-body-md font-body-md cursor-pointer">Terms of Service</span></li>
            <li><span className="text-on-surface-variant hover:text-on-surface hover:underline decoration-primary/30 transition-all text-body-md font-body-md cursor-pointer">Privacy Policy</span></li>
          </ul>
        </div>
        <div>
          <h5 className="text-primary font-bold text-label-md mb-6 uppercase tracking-wider">Subscribe</h5>
          <p className="text-on-surface-variant text-label-sm mb-4">Get the freshest food news and offers.</p>
          <div className="flex flex-col gap-2">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary"
              placeholder="email@example.com"
              type="email"
            />
            <button onClick={handleSubscribe} className="bg-primary text-on-primary rounded-xl py-3 font-label-md transition-transform active:scale-95">Join Newsletter</button>
          </div>
        </div>
      </div>
      <div className="px-margin-desktop max-w-container-max mx-auto mt-stack-xl pt-8 border-t border-outline-variant/10 text-center">
        <p className="text-on-surface-variant font-label-sm text-label-sm">© 2024 Culinara Premium. All rights reserved.</p>
      </div>
    </footer>
  );
}
