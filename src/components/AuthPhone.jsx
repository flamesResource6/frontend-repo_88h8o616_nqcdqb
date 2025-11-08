import React, { useEffect, useRef, useState } from 'react';
import { auth, RecaptchaVerifier } from '../lib/firebase';
import { signInWithPhoneNumber, onAuthStateChanged, signOut } from 'firebase/auth';

export default function AuthPhone({ onAuthed }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phase, setPhase] = useState('phone'); // 'phone' | 'otp'
  const confirmationRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) onAuthed(u);
    });
    return () => unsub();
  }, [onAuthed]);

  const setupRecaptcha = () => {
    if (!auth) return;
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
    return recaptchaRef.current;
  };

  const requestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const verifier = setupRecaptcha();
      confirmationRef.current = await signInWithPhoneNumber(auth, phone, verifier);
      setPhase('otp');
    } catch (err) {
      setError(err?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await confirmationRef.current.confirm(otp);
      onAuthed(result.user);
    } catch (err) {
      setError(err?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  if (!auth) {
    return (
      <div className="text-white/70 text-sm">Firebase is not configured. Add your VITE_FIREBASE_* env vars.</div>
    );
  }

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-auto">
      <div id="recaptcha-container" />

      {phase === 'phone' && (
        <form onSubmit={requestOTP} className="space-y-4">
          <div>
            <label className="text-white/80 text-sm">Phone Number</label>
            <input
              type="tel"
              className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none"
              placeholder="+1 555 555 5555"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-4 py-2 font-semibold text-[#111111]"
            style={{ backgroundColor: '#00FFAA' }}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {phase === 'otp' && (
        <form onSubmit={verifyOTP} className="space-y-4">
          <div>
            <label className="text-white/80 text-sm">Enter OTP</label>
            <input
              type="text"
              className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-4 py-2 font-semibold text-[#111111]"
            style={{ backgroundColor: '#00FFAA' }}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={() => setPhase('phone')}
            className="w-full rounded-lg px-4 py-2 font-semibold text-[#111111]"
            style={{ backgroundColor: '#FF5555' }}
          >
            Back
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={() => signOut(auth)}
        className="mt-4 w-full rounded-lg px-4 py-2 font-semibold text-[#111111]"
        style={{ backgroundColor: '#FF5555' }}
      >
        Sign out
      </button>
    </div>
  );
}
