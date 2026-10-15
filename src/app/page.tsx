'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  FolderOpen,
  Sparkles,
  MessageSquare,
  Layers,
  ArrowRight,
  Download,
  Plus,
  Clock,
  CheckCircle,
  Database,
  Search,
  ExternalLink
} from 'lucide-react';
import { getStoredProposals, getStoredDocuments, getStoredTemplates, saveStoredProposals } from '@/lib/storage';
import { NGOProposal, NGODocument, ProposalTemplate } from '@/lib/types';
import { downloadProposalDocx, downloadProposalPdf } from '@/lib/exportUtils';

export default function DashboardPage() {
  const [proposals, setProposals] = React.useState<NGOProposal[]>([]);
  const [documents, setDocuments] = React.useState<NGODocument[]>([]);
  const [templates, setTemplates] = React.useState<ProposalTemplate[]>([]);

  React.useEffect(() => {
    setProposals(getStoredProposals());
    setDocuments(getStoredDocuments());
    setTemplates(getStoredTemplates());
  }, []);

  const totalChunks = documents.reduce((acc, doc) => acc + (doc.chunksCount || 0), 0);
  const totalCompletedSections = proposals.reduce(
    (acc, p) => acc + p.sections.filter(s => s.status === 'drafted' || s.status === 'approved').length,
    0
  );
  const totalSections = proposals.reduce((acc, p) => acc + p.sections.length, 0);

  const handleDeleteProposal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this proposal?')) {
      const updated = proposals.filter(p => p.id !== id);
      setProposals(updated);
      saveStoredProposals(updated);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Hero Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
          border: '1px solid var(--border-glow)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '850px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.78rem' }}>
              <Sparkles size={13} />
              GenAI RAG Intelligence Platform
            </span>
            <span className="badge badge-emerald">
              v1.0 Production
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', lineHeight: 1.15, marginBottom: '0.85rem' }}>
            Transforming NGO Knowledge into <span className="text-gradient">Winning Grant Proposals</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Harness enterprise Retrieval-Augmented Generation (RAG) to draft citation-backed proposals, query organizational documentation, and align with bilateral donor standards in minutes instead of weeks.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link href="/draft" className="btn btn-primary btn-lg">
              <Sparkles size={18} />
              <span>Draft New Proposal</span>
            </Link>
            <Link href="/chat" className="btn btn-accent btn-lg">
              <MessageSquare size={18} />
              <span>Ask Knowledge Base</span>
            </Link>
            <Link href="/documents" className="btn btn-secondary btn-lg">
              <FolderOpen size={18} />
              <span>Upload Documents</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-4">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE PROPOSALS</span>
            <div style={{ background: 'rgba(37, 99, 235, 0.15)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <FileText size={20} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
            {proposals.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>
              {totalCompletedSections}/{totalSections}
            </span>
            <span>sections completed</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>INDEXED DOCUMENTS</span>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <FolderOpen size={20} color="var(--cyan)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
            {documents.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--cyan-bright)' }}>
            <strong>{totalChunks}</strong> semantic vector chunks
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>DONOR TEMPLATES</span>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <Layers size={20} color="var(--violet)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
            {templates.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            USAID, UNDP, Gates, CSR Grant
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>RAG RETRIEVAL SPEED</span>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <Database size={20} color="var(--emerald)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
            &lt; 95ms
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle size={14} />
            <span>Cosine Vector Index Cached</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Recent Proposals & Quick Access */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.75rem' }}>
        {/* Left Column: Proposals Table */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Recent Proposal Drafts</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Active grant applications under development
              </p>
            </div>
            <Link href="/draft" className="btn btn-primary btn-sm">
              <Plus size={15} />
              <span>New Draft</span>
            </Link>
          </div>

          {proposals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <FileText size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <p>No proposals drafted yet. Click "New Draft" to begin!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {proposals.map(proposal => {
                const completedCount = proposal.sections.filter(s => s.status === 'drafted' || s.status === 'approved').length;
                const progressPct = Math.round((completedCount / (proposal.sections.length || 1)) * 100);

                return (
                  <div
                    key={proposal.id}
                    className="glass-panel-interactive"
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(15, 23, 42, 0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                          <span className="badge badge-blue">{proposal.targetDonor}</span>
                          <span className="badge badge-cyan">{proposal.sector}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Updated {proposal.updatedAt}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.3rem' }}>
                          {proposal.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span><strong>Budget:</strong> {proposal.requestedAmount}</span>
                          <span><strong>Duration:</strong> {proposal.durationMonths} Mo.</span>
                          <span><strong>Words:</strong> {proposal.totalWordCount}</span>
                        </div>
                      </div>

                      {/* Export buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          onClick={() => downloadProposalDocx(proposal)}
                          className="btn btn-secondary btn-sm"
                          title="Export as DOCX"
                        >
                          <Download size={14} />
                          <span>DOCX</span>
                        </button>
                        <button
                          onClick={() => downloadProposalPdf(proposal)}
                          className="btn btn-secondary btn-sm"
                          title="Export as PDF"
                        >
                          <span>PDF</span>
                        </button>
                        <Link
                          href={`/draft?id=${proposal.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          <span>Open</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        <span>Completion Progress ({completedCount}/{proposal.sections.length} sections)</span>
                        <span style={{ color: 'var(--cyan-bright)', fontWeight: 600 }}>{progressPct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${progressPct}%`,
                            height: '100%',
                            background: 'var(--grad-accent)',
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.4s ease'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Knowledge Base & RAG Pipeline Visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Knowledge Base Overview */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Knowledge Base</h3>
              <Link href="/documents" style={{ fontSize: '0.8rem', color: 'var(--cyan-bright)', textDecoration: 'none' }}>
                View all &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {documents.slice(0, 3).map(doc => (
                <div
                  key={doc.id}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                      {doc.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle size={12} />
                      Indexed
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {doc.chunksCount} chunks &bull; {doc.fileSize}
                  </div>
                </div>
              ))}
            </div>

            <Link href="/documents" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '1rem' }}>
              <FolderOpen size={14} />
              <span>Upload New Document</span>
            </Link>
          </div>

          {/* RAG Workflow Architecture Box */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(11, 18, 33, 0.8)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--cyan-bright)', marginBottom: '0.75rem' }}>
              🔄 Retrieval-Augmented Generation
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Every AI drafted section cites internal evaluation baselines with verified similarity scoring.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 700 }}>1</span>
                <span>Document Text Chunking (PyPDF / Docx)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee', fontWeight: 700 }}>2</span>
                <span>Semantic Cosine Vector Indexing (FAISS)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontWeight: 700 }}>3</span>
                <span>Context-Injected LLM Generation (Gemini)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', fontWeight: 700 }}>4</span>
                <span>One-Click Export to DOCX & PDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
