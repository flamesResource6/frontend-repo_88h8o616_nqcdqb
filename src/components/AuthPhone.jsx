import React, { useEffect, useRef, useState } from 'react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut } from 'firebase/auth';

export default function AuthPhone({ onUser }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      onUser?.(!!u);
    });
    return () => unsub();
  }, [onUser]);

  const ensureRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
    return window.recaptchaVerifier;
  };

  const startLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const verifier = ensureRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmation(confirmationResult);
    } catch (err) {
      alert(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!confirmation) return;
    try {
      setLoading(true);
      await confirmation.confirm(otp);
      setOtp('');
    } catch (err) {
      alert(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const doSignOut = async () => {
    await signOut(auth);
    setConfirmation(null);
  };

  return (
    <div className="w-full">
      <div id="recaptcha-container" ref={recaptchaRef} />

      {!user && (
        <form onSubmit={confirmation ? verifyOtp : startLogin} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +15555555555"
            className="flex-1 bg-white/5 text-white placeholder-white/40 rounded-lg px-4 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          {confirmation && (
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="flex-1 bg-white/5 text-white placeholder-white/40 rounded-lg px-4 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-white text-black font-semibold border border-white disabled:opacity-60"
          >
            {confirmation ? (loading ? 'Verifying...' : 'Verify') : (loading ? 'Sending...' : 'Sign in')}
          </button>
        </form>
      )}

      {user && (
        <div className="flex items-center gap-3">
          <div className="text-white/80 text-sm">Signed in as {user.phoneNumber}</div>
          <button onClick={doSignOut} className="text-sm px-3 py-1.5 rounded-md bg-white/10 text-white hover:bg-white/20 border border-white/10">Sign out</button>
        </div>
      )}
    </div>
  );
}
