import { NGODocument, ProposalTemplate, NGOProposal, AppSettings, ChatMessage } from './types';
import { INITIAL_DOCUMENTS, INITIAL_TEMPLATES, INITIAL_PROPOSALS, INITIAL_SETTINGS } from './sampleData';

const STORAGE_KEYS = {
  DOCUMENTS: 'ngo_bot_documents',
  TEMPLATES: 'ngo_bot_templates',
  PROPOSALS: 'ngo_bot_proposals',
  SETTINGS: 'ngo_bot_settings',
  CHAT_MESSAGES: 'ngo_bot_chat_messages',
};

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function getStoredDocuments(): NGODocument[] {
  if (!isClient()) return INITIAL_DOCUMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
      return INITIAL_DOCUMENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading documents from storage:', err);
    return INITIAL_DOCUMENTS;
  }
}

export function saveStoredDocuments(docs: NGODocument[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  } catch (err) {
    console.error('Error saving documents to storage:', err);
  }
}

export function getStoredTemplates(): ProposalTemplate[] {
  if (!isClient()) return INITIAL_TEMPLATES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_TEMPLATES));
      return INITIAL_TEMPLATES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading templates:', err);
    return INITIAL_TEMPLATES;
  }
}

export function saveStoredTemplates(templates: ProposalTemplate[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  } catch (err) {
    console.error('Error saving templates:', err);
  }
}

export function getStoredProposals(): NGOProposal[] {
  if (!isClient()) return INITIAL_PROPOSALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(INITIAL_PROPOSALS));
      return INITIAL_PROPOSALS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading proposals:', err);
    return INITIAL_PROPOSALS;
  }
}

export function saveStoredProposals(proposals: NGOProposal[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
  } catch (err) {
    console.error('Error saving proposals:', err);
  }
}

export function getStoredSettings(): AppSettings {
  if (!isClient()) return INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading settings:', err);
    return INITIAL_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

export function getStoredChatMessages(): ChatMessage[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (!raw) {
      const defaultIntro: ChatMessage[] = [
        {
          id: 'welcome-msg',
          sender: 'assistant',
          content: `Hello! I am your **NGO Proposal & Knowledge Assistant**. 

I have indexed your organizational knowledge base including **Clean Water Impact Reports**, **Women Vocational Evaluations**, **Maternal Health Baselines**, and **Donor Compliance Guidelines**.

You can ask me questions about your past programs, request specific metrics, or ask me to draft proposal text with verified citations!`,
          timestamp: new Date().toISOString(),
          citations: [
            {
              documentId: 'doc-1',
              documentTitle: 'Clean Water & Sanitation Initiative Annual Impact Report',
              section: 'Executive Summary',
              page: 2,
              snippet: 'Installed 36 solar-powered deep borehole water distribution systems reaching 42,000 citizens with a 74% decrease in waterborne diarrheal illnesses.',
              similarityScore: 0.98
            }
          ]
        }
      ];
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(defaultIntro));
      return defaultIntro;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading chat messages:', err);
    return [];
  }
}

export function saveStoredChatMessages(messages: ChatMessage[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
  } catch (err) {
    console.error('Error saving chat messages:', err);
  }
}
