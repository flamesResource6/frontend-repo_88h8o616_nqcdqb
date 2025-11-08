import React, { useEffect, useState } from 'react';
import Hero3D from './components/Hero3D';
import TopNav from './components/TopNav';
import AuthPhone from './components/AuthPhone';
import Dashboard from './components/Dashboard';
import History from './components/History';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setSignedIn(!!u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[#111111] text-white font-inter">
      <Hero3D />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 pt-10">
        <div className="flex flex-col gap-6">
          <TopNav tab={tab} setTab={setTab} />

          <div className="flex items-center justify-between bg-black/40 backdrop-blur rounded-xl border border-white/5 px-4 py-3">
            <div className="text-white/80 text-sm">Phone Authentication</div>
            <AuthPhone onUser={(v) => setSignedIn(v)} />
          </div>

          {!ready ? (
            <div className="text-white/60">Loading...</div>
          ) : !signedIn ? (
            <div className="text-white/70">Sign in to start tracking your balance.</div>
          ) : tab === 'overview' ? (
            <Dashboard />
          ) : (
            <History />
          )}
        </div>
      </div>
    </div>
  );
}
