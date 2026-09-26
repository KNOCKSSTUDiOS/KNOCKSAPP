/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Key,
  Cloud,
  CheckCircle,
  Copy,
  LogOut,
  LogIn,
  X,
  Sparkles,
  Lock,
  Database
} from 'lucide-react';
import { StudioBrandName } from './icons';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface EnterpriseAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onUpdateEmail: (newEmail: string) => void;
  onShowToast: (msg: string) => void;
}

export const EnterpriseAccountModal: React.FC<EnterpriseAccountModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onUpdateEmail,
  onShowToast,
}) => {
  const [emailInput, setEmailInput] = useState(userEmail);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email) {
        onUpdateEmail(user.email);
        setEmailInput(user.email);
      }
    });
    return () => unsubscribe();
  }, [onUpdateEmail]);

  if (!isOpen) return null;

  const licenseKey = 'KNX-PRO-9842-ENTERPRISE-RUST-4K-2026';

  const handleCopyLicense = async () => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
      onShowToast('Enterprise Master License Key copied!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email) {
        onUpdateEmail(result.user.email);
        setEmailInput(result.user.email);
        onShowToast(`Signed in as ${result.user.displayName || result.user.email}`);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      onShowToast('Sign-in failed. Check popup permissions.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onShowToast('Signed out of Firebase account');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const handleSaveEmail = () => {
    if (emailInput.trim()) {
      onUpdateEmail(emailInput.trim());
      setIsEditing(false);
      onShowToast(`Enterprise Account updated to ${emailInput.trim()}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#090D18] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#060810]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00E5FF] to-blue-600 flex items-center justify-center text-black font-bold">
              <User className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
                <span>Enterprise Studio Account</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 font-mono">
                  FIREBASE READY
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Authorized Executive Operator &bull; Cloud Persistence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* User Profile Card */}
          <div className="p-4 rounded-xl bg-[#05070E] border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Operator Identity</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                {currentUser ? 'GOOGLE AUTHENTICATED' : 'ENTERPRISE MASTER'}
              </span>
            </div>

            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-[#00E5FF]/40" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-cyan-900/60 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-white">{currentUser.displayName || currentUser.email}</div>
                    <div className="text-xs text-gray-400">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                />
                <button
                  onClick={handleSaveEmail}
                  className="px-3 py-1.5 rounded-lg bg-[#00E5FF] text-black font-bold text-xs hover:brightness-110 cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEmailInput(userEmail);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-xs hover:bg-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-white">{userEmail}</div>
                  <div className="text-xs text-gray-400">Studio Owner &bull; Technical Director</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-gray-900 font-semibold text-xs hover:bg-gray-100 transition-all cursor-pointer shadow"
                  >
                    <LogIn className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-[#00E5FF] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Studio Specifications & License */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">License &amp; Credentials</div>
            <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Studio Brand:</span>
                <StudioBrandName className="text-white text-xs" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Architecture:</span>
                <span className="text-[#00E5FF] font-bold">Windows Native Architecture</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Master License Key:</span>
                <button
                  onClick={handleCopyLicense}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  <span>{licenseKey.slice(0, 14)}...</span>
                  {copiedKey ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Cloud Sync:</span>
                <span className="text-blue-400 flex items-center gap-1">
                  <Cloud className="w-3 h-3" /> Firebase &amp; Google Drive
                </span>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800/80">
              <div className="text-gray-400 text-[11px] uppercase">Watermark DRM</div>
              <div className="text-emerald-400 font-bold mt-1 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Dynamic Hash Active
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800/80">
              <div className="text-gray-400 text-[11px] uppercase">Persistence Engine</div>
              <div className="text-amber-400 font-bold mt-1 flex items-center gap-1">
                <Database className="w-3.5 h-3.5" /> Firebase Firestore
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-800 bg-[#060810] flex items-center justify-between text-xs text-gray-500">
          <span className="text-[11px] font-mono text-gray-400">Enterprise Session #KNX-2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#00E5FF] text-black font-bold text-xs hover:brightness-110 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
