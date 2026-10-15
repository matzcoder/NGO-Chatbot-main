export type UserRole = 'user' | 'admin';

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  page?: number;
  section?: string;
  content: string;
  tokenCount?: number;
}

export interface NGODocument {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'md';
  fileSize: string;
  category: 'Impact Report' | 'Baseline Study' | 'Past Proposal' | 'Donor Guidelines' | 'Financial Audit';
  uploadDate: string;
  chunksCount: number;
  status: 'indexed' | 'processing' | 'failed';
  summary: string;
  tags: string[];
  chunks?: DocumentChunk[];
}

export interface Citation {
  documentId: string;
  documentTitle: string;
  section?: string;
  page?: number;
  snippet: string;
  similarityScore: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: Citation[];
  thoughtProcess?: string;
}

export interface ProposalSection {
  id: string;
  key: string;
  title: string;
  description: string;
  content: string;
  status: 'empty' | 'generating' | 'drafted' | 'approved';
  wordCount: number;
  lastUpdated?: string;
  citations?: Citation[];
}

export interface ProposalTemplate {
  id: string;
  name: string;
  donorName: string;
  category: string;
  description: string;
  defaultSections: Array<{
    key: string;
    title: string;
    description: string;
    guidelines: string;
  }>;
  donorGuidelinesTips: string[];
}

export interface NGOProposal {
  id: string;
  title: string;
  targetDonor: string;
  donorCategory: string;
  sector: string;
  requestedAmount: string;
  currency: string;
  durationMonths: number;
  targetRegion: string;
  templateId: string;
  status: 'draft' | 'under_review' | 'finalized' | 'submitted';
  createdAt: string;
  updatedAt: string;
  totalWordCount: number;
  sections: ProposalSection[];
  tags: string[];
}

export interface AppSettings {
  llmProvider: 'gemini' | 'openai' | 'simulated';
  geminiApiKey: string;
  openaiApiKey: string;
  systemPrompt: string;
  temperature: number;
  citationThreshold: number;
  activeRole: UserRole;
  vectorDbStatus: 'online' | 'indexing' | 'idle';
}
