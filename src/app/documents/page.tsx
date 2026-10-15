'use client';

import React from 'react';
import {
  FolderOpen,
  UploadCloud,
  FileText,
  Trash2,
  Eye,
  CheckCircle,
  Database,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Layers
} from 'lucide-react';
import { getStoredDocuments, saveStoredDocuments } from '@/lib/storage';
import { chunkText } from '@/lib/ragEngine';
import { NGODocument, DocumentChunk } from '@/lib/types';
import { INITIAL_DOCUMENTS } from '@/lib/sampleData';

export default function DocumentsPage() {
  const [documents, setDocuments] = React.useState<NGODocument[]>([]);
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [viewingDoc, setViewingDoc] = React.useState<NGODocument | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Manual Upload Form States
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState<NGODocument['category']>('Impact Report');
  const [rawText, setRawText] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [showUploadModal, setShowUploadModal] = React.useState(false);

  React.useEffect(() => {
    setDocuments(getStoredDocuments());
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      setRawText(text);
    };
    reader.readAsText(file);
  };

  const handleIngestDocument = () => {
    if (!title.trim() || !rawText.trim()) {
      alert('Please provide a document title and text content.');
      return;
    }

    setIsProcessing(true);
    const newId = `doc-${Date.now()}`;
    const chunks = chunkText(rawText, newId, title, 600, 100);

    const newDoc: NGODocument = {
      id: newId,
      title,
      fileName: fileName || `${title.replace(/\s+/g, '_')}.txt`,
      fileType: (fileName.endsWith('.pdf') ? 'pdf' : fileName.endsWith('.docx') ? 'docx' : 'txt') as any,
      fileSize: `${(rawText.length / 1024).toFixed(1)} KB`,
      category,
      uploadDate: new Date().toISOString().split('T')[0],
      chunksCount: chunks.length,
      status: 'indexed',
      summary: rawText.slice(0, 250) + '...',
      tags: [category, 'User Uploaded'],
      chunks
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveStoredDocuments(updated);

    // Reset Form
    setTitle('');
    setRawText('');
    setFileName('');
    setShowUploadModal(false);
    setIsProcessing(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this document from the vector knowledge base?')) {
      const updated = documents.filter(d => d.id !== id);
      setDocuments(updated);
      saveStoredDocuments(updated);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset knowledge base to default sample NGO documents?')) {
      setDocuments(INITIAL_DOCUMENTS);
      saveStoredDocuments(INITIAL_DOCUMENTS);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>📂 Document Management Center</span>
            <span className="badge badge-emerald">FAISS / Vector Index Online</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Upload, chunk, and index past proposals, evaluations, and donor guidelines into semantic vector store
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleResetDefaults} className="btn btn-secondary btn-sm" title="Restore sample documents">
            <RefreshCw size={14} />
            <span>Restore Defaults</span>
          </button>
          <button onClick={() => setShowUploadModal(true)} className="btn btn-primary btn-sm">
            <UploadCloud size={16} />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="form-control"
            placeholder="Search indexed documents by title, keyword, or impact metrics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '0.55rem 0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} color="var(--text-muted)" />
          <select
            className="form-select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="All">All Categories</option>
            <option value="Impact Report">Impact Reports</option>
            <option value="Baseline Study">Baseline Studies</option>
            <option value="Donor Guidelines">Donor Guidelines</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid-2">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="glass-panel"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span className="badge badge-cyan">{doc.category}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="pulse-dot" />
                <span style={{ fontSize: '0.72rem', color: 'var(--emerald)', fontWeight: 600 }}>Indexed</span>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.3rem' }}>
                {doc.title}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                File: <code style={{ color: 'var(--cyan-bright)' }}>{doc.fileName}</code> &bull; Size: {doc.fileSize} &bull; Uploaded {doc.uploadDate}
              </p>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {doc.summary}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {doc.tags.map((t, idx) => (
                <span key={idx} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(30, 41, 59, 0.6)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  #{t}
                </span>
              ))}
            </div>

            {/* Footer with chunk count and actions */}
            <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--cyan-bright)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={14} />
                <strong>{doc.chunksCount}</strong> Vector Chunks
              </span>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  onClick={() => setViewingDoc(doc)}
                  className="btn btn-secondary btn-sm"
                  title="Inspect Vector Chunks"
                >
                  <Eye size={13} />
                  <span>Inspect Chunks</span>
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="btn btn-danger btn-sm"
                  title="Remove from knowledge base"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>Upload &amp; Index NGO Document</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {/* File Drag and Drop / Input */}
            <div className="form-group">
              <label className="form-label">Select File (PDF, DOCX, TXT, MD)</label>
              <input
                type="file"
                accept=".txt,.md,.pdf,.docx"
                onChange={handleFileUpload}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Document Title</label>
              <input
                type="text"
                placeholder="e.g. 2024 Education & School Feeding Evaluation"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={e => setCategory(e.target.value as any)}
              >
                <option value="Impact Report">Impact Report</option>
                <option value="Baseline Study">Baseline Study</option>
                <option value="Past Proposal">Past Proposal</option>
                <option value="Donor Guidelines">Donor Guidelines</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Document Text Content (Extracted)</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '140px', fontSize: '0.85rem' }}
                placeholder="Paste or review extracted text from the document here..."
                value={rawText}
                onChange={e => setRawText(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowUploadModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleIngestDocument} disabled={isProcessing} className="btn btn-primary">
                {isProcessing ? 'Generating Vector Embeddings...' : 'Chunk & Index Document'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Chunks Modal */}
      {viewingDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '85vh', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: '0.4rem' }}>{viewingDoc.category}</span>
                <h2 style={{ fontSize: '1.25rem', color: '#ffffff' }}>{viewingDoc.title}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Total {viewingDoc.chunks?.length || viewingDoc.chunksCount} semantic chunks indexed
                </p>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
              {viewingDoc.chunks?.map((chunk, idx) => (
                <div
                  key={chunk.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.75rem' }}>
                    <strong style={{ color: 'var(--cyan-bright)' }}>
                      Chunk #{idx + 1} &bull; {chunk.section || 'General'}
                    </strong>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Page {chunk.page || 1} &bull; ~{chunk.tokenCount || Math.round(chunk.content.length / 4)} tokens
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                    {chunk.content}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button onClick={() => setViewingDoc(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
