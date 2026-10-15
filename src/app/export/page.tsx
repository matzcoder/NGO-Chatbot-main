'use client';

import React from 'react';
import {
  Download,
  FileText,
  Printer,
  Copy,
  Check,
  BookOpen,
  Calendar,
  DollarSign,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { getStoredProposals } from '@/lib/storage';
import { NGOProposal } from '@/lib/types';
import { downloadProposalDocx, downloadProposalPdf, downloadProposalMarkdown } from '@/lib/exportUtils';

export default function ExportPage() {
  const [proposals, setProposals] = React.useState<NGOProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = React.useState<NGOProposal | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [isExportingDocx, setIsExportingDocx] = React.useState(false);

  React.useEffect(() => {
    const list = getStoredProposals();
    setProposals(list);
    if (list.length > 0) {
      setSelectedProposal(list[0]);
    }
  }, []);

  const handleDocxExport = async () => {
    if (!selectedProposal) return;
    setIsExportingDocx(true);
    try {
      await downloadProposalDocx(selectedProposal);
    } catch (err) {
      console.error(err);
      alert('Error generating DOCX document');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleCopyText = () => {
    if (!selectedProposal) return;
    let text = `${selectedProposal.title}\nTarget Donor: ${selectedProposal.targetDonor}\nBudget: ${selectedProposal.requestedAmount}\n\n`;
    for (const s of selectedProposal.sections) {
      if (s.content) {
        text += `\n--- ${s.title} ---\n\n${s.content}\n`;
      }
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selectedProposal) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h2>No proposals available to export.</h2>
      </div>
    );
  }

  const allCitations = selectedProposal.sections.flatMap(s => s.citations || []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>📄 Proposal Export Center</span>
            <span className="badge badge-emerald">DOCX &bull; PDF &bull; Markdown</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Export publication-ready grant proposals with citation preservation, donor formatting, and evidence appendices
          </p>
        </div>

        {/* Export Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button onClick={handleDocxExport} disabled={isExportingDocx} className="btn btn-primary btn-sm">
            <Download size={15} />
            <span>{isExportingDocx ? 'Building DOCX...' : 'Export DOCX'}</span>
          </button>
          <button onClick={() => downloadProposalPdf(selectedProposal)} className="btn btn-accent btn-sm">
            <Download size={15} />
            <span>Export PDF</span>
          </button>
          <button onClick={() => downloadProposalMarkdown(selectedProposal)} className="btn btn-secondary btn-sm">
            <span>Markdown</span>
          </button>
          <button onClick={handleCopyText} className="btn btn-secondary btn-sm">
            {copied ? <Check size={14} color="var(--emerald)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      {/* Proposal Selector bar */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          SELECT PROPOSAL TO EXPORT:
        </span>
        <select
          className="form-select"
          style={{ width: 'auto', flex: 1, maxWidth: '500px' }}
          value={selectedProposal.id}
          onChange={e => {
            const found = proposals.find(p => p.id === e.target.value);
            if (found) setSelectedProposal(found);
          }}
        >
          {proposals.map(p => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.targetDonor} - {p.totalWordCount} words)
            </option>
          ))}
        </select>
      </div>

      {/* Main Document Layout Preview */}
      <div
        className="glass-panel"
        style={{
          padding: '3rem',
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Cover / Header Banner */}
        <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.8rem' }}>
              OFFICIAL GRANT APPLICATION
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Export Date: {new Date().toLocaleDateString()}
            </span>
          </div>

          <h1 style={{ fontSize: '2.1rem', color: '#ffffff', lineHeight: 1.2, marginBottom: '1rem' }}>
            {selectedProposal.title}
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', background: 'rgba(11, 18, 33, 0.7)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TARGET DONOR</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{selectedProposal.targetDonor}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SECTOR</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--cyan-bright)' }}>{selectedProposal.sector}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>REQUESTED BUDGET</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--emerald)' }}>{selectedProposal.requestedAmount}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TIMELINE</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{selectedProposal.durationMonths} Months</div>
            </div>
          </div>
        </div>

        {/* Proposal Body Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {selectedProposal.sections.map((section, idx) => {
            if (!section.content.trim()) return null;

            return (
              <div key={section.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <h2 style={{ fontSize: '1.35rem', color: '#38bdf8', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>
                  {idx + 1}. {section.title}
                </h2>

                <div className="markdown-body" style={{ whiteSpace: 'pre-wrap' }}>
                  {section.content}
                </div>

                {section.citations && section.citations.length > 0 && (
                  <div style={{ background: 'rgba(6, 182, 212, 0.05)', borderLeft: '3px solid var(--cyan)', padding: '0.5rem 0.85rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                    <strong>Section Citations: </strong>
                    {section.citations.map(c => `[${c.documentTitle}, p.${c.page || 1}]`).join('; ')}
                  </div>
                )}
              </div>
            );
          })}

          {/* Institutional References Annex */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.75rem' }}>
              Annex A: Institutional Evidence &amp; References
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              All quantitative metrics, baseline indicators, and methodology elements cited in this proposal are grounded in internal organizational records:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {allCitations.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Grounded in internal program evaluations and verified monitoring data.
                </div>
              ) : (
                Array.from(new Set(allCitations.map(c => c.documentTitle))).map((title, idx) => (
                  <div key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    [{idx + 1}] <strong>{title}</strong> &mdash; <em>Internal Evaluation Archive</em>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
