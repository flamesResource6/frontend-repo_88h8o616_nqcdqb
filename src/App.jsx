import React, { useState } from 'react';
import Hero3D from './components/Hero3D';
import AuthPhone from './components/AuthPhone';
import Dashboard from './components/Dashboard';
import History from './components/History';
import TopNav from './components/TopNav';

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('overview');

  const authed = Boolean(user);

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <Hero3D />

        {!authed ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-white/80 text-center">
              Sign in with your phone to sync income and expenses securely.
            </p>
            <AuthPhone onAuthed={(u) => { setUser(u); setTab('overview'); }} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">Welcome, {user.phoneNumber || 'User'}</div>
              <TopNav value={tab} onChange={setTab} />
            </div>

            {tab === 'overview' && <Dashboard user={user} />}
            {tab === 'history' && <History user={user} />}
          </div>
        )}
      </div>
    </div>
  );
}
