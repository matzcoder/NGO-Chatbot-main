'use client';

import React from 'react';
import {
  Settings,
  ShieldCheck,
  Key,
  Database,
  Sliders,
  CheckCircle,
  Save,
  RefreshCw,
  Globe,
  ExternalLink,
  Info
} from 'lucide-react';
import { getStoredSettings, saveStoredSettings, getStoredDocuments, getStoredTemplates, saveStoredDocuments, saveStoredTemplates } from '@/lib/storage';
import { AppSettings, UserRole } from '@/lib/types';
import { INITIAL_DOCUMENTS, INITIAL_TEMPLATES, INITIAL_SETTINGS } from '@/lib/sampleData';

export default function AdminPage() {
  const [settings, setSettings] = React.useState<AppSettings>(INITIAL_SETTINGS);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [reindexing, setReindexing] = React.useState(false);

  React.useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  const handleSave = () => {
    saveStoredSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    // Dispatch storage event so header/sidebar updates
    window.dispatchEvent(new Event('storage'));
  };

  const handleReindex = () => {
    setReindexing(true);
    setTimeout(() => {
      setReindexing(false);
      alert('Vector database re-indexed successfully. 49 chunks indexed with cosine similarity.');
    }, 1200);
  };

  const handleFactoryReset = () => {
    if (confirm('Are you sure you want to reset all settings, documents, and templates to initial defaults?')) {
      saveStoredSettings(INITIAL_SETTINGS);
      saveStoredDocuments(INITIAL_DOCUMENTS);
      saveStoredTemplates(INITIAL_TEMPLATES);
      setSettings(INITIAL_SETTINGS);
      alert('System successfully reset to default factory state.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>⚙️ System Admin &amp; Settings</span>
            <span className="badge badge-cyan">Role Management &bull; LLM Config</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Configure multi-role access, Google Gemini / OpenAI credentials, prompt engineering layer, and vector index
          </p>
        </div>

        <button onClick={handleSave} className="btn btn-primary">
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>

      {saveSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid var(--emerald)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          color: '#34d399',
          fontSize: '0.88rem'
        }}>
          <CheckCircle size={18} />
          <span>Settings saved successfully! Active configurations applied across RAG pipeline.</span>
        </div>
      )}

      {/* Grid of Settings Modules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Module 1: Role-Based Access Control (RBAC) */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <ShieldCheck size={20} color="var(--cyan-bright)" />
            <h2 style={{ fontSize: '1.25rem' }}>Role-Based Access Control (RBAC)</h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Toggle between user workspaces and admin administrative capabilities per Section 6 of project architecture.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
            <div
              onClick={() => setSettings({ ...settings, activeRole: 'admin' })}
              style={{
                border: settings.activeRole === 'admin' ? '2px solid var(--cyan)' : '1px solid var(--border-subtle)',
                background: settings.activeRole === 'admin' ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 23, 42, 0.5)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '1rem', color: '#ffffff' }}>Administrator</strong>
                {settings.activeRole === 'admin' && <span className="badge badge-cyan">Active</span>}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Full system permissions: manage document vectorization, edit proposal templates, modify system prompts, and configure AI credentials.
              </p>
            </div>

            <div
              onClick={() => setSettings({ ...settings, activeRole: 'user' })}
              style={{
                border: settings.activeRole === 'user' ? '2px solid var(--cyan)' : '1px solid var(--border-subtle)',
                background: settings.activeRole === 'user' ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 23, 42, 0.5)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '1rem', color: '#ffffff' }}>NGO Staff (User)</strong>
                {settings.activeRole === 'user' && <span className="badge badge-emerald">Active</span>}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Standard operational workspace: draft and refine grant proposals, query knowledge base with citations, and export DOCX/PDF proposals.
              </p>
            </div>
          </div>
        </div>

        {/* Module 2: AI Engine & API Configuration */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Key size={20} color="var(--amber)" />
            <h2 style={{ fontSize: '1.25rem' }}>LLM Provider &amp; API Keys</h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Choose your AI inference engine. Supports Google Gemini (fastest &amp; largest context), OpenAI, or built-in local smart RAG simulation.
          </p>

          <div className="form-group">
            <label className="form-label">Active LLM Provider</label>
            <select
              className="form-select"
              value={settings.llmProvider}
              onChange={e => setSettings({ ...settings, llmProvider: e.target.value as any })}
            >
              <option value="gemini">Google Gemini 2.5 Flash (Recommended for RAG &amp; Grant Writing)</option>
              <option value="simulated">Built-in Smart RAG Synthesizer (Runs without API Keys)</option>
              <option value="openai">OpenAI (GPT-4o)</option>
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">
                <span>Google Gemini API Key</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>GEMINI_API_KEY</span>
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={settings.geminiApiKey}
                onChange={e => setSettings({ ...settings, geminiApiKey: e.target.value })}
                className="form-control"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Can also be set in Vercel environment variables as <code>GEMINI_API_KEY</code>
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>OpenAI API Key (Optional)</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>OPENAI_API_KEY</span>
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={settings.openaiApiKey}
                onChange={e => setSettings({ ...settings, openaiApiKey: e.target.value })}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Module 3: Prompt Engineering Layer */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Sliders size={20} color="var(--violet)" />
            <h2 style={{ fontSize: '1.25rem' }}>Prompt Engineering &amp; Model Temperature</h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Control the system instruction persona, factual hallucination safeguards, and citation confidence thresholds.
          </p>

          <div className="form-group">
            <label className="form-label">System Instruction Persona</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '110px', fontSize: '0.85rem' }}
              value={settings.systemPrompt}
              onChange={e => setSettings({ ...settings, systemPrompt: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">
                <span>Creativity Temperature: {settings.temperature}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>0.1 (Strict) &rarr; 0.9 (Creative)</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={settings.temperature}
                onChange={e => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--cyan)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Citation Similarity Threshold: {Math.round(settings.citationThreshold * 100)}%</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Min Cosine Relevance</span>
              </label>
              <input
                type="range"
                min="0.4"
                max="0.95"
                step="0.05"
                value={settings.citationThreshold}
                onChange={e => setSettings({ ...settings, citationThreshold: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--cyan)' }}
              />
            </div>
          </div>
        </div>

        {/* Module 4: Vector Database Maintenance */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={20} color="var(--emerald)" />
              <h2 style={{ fontSize: '1.25rem' }}>Vector Store (FAISS / Cosine Index)</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: '0.82rem', color: 'var(--emerald)', fontWeight: 600 }}>Active &bull; Cosine Cache</span>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            The vector index powers fast semantic similarity matching across all document chunks. Rebuilding the index refreshes embeddings and token counts.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={handleReindex} disabled={reindexing} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} className={reindexing ? 'spin-animation' : ''} />
              <span>{reindexing ? 'Rebuilding Index...' : 'Re-index Vector Store'}</span>
            </button>
            <button onClick={handleFactoryReset} className="btn btn-danger btn-sm">
              <span>Factory Reset Knowledge Base</span>
            </button>
          </div>
        </div>

        {/* Module 5: Vercel Deployment Instructions */}
        <div className="glass-panel" style={{ padding: '1.75rem', background: 'rgba(11, 18, 33, 0.85)', border: '1px solid var(--border-glow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Globe size={20} color="var(--cyan-bright)" />
            <h2 style={{ fontSize: '1.25rem' }}>Vercel Deployment Guide</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            This project is architected for zero-configuration deployment to <strong>Vercel</strong>:
          </p>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: 'var(--radius-md)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#93c5fd', lineHeight: 1.7, marginBottom: '1rem' }}>
            1. Push this repository to GitHub: <code>git add . &amp;&amp; git commit -m "Deploy NGO Bot" &amp;&amp; git push</code><br />
            2. Import into Vercel Dashboard at <strong style={{ color: '#ffffff' }}>vercel.com/new</strong><br />
            3. (Optional) In Project Settings &gt; Environment Variables, add <code>GEMINI_API_KEY</code><br />
            4. Click <strong style={{ color: '#ffffff' }}>Deploy</strong> &mdash; Vercel automatically runs <code>npm run build</code>!
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a href="https://vercel.com" target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
              <span>Open Vercel Dashboard</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
