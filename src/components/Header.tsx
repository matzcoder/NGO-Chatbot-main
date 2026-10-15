'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe,
  Key,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Check
} from 'lucide-react';
import { getStoredSettings, saveStoredSettings } from '@/lib/storage';
import { UserRole } from '@/lib/types';

export const Header: React.FC = () => {
  const [role, setRole] = React.useState<UserRole>('admin');
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);
  const [provider, setProvider] = React.useState('simulated');

  React.useEffect(() => {
    const s = getStoredSettings();
    setRole(s.activeRole);
    setProvider(s.llmProvider);
  }, []);

  const switchRole = (newRole: UserRole) => {
    const s = getStoredSettings();
    s.activeRole = newRole;
    saveStoredSettings(s);
    setRole(newRole);
    setShowRoleMenu(false);
    // Notify window
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <header style={{
      height: '65px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(11, 17, 32, 0.75)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2.5rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Left Breadcrumb/Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Globe size={15} color="var(--cyan-bright)" />
          <span>Vercel Serverless Ready</span>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>GenAI RAG Platform</span>
        </div>

        <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
          Production Ready
        </span>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Quick API Key / Mode pill */}
        <Link
          href="/admin"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(30, 41, 59, 0.6)',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Key size={13} color="var(--amber)" />
          <span>AI Engine:</span>
          <strong style={{ color: 'var(--cyan-bright)', textTransform: 'capitalize' }}>
            {provider}
          </strong>
        </Link>

        {/* Role Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-subtle)',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            <Shield size={14} color="var(--cyan-bright)" />
            <span style={{ textTransform: 'capitalize' }}>Role: {role}</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showRoleMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '115%',
              width: '190px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glow)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '0.5rem',
              zIndex: 100,
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0.3rem 0.6rem', fontWeight: 600 }}>
                SELECT ACTIVE ROLE
              </div>
              <button
                onClick={() => switchRole('admin')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: role === 'admin' ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                  border: 'none',
                  color: role === 'admin' ? 'var(--cyan-bright)' : 'var(--text-primary)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>Administrator</span>
                {role === 'admin' && <Check size={14} />}
              </button>
              <button
                onClick={() => switchRole('user')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: role === 'user' ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                  border: 'none',
                  color: role === 'user' ? 'var(--cyan-bright)' : 'var(--text-primary)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>NGO Staff (User)</span>
                {role === 'user' && <Check size={14} />}
              </button>
            </div>
          )}
        </div>

        {/* Documentation link */}
        <Link
          href="https://github.com"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            textDecoration: 'none'
          }}
          title="Project Docs"
        >
          <HelpCircle size={18} />
        </Link>
      </div>
    </header>
  );
};
