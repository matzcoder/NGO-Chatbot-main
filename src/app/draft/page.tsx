'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  FileText,
  Save,
  Download,
  RefreshCw,
  Sliders,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  BookOpen,
  DollarSign,
  Calendar,
  MapPin,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import {
  getStoredProposals,
  saveStoredProposals,
  getStoredTemplates,
  getStoredDocuments,
  getStoredSettings
} from '@/lib/storage';
import { NGOProposal, ProposalSection, ProposalTemplate } from '@/lib/types';
import { downloadProposalDocx, downloadProposalPdf } from '@/lib/exportUtils';

function DraftingWorkspace() {
  const searchParams = useSearchParams();
  const proposalId = searchParams.get('id');

  const [proposals, setProposals] = React.useState<NGOProposal[]>([]);
  const [activeProposal, setActiveProposal] = React.useState<NGOProposal | null>(null);
  const [activeSectionKey, setActiveSectionKey] = React.useState<string>('executive_summary');
  const [templates, setTemplates] = React.useState<ProposalTemplate[]>([]);

  // Generation Controls
  const [tone, setTone] = React.useState<string>('persuasive');
  const [customPrompt, setCustomPrompt] = React.useState<string>('');
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);

  React.useEffect(() => {
    const loadedProposals = getStoredProposals();
    const loadedTemplates = getStoredTemplates();
    setProposals(loadedProposals);
    setTemplates(loadedTemplates);

    if (proposalId) {
      const match = loadedProposals.find(p => p.id === proposalId);
      if (match) {
        setActiveProposal(match);
        if (match.sections.length > 0) {
          setActiveSectionKey(match.sections[0].key);
        }
        return;
      }
    }

    if (loadedProposals.length > 0) {
      setActiveProposal(loadedProposals[0]);
      if (loadedProposals[0].sections.length > 0) {
        setActiveSectionKey(loadedProposals[0].sections[0].key);
      }
    }
  }, [proposalId]);

  const activeSection = activeProposal?.sections.find(s => s.key === activeSectionKey) || activeProposal?.sections[0];

  const handleUpdateSectionContent = (newContent: string) => {
    if (!activeProposal || !activeSection) return;

    const updatedSections = activeProposal.sections.map(s => {
      if (s.key === activeSection.key) {
        return {
          ...s,
          content: newContent,
          wordCount: newContent.trim().split(/\s+/).filter(Boolean).length,
          status: (newContent.trim().length > 50 ? 'drafted' : 'empty') as ProposalSection['status'],
          lastUpdated: new Date().toISOString()
        };
      }
      return s;
    });

    const totalWords = updatedSections.reduce((acc, s) => acc + s.wordCount, 0);

    const updatedProposal: NGOProposal = {
      ...activeProposal,
      sections: updatedSections,
      totalWordCount: totalWords,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setActiveProposal(updatedProposal);

    const allUpdated = proposals.map(p => (p.id === updatedProposal.id ? updatedProposal : p));
    setProposals(allUpdated);
    saveStoredProposals(allUpdated);
  };

  const handleGenerateSection = async () => {
    if (!activeProposal || !activeSection || isGenerating) return;

    setIsGenerating(true);
    try {
      const docs = getStoredDocuments();
      const settings = getStoredSettings();

      const res = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalTitle: activeProposal.title,
          targetDonor: activeProposal.targetDonor,
          sector: activeProposal.sector,
          requestedAmount: activeProposal.requestedAmount,
          durationMonths: activeProposal.durationMonths,
          targetRegion: activeProposal.targetRegion,
          sectionKey: activeSection.key,
          sectionTitle: activeSection.title,
          tone,
          customPrompt,
          documents: docs,
          apiKey: settings.geminiApiKey,
          provider: settings.llmProvider
        })
      });

      if (!res.ok) {
        throw new Error('Drafting API request failed');
      }

      const data = await res.json();

      const updatedSections = activeProposal.sections.map(s => {
        if (s.key === activeSection.key) {
          return {
            ...s,
            content: data.content,
            wordCount: data.wordCount || data.content.trim().split(/\s+/).length,
            status: 'drafted' as ProposalSection['status'],
            citations: data.citations || [],
            lastUpdated: new Date().toISOString()
          };
        }
        return s;
      });

      const totalWords = updatedSections.reduce((acc, s) => acc + s.wordCount, 0);

      const updatedProposal: NGOProposal = {
        ...activeProposal,
        sections: updatedSections,
        totalWordCount: totalWords,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      setActiveProposal(updatedProposal);

      const allUpdated = proposals.map(p => (p.id === updatedProposal.id ? updatedProposal : p));
      setProposals(allUpdated);
      saveStoredProposals(allUpdated);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error generating section:', err);
      alert('Generation error: ' + (err.message || 'Check connection'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySection = () => {
    if (!activeSection?.content) return;
    navigator.clipboard.writeText(activeSection.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateNewProposal = () => {
    const defaultTemplate = templates[0];
    const newId = `prop-${Date.now()}`;
    const newProposal: NGOProposal = {
      id: newId,
      title: 'New Grant Proposal Initiative',
      targetDonor: defaultTemplate ? defaultTemplate.donorName : 'USAID',
      donorCategory: defaultTemplate ? defaultTemplate.category : 'Multilateral',
      sector: 'Community Livelihoods & Resilience',
      requestedAmount: '$500,000',
      currency: 'USD',
      durationMonths: 24,
      targetRegion: 'Sub-Saharan Region',
      templateId: defaultTemplate ? defaultTemplate.id : 'tpl-usaid',
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      totalWordCount: 0,
      tags: ['New Grant', 'RAG Draft'],
      sections: (defaultTemplate?.defaultSections || []).map((sec, i) => ({
        id: `sec-${newId}-${i}`,
        key: sec.key,
        title: sec.title,
        description: sec.description,
        content: '',
        status: 'empty',
        wordCount: 0
      }))
    };

    const updated = [newProposal, ...proposals];
    setProposals(updated);
    setActiveProposal(newProposal);
    setActiveSectionKey(newProposal.sections[0]?.key || 'executive_summary');
    saveStoredProposals(updated);
  };

  if (!activeProposal || !activeSection) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h2>Loading Proposal Workspace...</h2>
      </div>
    );
  }

  const completedSections = activeProposal.sections.filter(s => s.status === 'drafted' || s.status === 'approved').length;
  const progressPct = Math.round((completedSections / activeProposal.sections.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Proposal Header Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-cyan">{activeProposal.targetDonor}</span>
            <span className="badge badge-blue">{activeProposal.sector}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Total Words: <strong>{activeProposal.totalWordCount}</strong>
            </span>
          </div>

          <input
            type="text"
            value={activeProposal.title}
            onChange={e => {
              const updated = { ...activeProposal, title: e.target.value };
              setActiveProposal(updated);
              const all = proposals.map(p => (p.id === updated.id ? updated : p));
              setProposals(all);
              saveStoredProposals(all);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#ffffff',
              fontFamily: 'Outfit, sans-serif',
              width: '100%',
              outline: 'none',
              padding: '0.1rem 0'
            }}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button onClick={handleCreateNewProposal} className="btn btn-secondary btn-sm">
            <span>+ New Draft</span>
          </button>
          <button onClick={() => downloadProposalDocx(activeProposal)} className="btn btn-secondary btn-sm" title="Export DOCX">
            <Download size={14} />
            <span>DOCX</span>
          </button>
          <button onClick={() => downloadProposalPdf(activeProposal)} className="btn btn-secondary btn-sm" title="Export PDF">
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Sections Drawer, Middle Editor, Right AI Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Sections List & Progress */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              <span>Progress ({completedSections}/{activeProposal.sections.length})</span>
              <strong style={{ color: 'var(--cyan-bright)' }}>{progressPct}%</strong>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--grad-accent)', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
            PROPOSAL SECTIONS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {activeProposal.sections.map((sec, idx) => {
              const isSelected = sec.key === activeSectionKey;
              const isDrafted = sec.status === 'drafted' || sec.status === 'approved';

              return (
                <button
                  key={sec.key}
                  onClick={() => setActiveSectionKey(sec.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(37, 99, 235, 0.25)' : 'rgba(15, 23, 42, 0.4)',
                    border: isSelected ? '1px solid var(--border-glow)' : '1px solid transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                    <span style={{ fontSize: '0.72rem', color: isSelected ? 'var(--cyan-bright)' : 'var(--text-muted)' }}>
                      {idx + 1}.
                    </span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sec.title}
                    </span>
                  </div>
                  {isDrafted && <CheckCircle size={14} color="var(--emerald)" style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Column: Live Editor */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
                {activeSection.title}
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {activeSection.description}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {activeSection.wordCount || 0} words
              </span>
              <button
                onClick={handleCopySection}
                className="btn btn-secondary btn-sm"
                title="Copy section markdown"
              >
                {copied ? <Check size={13} color="var(--emerald)" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Section Citations badge if any */}
          {activeSection.citations && activeSection.citations.length > 0 && (
            <div style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.85rem'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--cyan-bright)', fontWeight: 600, marginBottom: '0.3rem' }}>
                GROUNDED IN ORGANIZATIONAL KNOWLEDGE:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {activeSection.citations.map((c, i) => (
                  <span key={i} className="citation-pill" style={{ cursor: 'default' }}>
                    <BookOpen size={11} />
                    <span>{c.documentTitle} (p.{c.page || 1})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Textarea Editor */}
          <textarea
            className="form-textarea"
            style={{
              minHeight: '380px',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              fontSize: '0.92rem',
              padding: '1rem'
            }}
            placeholder="Type or click 'Generate with AI & RAG' on the right to synthesize this section..."
            value={activeSection.content}
            onChange={e => handleUpdateSectionContent(e.target.value)}
          />

          {saveSuccess && (
            <div style={{ fontSize: '0.8rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle size={14} />
              <span>Section drafted & saved with organizational citations!</span>
            </div>
          )}
        </div>

        {/* Right Column: AI Generator & Tone Parameters */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cyan-bright)', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.3rem' }}>
              <Sparkles size={16} />
              <span>AI Section Synthesizer</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Injects relevant excerpts from indexed documents and tailors to donor formatting.
            </p>
          </div>

          {/* Tone Selector */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <span>Writing Tone</span>
              <Sliders size={13} />
            </label>
            <select
              className="form-select"
              value={tone}
              onChange={e => setTone(e.target.value)}
            >
              <option value="persuasive">Persuasive & Impactful</option>
              <option value="formal">Formal & Bilateral Standard</option>
              <option value="data-driven">Data-Driven & Quantified</option>
              <option value="donor-aligned">Strict Donor Compliance</option>
            </select>
          </div>

          {/* Custom Instruction Box */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <span>Custom Refinement Instruction</span>
              <HelpCircle size={13} title="E.g. Emphasize women leadership quotas" />
            </label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '75px', fontSize: '0.82rem' }}
              placeholder="e.g. Highlight community co-financing and reduce technical jargon..."
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateSection}
            disabled={isGenerating}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem' }}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="spin-animation" />
                <span>Synthesizing RAG Context...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>{activeSection.content ? 'Regenerate Section' : 'Generate with AI & RAG'}</span>
              </>
            )}
          </button>

          {/* Proposal Parameters Card */}
          <div style={{
            background: 'rgba(11, 18, 33, 0.7)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            fontSize: '0.78rem'
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>GRANT PARAMETERS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <DollarSign size={14} color="var(--emerald)" />
              <span>Budget: {activeProposal.requestedAmount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Calendar size={14} color="var(--cyan-bright)" />
              <span>Duration: {activeProposal.durationMonths} Months</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <MapPin size={14} color="var(--amber)" />
              <span>Region: {activeProposal.targetRegion}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DraftingPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem 1rem' }}><h2>Loading Proposal Workspace...</h2></div>}>
      <DraftingWorkspace />
    </Suspense>
  );
}
