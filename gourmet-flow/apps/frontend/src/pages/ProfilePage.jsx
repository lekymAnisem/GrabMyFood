import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    console.log('Saving profile:', { name, email });
    setEditing(false);
  };

  return (
    <div className="pt-32 pb-stack-xl px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">My Profile</h1>
          <button onClick={() => { if (editing) handleSave(); setEditing(!editing); }} className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-md">
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-4xl">person</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">{user?.name || 'User'}</h2>
              <p className="text-on-surface-variant">{user?.email || ''}</p>
            </div>
          </div>
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-label-md text-on-surface-variant block mb-1">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary" type="text" />
              </div>
              <div>
                <label className="text-label-md text-on-surface-variant block mb-1">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary" type="email" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-outline-variant/10"><span className="text-on-surface-variant">Name</span><span className="font-medium">{user?.name}</span></div>
              <div className="flex justify-between py-3 border-b border-outline-variant/10"><span className="text-on-surface-variant">Email</span><span className="font-medium">{user?.email}</span></div>
            </div>
          )}
        </div>
        <div className="mt-8 bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Saved Addresses</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-secondary-container text-primary text-label-sm font-label-sm px-2 py-0.5 rounded-full">Home</span>
              </div>
              <p className="font-medium">Via del Corso 12, Rome</p>
              <p className="text-on-surface-variant text-sm">Interior 4B, 3rd Floor</p>
            </div>
            <div className="p-4 rounded-xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-surface-container-high text-on-surface-variant text-label-sm font-label-sm px-2 py-0.5 rounded-full">Office</span>
              </div>
              <p className="font-medium">Piazza Navona 44, Rome</p>
              <p className="text-on-surface-variant text-sm">Global Innovations Hub</p>
            </div>
          </div>
        </div>
        <button onClick={logout} className="mt-8 w-full py-4 border border-error text-error rounded-xl font-label-md hover:bg-error-container/20 transition-all">
          Sign Out
        </button>
      </div>
    </div>
  );
}
