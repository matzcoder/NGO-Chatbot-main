'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Plus,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  FileText,
  Sliders,
  Trash2,
  Copy
} from 'lucide-react';
import { getStoredTemplates, saveStoredTemplates, getStoredProposals, saveStoredProposals } from '@/lib/storage';
import { ProposalTemplate, NGOProposal } from '@/lib/types';
import { INITIAL_TEMPLATES } from '@/lib/sampleData';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = React.useState<ProposalTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = React.useState<ProposalTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  // New Template Form States
  const [newName, setNewName] = React.useState('');
  const [newDonor, setNewDonor] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('Bilateral');
  const [newDescription, setNewDescription] = React.useState('');

  React.useEffect(() => {
    const list = getStoredTemplates();
    setTemplates(list);
    if (list.length > 0) {
      setSelectedTemplate(list[0]);
    }
  }, []);

  const handleUseTemplate = (template: ProposalTemplate) => {
    const proposals = getStoredProposals();
    const newId = `prop-${Date.now()}`;

    const newProposal: NGOProposal = {
      id: newId,
      title: `${template.donorName} Grant Application Draft`,
      targetDonor: template.donorName,
      donorCategory: template.category,
      sector: 'Multi-Sector Community Development',
      requestedAmount: '$500,000',
      currency: 'USD',
      durationMonths: 24,
      targetRegion: 'Sub-Saharan Region',
      templateId: template.id,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      totalWordCount: 0,
      tags: [template.category, 'Template Draft'],
      sections: template.defaultSections.map((sec, idx) => ({
        id: `sec-${newId}-${idx}`,
        key: sec.key,
        title: sec.title,
        description: sec.description,
        content: '',
        status: 'empty',
        wordCount: 0
      }))
    };

    saveStoredProposals([newProposal, ...proposals]);
    router.push(`/draft?id=${newId}`);
  };

  const handleCreateTemplate = () => {
    if (!newName.trim() || !newDonor.trim()) {
      alert('Please provide template name and target donor.');
      return;
    }

    const newTpl: ProposalTemplate = {
      id: `tpl-${Date.now()}`,
      name: newName,
      donorName: newDonor,
      category: newCategory,
      description: newDescription || 'Custom donor grant proposal framework.',
      donorGuidelinesTips: [
        'Ensure alignment with stated strategic priorities and theory of change',
        'Provide rigorous monitoring and evaluation indicators'
      ],
      defaultSections: [
        {
          key: 'executive_summary',
          title: 'Executive Summary',
          description: 'High-level synthesis of objectives, problem, and expected outcomes.',
          guidelines: 'Limit to 1-2 pages.'
        },
        {
          key: 'need_statement',
          title: 'Problem Statement & Needs Assessment',
          description: 'Documented evidence and root cause analysis.',
          guidelines: 'Cite verified baseline statistics.'
        },
        {
          key: 'methodology',
          title: 'Methodology & Work Plan',
          description: 'Operational execution and community engagement.',
          guidelines: 'Include timeline and milestones.'
        },
        {
          key: 'budget',
          title: 'Budget Justification & Narrative',
          description: 'Itemized expenditures and cost efficiency justification.',
          guidelines: 'Adhere to donor indirect cost caps.'
        }
      ]
    };

    const updated = [...templates, newTpl];
    setTemplates(updated);
    setSelectedTemplate(newTpl);
    saveStoredTemplates(updated);
    setShowCreateModal(false);
    setNewName('');
    setNewDonor('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>🧩 Proposal Template Manager</span>
            <span className="badge badge-violet">{templates.length} Donor Frameworks</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Standardized proposal structures tailored for USAID, UN Agencies, Gates Foundation, and Corporate CSR
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>New Custom Template</span>
        </button>
      </div>

      {/* Main Layout: Template Cards on Left, Selected Template Details on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* Templates Selector Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {templates.map(tpl => {
            const isSelected = selectedTemplate?.id === tpl.id;

            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`glass-panel ${isSelected ? '' : 'glass-panel-interactive'}`}
                style={{
                  padding: '1.25rem',
                  border: isSelected ? '1px solid var(--border-glow)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(37, 99, 235, 0.18)' : 'var(--bg-card)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>
                    {tpl.category}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--cyan-bright)' }}>
                    {tpl.defaultSections.length} sections
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.3rem' }}>
                  {tpl.name}
                </h3>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                  Donor: <strong style={{ color: 'var(--text-secondary)' }}>{tpl.donorName}</strong>
                </p>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {tpl.description.slice(0, 110)}...
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Template Detail View */}
        {selectedTemplate && (
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-violet" style={{ marginBottom: '0.4rem' }}>
                  {selectedTemplate.category}
                </span>
                <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>
                  {selectedTemplate.name}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--cyan-bright)', marginTop: '0.2rem' }}>
                  Official Format for {selectedTemplate.donorName}
                </p>
              </div>

              <button
                onClick={() => handleUseTemplate(selectedTemplate)}
                className="btn btn-primary"
                style={{ padding: '0.7rem 1.4rem' }}
              >
                <span>Draft with this Template</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {selectedTemplate.description}
            </p>

            {/* Donor Tips */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem'
            }}>
              <h4 style={{ fontSize: '0.92rem', color: '#c084fc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={15} />
                <span>Donor Proposal Success Guidelines</span>
              </h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                {selectedTemplate.donorGuidelinesTips?.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Standard Sections Breakdown */}
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.85rem', color: '#ffffff' }}>
                Standard Template Sections ({selectedTemplate.defaultSections.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedTemplate.defaultSections.map((sec, idx) => (
                  <div
                    key={sec.key}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--cyan-bright)' }}>
                        {idx + 1}. {sec.title}
                      </strong>
                      <code style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {sec.key}
                      </code>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {sec.description}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Guidelines: {sec.guidelines}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '2rem', background: 'var(--bg-card)' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Create Proposal Template</h2>

            <div className="form-group">
              <label className="form-label">Template Name</label>
              <input
                type="text"
                placeholder="e.g. European Commission Horizon Civil Society"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Donor Organization</label>
              <input
                type="text"
                placeholder="e.g. EU Horizon Europe / DG ECHO"
                value={newDonor}
                onChange={e => setNewDonor(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
              >
                <option value="Bilateral">Bilateral Assistance</option>
                <option value="UN Agencies">UN Agencies</option>
                <option value="Philanthropic">Philanthropic Foundation</option>
                <option value="Corporate CSR">Corporate CSR & ESG</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description & Scope</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '80px' }}
                placeholder="Describe donor priorities, eligible countries, and proposal format..."
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleCreateTemplate} className="btn btn-primary">
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
