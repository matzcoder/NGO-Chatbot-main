import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'NGO Proposal Drafting Bot | GenAI-Powered RAG Platform',
  description: 'An enterprise-grade Retrieval-Augmented Generation (RAG) platform that automates NGO proposal drafting, knowledge retrieval, donor documentation, and AI-assisted grant writing.',
  keywords: ['NGO', 'Grant Proposal', 'RAG', 'Retrieval-Augmented Generation', 'FastAPI', 'Gemini', 'LangChain', 'FAISS'],
  authors: [{ name: 'P R Matthew' }]
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Header />
            <main className="page-body">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
