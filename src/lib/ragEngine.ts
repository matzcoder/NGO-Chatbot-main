import { DocumentChunk, Citation, NGODocument } from './types';

/**
 * Text tokenizer and normalizer
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2);
}

/**
 * Calculate term frequency dictionary
 */
function getTermFrequencies(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
}

/**
 * Semantic vector similarity simulation using TF-IDF + Keyword Cosine Similarity
 */
export function calculateSimilarity(query: string, content: string): number {
  const queryTokens = tokenize(query);
  const contentTokens = tokenize(content);

  if (queryTokens.length === 0 || contentTokens.length === 0) return 0;

  const queryTf = getTermFrequencies(queryTokens);
  const contentTf = getTermFrequencies(contentTokens);

  let dotProduct = 0;
  let queryNormSq = 0;
  let contentNormSq = 0;

  // Calculate norms
  for (const count of queryTf.values()) {
    queryNormSq += count * count;
  }
  for (const count of contentTf.values()) {
    contentNormSq += count * count;
  }

  // Calculate dot product
  for (const [token, qCount] of queryTf.entries()) {
    if (contentTf.has(token)) {
      const cCount = contentTf.get(token)!;
      dotProduct += qCount * cCount;
    }
  }

  const denominator = Math.sqrt(queryNormSq) * Math.sqrt(contentNormSq);
  if (denominator === 0) return 0;

  let score = dotProduct / denominator;

  // Boost for sequential phrase matches
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedContent = content.toLowerCase();
  if (normalizedContent.includes(normalizedQuery)) {
    score = Math.min(1.0, score + 0.35);
  }

  return Math.min(0.99, Math.max(0.1, Number(score.toFixed(3))));
}

/**
 * Search indexed documents and return top relevant citations
 */
export function retrieveContext(
  query: string,
  documents: NGODocument[],
  limit: number = 4,
  minThreshold: number = 0.2
): { citations: Citation[]; contextText: string } {
  const allChunks: DocumentChunk[] = [];

  for (const doc of documents) {
    if (doc.status !== 'indexed') continue;
    if (doc.chunks && doc.chunks.length > 0) {
      allChunks.push(...doc.chunks);
    } else {
      // Create a fallback chunk from summary
      allChunks.push({
        id: `chunk-${doc.id}-summary`,
        documentId: doc.id,
        documentTitle: doc.title,
        section: 'Overview',
        page: 1,
        content: doc.summary
      });
    }
  }

  const scoredChunks = allChunks.map(chunk => {
    const score = calculateSimilarity(query, `${chunk.documentTitle} ${chunk.section || ''} ${chunk.content}`);
    return {
      chunk,
      score
    };
  });

  // Sort descending by relevance score
  scoredChunks.sort((a, b) => b.score - a.score);

  const selected = scoredChunks
    .filter(item => item.score >= minThreshold)
    .slice(0, limit);

  // If no chunk passed threshold, provide the top 1 if available
  const finalItems = selected.length > 0 ? selected : scoredChunks.slice(0, 1);

  const citations: Citation[] = finalItems.map(item => ({
    documentId: item.chunk.documentId,
    documentTitle: item.chunk.documentTitle,
    section: item.chunk.section,
    page: item.chunk.page,
    snippet: item.chunk.content.slice(0, 220) + (item.chunk.content.length > 220 ? '...' : ''),
    similarityScore: item.score
  }));

  const contextText = finalItems
    .map(
      (item, idx) =>
        `[Document Source ${idx + 1}: ${item.chunk.documentTitle} | Section: ${item.chunk.section || 'General'} | Page: ${item.chunk.page || 1}]\n${item.chunk.content}`
    )
    .join('\n\n---\n\n');

  return { citations, contextText };
}

/**
 * Break raw text into semantic chunks for vector indexing
 */
export function chunkText(
  text: string,
  docId: string,
  docTitle: string,
  chunkSize: number = 600,
  overlap: number = 100
): DocumentChunk[] {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const chunks: DocumentChunk[] = [];
  let currentChunk = '';
  let chunkIndex = 1;

  for (const para of paragraphs) {
    if ((currentChunk + ' ' + para).length > chunkSize && currentChunk.length > 0) {
      chunks.push({
        id: `chunk-${docId}-${chunkIndex}`,
        documentId: docId,
        documentTitle: docTitle,
        section: `Section ${chunkIndex}`,
        page: Math.ceil(chunkIndex / 2),
        content: currentChunk.trim(),
        tokenCount: Math.round(currentChunk.length / 4)
      });
      chunkIndex++;
      // Keep overlap from previous chunk
      currentChunk = currentChunk.slice(-overlap) + ' ' + para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: `chunk-${docId}-${chunkIndex}`,
      documentId: docId,
      documentTitle: docTitle,
      section: `Section ${chunkIndex}`,
      page: Math.ceil(chunkIndex / 2),
      content: currentChunk.trim(),
      tokenCount: Math.round(currentChunk.length / 4)
    });
  }

  return chunks;
}
