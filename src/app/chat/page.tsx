'use client';

import React from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  FileText,
  Trash2,
  ExternalLink,
  ChevronRight,
  Info,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { getStoredChatMessages, saveStoredChatMessages, getStoredDocuments, getStoredSettings } from '@/lib/storage';
import { ChatMessage, Citation } from '@/lib/types';

export default function ChatPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [selectedCitation, setSelectedCitation] = React.useState<Citation | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMessages(getStoredChatMessages());
  }, []);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    saveStoredChatMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const docs = getStoredDocuments();
      const settings = getStoredSettings();

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          documents: docs,
          apiKey: settings.geminiApiKey,
          provider: settings.llmProvider
        })
      });

      if (!res.ok) {
        throw new Error('Chat API returned an error');
      }

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: data.response || 'No response generated.',
        timestamp: new Date().toISOString(),
        citations: data.citations || []
      };

      const finalMessages = [...updated, botMsg];
      setMessages(finalMessages);
      saveStoredChatMessages(finalMessages);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: `I encountered an issue retrieving information. Please ensure documents are indexed or try again. (${err.message})`,
        timestamp: new Date().toISOString()
      };
      setMessages([...updated, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear chat history?')) {
      const reset: ChatMessage[] = [];
      setMessages(reset);
      saveStoredChatMessages(reset);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const samplePrompts = [
    'What were our clean water and borehole impact metrics in 2024?',
    'Summarize our women empowerment program outcomes and median income growth.',
    'What are the allowable principles for direct vs indirect costs in donor grants?',
    'What were the maternal mortality and health center baseline figures?'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)', gap: '1rem' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>📚 Knowledge Base Q&amp;A</span>
            <span className="badge badge-cyan">RAG Semantic Search</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Chat with indexed organizational documents, reports, and guidelines with verifiable citations
          </p>
        </div>

        <button onClick={clearChat} className="btn btn-secondary btn-sm" title="Clear chat history">
          <Trash2 size={14} />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Main Chat Layout: Left Chat Stream, Right Citation Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedCitation ? '1fr 340px' : '1fr', gap: '1rem', flex: 1, minHeight: 0 }}>
        {/* Messages Stream Container */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'rgba(15, 23, 42, 0.6)'
          }}
        >
          {/* Chat history scroll area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                <Bot size={48} color="var(--cyan-bright)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                  Ask Your NGO Knowledge Base
                </h3>
                <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
                  The RAG engine will search your uploaded documents, retrieve relevant passages, and provide citation-backed answers.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: '650px', margin: '0 auto' }}>
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p)}
                      style={{
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.5rem 0.85rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--cyan)';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      &ldquo;{p}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '0.85rem',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: msg.sender === 'user' ? '75%' : '88%'
                  }}
                >
                  {msg.sender === 'assistant' && (
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--grad-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: 'var(--shadow-cyan)'
                    }}>
                      <Sparkles size={16} color="#ffffff" />
                    </div>
                  )}

                  <div
                    style={{
                      background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(30, 41, 59, 0.85)',
                      color: '#ffffff',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-sm)',
                      position: 'relative'
                    }}
                  >
                    {/* Message Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: msg.sender === 'user' ? '#93c5fd' : 'var(--cyan-bright)' }}>
                        {msg.sender === 'user' ? 'You' : 'NGO Knowledge Assistant'}
                      </span>
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }}
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check size={14} color="#34d399" /> : <Copy size={13} />}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="markdown-body" style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </div>

                    {/* Citations list if present */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--cyan-bright)', fontWeight: 600, marginBottom: '0.4rem' }}>
                          VERIFIED INSTITUTIONAL CITATIONS ({msg.citations.length}):
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {msg.citations.map((c, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedCitation(c)}
                              className="citation-pill"
                            >
                              <FileText size={12} />
                              <span>{c.documentTitle}</span>
                              {c.page && <span>p.{c.page}</span>}
                              <span style={{ opacity: 0.75 }}>({Math.round(c.similarityScore * 100)}%)</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(71, 85, 105, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User size={16} color="#ffffff" />
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div style={{ display: 'flex', gap: '0.85rem', alignSelf: 'flex-start' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--grad-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-cyan)'
                }}>
                  <RefreshCw size={16} color="#ffffff" className="spin-animation" />
                </div>
                <div style={{
                  background: 'rgba(30, 41, 59, 0.85)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.85rem',
                  color: 'var(--cyan-bright)'
                }}>
                  <span className="pulse-dot" />
                  <span>Searching knowledge base vectors and generating response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions pills when chat is active */}
          {messages.length > 0 && (
            <div style={{
              padding: '0.4rem 1.25rem',
              background: 'rgba(11, 18, 33, 0.7)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}>
              {samplePrompts.slice(0, 3).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.2rem 0.65rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--cyan-bright)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  {p.slice(0, 45)}...
                </button>
              ))}
            </div>
          )}

          {/* Input field box */}
          <div style={{ padding: '1rem 1.25rem', background: 'rgba(11, 18, 33, 0.95)', borderTop: '1px solid var(--border-subtle)' }}>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Ask questions about past programs, impact metrics, M&E targets, or donor policies..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                style={{ padding: '0.8rem 1rem', fontSize: '0.92rem' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="btn btn-primary"
                style={{ padding: '0.8rem 1.5rem', flexShrink: 0 }}
              >
                <Send size={16} />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Citation Details Drawer */}
        {selectedCitation && (
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                Verified Citation Excerpt
              </span>
              <button
                onClick={() => setSelectedCitation(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                &times;
              </button>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                SOURCE DOCUMENT:
              </div>
              <h4 style={{ fontSize: '0.95rem', color: '#ffffff', lineHeight: 1.3 }}>
                {selectedCitation.documentTitle}
              </h4>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span><strong>Section:</strong> {selectedCitation.section || 'General'}</span>
              <span><strong>Page:</strong> {selectedCitation.page || 1}</span>
            </div>

            <div style={{
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>RAG Cosine Match Score</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--cyan-bright)' }}>
                {Math.round(selectedCitation.similarityScore * 100)}% Match
              </span>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                EXACT DOCUMENT SNIPPET:
              </div>
              <blockquote style={{
                background: 'rgba(15, 23, 42, 0.8)',
                borderLeft: '3px solid var(--cyan)',
                padding: '0.75rem',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                fontSize: '0.82rem',
                color: '#cbd5e1',
                lineHeight: 1.5,
                fontStyle: 'italic'
              }}>
                &ldquo;{selectedCitation.snippet}&rdquo;
              </blockquote>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              This evidence is cached in the local vector index and injected into the LLM prompt context during synthesis.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
