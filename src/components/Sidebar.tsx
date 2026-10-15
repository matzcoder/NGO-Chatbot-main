'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  FileEdit,
  FolderOpen,
  Layers,
  Download,
  Settings,
  Sparkles,
  ShieldCheck,
  Database
} from 'lucide-react';
import { getStoredSettings } from '@/lib/storage';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [settings, setSettings] = React.useState({ activeRole: 'admin', vectorDbStatus: 'online' });

  React.useEffect(() => {
    setSettings(getStoredSettings());
    const interval = setInterval(() => {
      setSettings(getStoredSettings());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'AI Knowledge Chat', href: '/chat', icon: MessageSquare, badge: 'RAG' },
    { label: 'Proposal Drafting', href: '/draft', icon: FileEdit },
    { label: 'Document Center', href: '/documents', icon: FolderOpen },
    { label: 'Donor Templates', href: '/templates', icon: Layers },
    { label: 'Export Center', href: '/export', icon: Download },
    { label: 'Admin & Settings', href: '/admin', icon: Settings, adminOnly: true }
  ];

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-cyan)'
          }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
              NGO Proposal Bot
            </h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--cyan-bright)', fontWeight: 500 }}>
              GenAI RAG Intelligence
            </p>
          </div>
        </div>

        {/* Role Badge */}
        <div style={{
          marginTop: '0.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '0.35rem 0.65rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} color="var(--cyan-bright)" />
            Role:
          </span>
          <span className={`badge ${settings.activeRole === 'admin' ? 'badge-cyan' : 'badge-emerald'}`} style={{ textTransform: 'capitalize' }}>
            {settings.activeRole}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '1.25rem 0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        overflowY: 'auto'
      }}>
        <div style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          fontWeight: 600,
          padding: '0 0.5rem 0.4rem 0.5rem'
        }}>
          Core Platform
        </div>

        {navItems.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'rgba(37, 99, 235, 0.18)' : 'transparent',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.88rem',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isActive ? 'var(--cyan-bright)' : 'currentColor'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Quick Action Button */}
        <div style={{ marginTop: '1.5rem', padding: '0 0.25rem' }}>
          <Link
            href="/draft"
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '0.82rem', padding: '0.6rem 0.8rem' }}
          >
            <Sparkles size={16} />
            <span>New Proposal</span>
          </Link>
        </div>
      </nav>

      {/* System Status Footer */}
      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(11, 18, 33, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Database size={13} />
            Vector DB
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: '0.75rem', color: 'var(--emerald)', fontWeight: 600 }}>Indexed</span>
          </div>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          RAG Engine: <strong style={{ color: 'var(--cyan-bright)' }}>Online (FAISS/Cosine)</strong>
        </div>
      </div>
    </aside>
  );
};
